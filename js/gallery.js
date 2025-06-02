/**
 * 图片库主要功能实现
 * 实现图片加载、过滤、模态框展示等功能
 */

// 保存所有图片数据
let allImages = [];
// 当前应用的过滤器
let activeFilters = new Set();

// Pagination state
let currentPage = 1;
const itemsPerPage = 16;
let currentImageSet = []; // Holds the current set of images being paginated (all or filtered)

// 模拟扫描images文件夹的函数（在实际部署中，这里需要由后端生成数据）
// 由于我们不能直接访问文件系统，这里模拟数据结构
async function fetchImagesData() {
    try {
        const response = await fetch('images_data.json'); // Load data from images_data.json
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const images = await response.json();
        // Map the loaded data to the structure expected by the gallery
        return images.map(img => {
            // Check for malformed or incomplete entries
            if (!img || typeof img.originalSrc !== 'string' || img.originalSrc.trim() === '' || typeof img.thumbnailSrc !== 'string' || img.thumbnailSrc.trim() === '') {
                console.warn('Skipping malformed image data entry (missing or invalid originalSrc/thumbnailSrc):', img);
                return null; // This entry will be filtered out
            }

            const imageWidth = img.dimensions ? img.dimensions.width : 0;
            const imageHeight = img.dimensions ? img.dimensions.height : 0;

            return {
                id: img.id || `generated-${Math.random().toString(36).substr(2, 9)}`,
                src: img.thumbnailSrc, // Use thumbnail for gallery display
                originalSrc: img.originalSrc, // Store original source for modal
                alt: img.name || 'Image',
                name: img.name || 'Unnamed Image',
                dimensions: (imageWidth && imageHeight) ? `${imageWidth}x${imageHeight}` : 'Unknown Dimensions',
                tags: Array.isArray(img.tags) ? img.tags : []
            };
        }).filter(imgObject => imgObject !== null); // Remove any null entries that were skipped
    } catch (error) {
        console.error('加载图片数据失败 (Failed to load image data):', error);
        document.getElementById('gallery-container').innerHTML = 
            '<p class="text-red-500 text-center">无法加载图片数据，请检查 images_data.json 文件是否存在且格式正确。</p>';
        return []; // Return empty array on error to prevent further issues
    }
}

// 创建动态标签过滤器
function createTagFilters() {
    // 从图片数据中提取所有唯一标签
    const characterTags = new Set();
    const starLevelTags = new Set();
    const otherTags = new Set();
    
    allImages.forEach(image => {
        image.tags.forEach(tag => {
            // 根据tag分类
            if (['Xaiver', 'Zayne', 'Rafayel', 'Sylus', 'Caleb'].includes(tag)) {
                characterTags.add(tag);
            } else if (['五星', '四星'].includes(tag)) {
                starLevelTags.add(tag);
            } else {
                otherTags.add(tag);
            }
        });
    });
    
    // 创建人物标签
    const characterTagsEl = document.getElementById('character-tags');
    characterTagsEl.innerHTML = '';
    
    Array.from(characterTags).forEach(tag => {
        characterTagsEl.appendChild(createTagElement(tag, 'character'));
    });
    
    // 创建星级标签
    const starTagsEl = document.getElementById('star-tags');
    starTagsEl.innerHTML = '';
    
    Array.from(starLevelTags).forEach(tag => {
        starTagsEl.appendChild(createTagElement(tag, 'star'));
    });
    
    // 创建其他标签
    const otherTagsEl = document.getElementById('other-tags');
    otherTagsEl.innerHTML = '';
    
    Array.from(otherTags).forEach(tag => {
        otherTagsEl.appendChild(createTagElement(tag, 'other'));
    });
}

// 创建标签元素
function createTagElement(tag, category) {
    const tagEl = document.createElement('div');
    tagEl.className = 'tag flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-200';
    tagEl.setAttribute('data-tag', tag);
    tagEl.setAttribute('data-tag-orig', tag);
    tagEl.setAttribute('data-category', category);
    
    tagEl.innerHTML = `
        <span class="w-4 h-4 inline-block rounded mr-2 border flex-shrink-0" style="background-color: ${getTagColor(tag)}"></span>
        <span class="tag-text">${translateTag(tag)}</span>
        <span class="flex-grow"></span>
        <span class="tag-count text-xs text-gray-500"></span>
    `;
    
    // 更新标签计数
    updateTagCount(tagEl);
    
    // 添加点击事件
    tagEl.addEventListener('click', () => {
        toggleFilter(tagEl); // Pass the element itself
    });
    
    return tagEl;
}

// 获取标签颜色
function getTagColor(tag) {
    // 为不同的标签分配不同的颜色
    const colorMap = {
        // 人物
        'Xaiver': '#3b82f6',  // 蓝色
        'Zayne': '#8b5cf6',   // 紫色
        'Rafayel': '#ef4444', // 红色
        'Sylus': '#10b981',   // 绿色
        'Caleb': '#f59e0b',   // 橙色
        
        // 星级
        '五星': '#fcd34d',     // 金色
        '四星': '#a78bfa',     // 紫色
        
        // 其他
        '其他': '#9ca3af',     // 灰色
        '背景': '#6ee7b7',     // 浅绿色
        '主线': '#93c5fd',     // 浅蓝色
        
        // 默认颜色
        'default': '#d1d5db'
    };
    
    return colorMap[tag] || colorMap['default'];
}

// 更新标签的计数
function updateTagCount(tagEl) {
    const tag = tagEl.getAttribute('data-tag');
    const count = allImages.filter(image => image.tags.includes(tag)).length;
    
    const countEl = tagEl.querySelector('.tag-count');
    if (countEl) {
        countEl.textContent = count;
    }
}

// 切换筛选器状态
function toggleFilter(clickedTagEl) {
    const clickedTag = clickedTagEl.getAttribute('data-tag');
    const clickedCategory = clickedTagEl.getAttribute('data-category');
    const wasActive = activeFilters.has(clickedTag);

    if (wasActive) {
        // Deactivating the clicked tag
        activeFilters.delete(clickedTag);
        clickedTagEl.classList.remove('bg-gray-200'); 
    } else {
        // Activating the clicked tag
        // 1. Deactivate other tags in the same category
        const categoryContainerId = `${clickedCategory}-tags`; // e.g., 'character-tags', 'star-tags', 'other-tags'
        const categoryContainer = document.getElementById(categoryContainerId);
        if (categoryContainer) {
            const siblingTagElements = categoryContainer.querySelectorAll('.tag');
            siblingTagElements.forEach(siblingEl => {
                if (siblingEl !== clickedTagEl) { // Don't deselect the one we are about to activate
                    const siblingTag = siblingEl.getAttribute('data-tag');
                    if (activeFilters.has(siblingTag)) {
                        activeFilters.delete(siblingTag);
                        siblingEl.classList.remove('bg-gray-200'); 
                    }
                }
            });
        }

        // 2. Activate the clicked tag
        activeFilters.add(clickedTag);
        clickedTagEl.classList.add('bg-gray-200');
    }

    // 应用过滤器并更新显示
    applyFilters();
}

// 应用所有活动的筛选器
function applyFilters() {
    const noResultsEl = document.getElementById('no-results');
    
    currentPage = 1; // Reset to first page when filters change

    let imagesToProcess;
    if (activeFilters.size === 0) {
        imagesToProcess = allImages;
        noResultsEl.classList.add('hidden');
    } else {
        imagesToProcess = allImages.filter(image => {
            return Array.from(activeFilters).every(filterTag => image.tags.includes(filterTag));
        });

        if (imagesToProcess.length === 0) {
            noResultsEl.classList.remove('hidden');
        } else {
            noResultsEl.classList.add('hidden');
        }
    }
    currentImageSet = imagesToProcess; // Update the current set for pagination
    renderGalleryAndPagination(currentImageSet); 
}

// 渲染图库 (now paginated)
function renderGallery(imagesToDisplay) {
    const galleryEl = document.getElementById('gallery-container');
    galleryEl.innerHTML = ''; // Clear previous items

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedItems = imagesToDisplay.slice(startIndex, endIndex);

    if (paginatedItems.length === 0 && imagesToDisplay.length > 0 && currentPage > 1) {
        // This case means we are on a page that no longer exists after filtering, try going to page 1
        // This should ideally be handled by resetting currentPage in applyFilters
        // For now, this will just render an empty gallery for this page.
    } else if (paginatedItems.length === 0 && imagesToDisplay.length === 0 && activeFilters.size > 0) {
        // This is handled by applyFilters showing noResultsEl
    }

    paginatedItems.forEach(image => {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-container bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-xl';
        
        imageCard.innerHTML = `
            <div class="relative pb-[100%]">
                <img 
                    src="${image.src}" 
                    alt="${image.alt}" 
                    class="image-thumbnail absolute top-0 left-0 w-full h-full object-cover"
                    loading="lazy" 
                    onerror="this.onerror=null; this.src='https://via.placeholder.com/400?text=图片加载失败';"
                >
            </div>
        `;
        
        imageCard.addEventListener('click', () => {
            openModal(image);
        });
        
        galleryEl.appendChild(imageCard);
    });
}

// 渲染分页控件 (shows clickable page numbers)
function renderPaginationControls(totalItems) {
    const controlsContainer = document.getElementById('pagination-controls');
    controlsContainer.innerHTML = ''; // Clear old controls

    if (totalItems === 0) {
        return; // No items, no pagination
    }

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) {
        return; // Only one page (or no pages if totalItems was >0 but < itemsPerPage leading to totalPages=1), no controls needed
    }

    const ul = document.createElement('ul');
    ul.className = 'flex justify-center items-center space-x-1'; // Tailwind for list styling

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        // Base styling for page buttons
        pageButton.className = 'px-3 py-1 rounded text-sm transition-colors duration-150 ease-in-out'; 

        if (i === currentPage) {
            // Active page styling
            pageButton.classList.add('bg-blue-500', 'text-white', 'font-semibold', 'cursor-default');
            pageButton.disabled = true; // Disable clicking the current page
        } else {
            // Inactive page styling
            pageButton.classList.add('bg-gray-200', 'hover:bg-gray-300', 'text-gray-700');
            pageButton.addEventListener('click', () => {
                currentPage = i;
                renderGalleryAndPagination(currentImageSet);
            });
        }
        li.appendChild(pageButton);
        ul.appendChild(li);
    }
    controlsContainer.appendChild(ul);
}

// Helper to render both gallery and pagination
function renderGalleryAndPagination(images) {
    renderGallery(images); 
    renderPaginationControls(images.length);
}

// 打开模态框
function openModal(image) {
    const modal = document.getElementById('image-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDimensionsEl = document.getElementById('modal-dimensions'); // Get the new element
    const modalTagsContainer = document.getElementById('modal-tags');
    const downloadButton = document.getElementById('download-button'); // Use the ID from index.html

    if (!modal || !modalTitle || !modalImage || !modalTagsContainer || !downloadButton) {
        console.error('Modal elements not found!');
        return;
    }

    // 设置模态框内容
    modalImage.src = image.originalSrc; // Load full image in modal // Set the image source
    modalImage.alt = image.name; // Use name for alt text, consistent with gallery
    // Do not display image name in title as requested
    modalTitle.textContent = "";

    // Display dimensions
    if (modalDimensionsEl) {
        const dimensionsLabel = languages[currentLanguage]?.['dimensionsLabel'] || 'Dimensions:';
        const unknownDimensions = languages[currentLanguage]?.['unknown'] || 'Unknown';
        modalDimensionsEl.textContent = `${dimensionsLabel} ${image.dimensions || unknownDimensions}`;
    } else {
        console.warn('Modal dimensions element (modal-dimensions) not found.');
    }

    // Display tags
    modalTagsContainer.innerHTML = ''; // Clear previous tags
    if (image.tags && image.tags.length > 0) {
        image.tags.forEach(tag => {
            const tagSpan = document.createElement('span');
            tagSpan.className = 'inline-block text-xs px-2 py-1 rounded mr-1 mb-1';
            tagSpan.style.backgroundColor = getTagColor(tag) + '25'; // Adding alpha for background
            tagSpan.style.color = getTagColor(tag);
            tagSpan.textContent = translateTag(tag);
            // 保存原始标签值以便正确翻译
            tagSpan.setAttribute('data-original-tag', tag);
            modalTagsContainer.appendChild(tagSpan);
        });
        // Store all original tags for the container
        modalTagsContainer.setAttribute('data-original-tags', image.tags.join(','));
    } else {
        const noTagsLabel = languages[currentLanguage]?.['noTagsLabel'] || 'No tags';
        modalTagsContainer.textContent = noTagsLabel;
    }

    // 设置下载链接
    console.log('Setting download link to:', image.originalSrc, 'thumbnail was:', image.src); // Debug log
    
    // 确保使用原图路径 - 如果 originalSrc 已经包含 thumbnails，则替换成原图路径
    let downloadPath = image.originalSrc;
    
    // 检查是否使用了缩略图路径
    if (downloadPath.includes('/thumbnails/')) {
        // 将缩略图路径替换为原图路径
        downloadPath = downloadPath.replace('/thumbnails/', '/'); 
        console.log('Fixed download path to:', downloadPath);
    } else if (image.src && image.src !== image.originalSrc && image.src.includes('/thumbnails/')) {
        // 如果 originalSrc 没有指向正确的原图，使用 src 作为基础进行转换
        downloadPath = image.src.replace('/thumbnails/', '/');
        console.log('Using src-based download path:', downloadPath);
    }
    
    // 设置下载路径
    downloadButton.href = downloadPath;
    
    // 生成文件名
    const filename = image.name ? image.name.replace(/[^a-zA-Z0-9_.-]/g, '_') : 'image';
    const extension = downloadPath.split('.').pop() || 'png'; // 使用下载路径获取文件扩展名
    downloadButton.download = `${filename}.${extension}`;
    
    // 强制浏览器重新评估下载属性
    downloadButton.setAttribute('href', downloadPath);

    // 显示模态框
    modal.classList.remove('hidden');
    document.body.classList.add('overflow-hidden'); // 防止背景滚动
}

// 关闭模态框
function closeModal() {
    const modal = document.getElementById('image-modal');
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
}

// 清除所有过滤器
function clearAllFilters() {
    activeFilters.clear();
    
    // 重置所有标签的视觉样式
    document.querySelectorAll('.tag').forEach(tag => {
        tag.classList.remove('bg-gray-200');
    });
    
    // 应用（空的）过滤器
    applyFilters();
}

// 初始化函数
async function initGallery() {
    const loadingEl = document.getElementById('loading-gallery');
    loadingEl.classList.remove('hidden');

    allImages = await fetchImagesData();
    currentImageSet = allImages; // Initialize currentImageSet with all images
    
    loadingEl.classList.add('hidden');

    if (allImages.length > 0) {
        createTagFilters(); 
        renderGalleryAndPagination(currentImageSet); // Initial render with pagination
        updatePageTranslations(); 
    } 
    // If allImages is empty, fetchImagesData might have shown an error, 
    // or gallery will be empty and no pagination controls will appear.

    const clearFiltersButton = document.getElementById('clear-filters-btn');
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', clearAllFilters);
    }
}

// 定义全局模态框关闭函数（供HTML调用）
window.closeModal = closeModal;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initGallery);

// 添加Escape键关闭模态框
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
});
