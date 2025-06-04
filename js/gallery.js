/**
 * 图片库主要功能实现
 * 实现图片加载、过滤、模态框展示等功能
 */

// 保存所有图片数据
let allImages = [];
// 当前应用的过滤器
let activeFilters = new Set(); // Stores active tag strings
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

            let imageWidthNum = 0;
            let imageHeightNum = 0;
            if (img.dimensions) {
                if (typeof img.dimensions === 'string' && img.dimensions.includes('x')) {
                    const parts = img.dimensions.split('x');
                    imageWidthNum = parseInt(parts[0], 10) || 0;
                    imageHeightNum = parseInt(parts[1], 10) || 0;
                } else if (typeof img.dimensions === 'object' && img.dimensions.width && img.dimensions.height) {
                    imageWidthNum = parseInt(img.dimensions.width, 10) || 0;
                    imageHeightNum = parseInt(img.dimensions.height, 10) || 0;
                }
            }

            return {
                id: img.id || `generated-${Math.random().toString(36).substr(2, 9)}`,
                src: img.thumbnailSrc, // Use thumbnail for gallery display
                originalSrc: img.originalSrc, // Store original source for modal
                alt: img.name || 'Image',
                name: img.name || 'Unnamed Image',
                dimensions: (imageWidthNum && imageHeightNum) ? `${imageWidthNum}x${imageHeightNum}` : 'Unknown Dimensions',
                width: imageWidthNum,
                height: imageHeightNum,
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

// 创建动态标签过滤器 (all tags in one container)
function createTagFilters() {
    const allUniqueTags = new Set();
    allImages.forEach(image => {
        if (image.tags && Array.isArray(image.tags)) {
            image.tags.forEach(tag => allUniqueTags.add(tag));
        }
    });

    const allTagsContainer = document.getElementById('all-tags-container');
    if (!allTagsContainer) {
        console.error('Element with ID "all-tags-container" not found.');
        return;
    }
    allTagsContainer.innerHTML = ''; // Clear previous tags

    // Sort tags alphabetically for consistent order, or any other preferred order
    const sortedTags = Array.from(allUniqueTags).sort((a, b) => a.localeCompare(b));

    sortedTags.forEach(tag => {
        allTagsContainer.appendChild(createTagElement(tag)); // Pass only the tag
    });
}

// 创建标签元素 (simplified style, no category, no count)
function createTagElement(tag) { // category parameter removed
    const tagEl = document.createElement('div');
    // New style: clean, button-like, similar to image card style as requested
    tagEl.className = 'tag py-1 px-2.5 bg-gray-700 text-gray-200 rounded text-xs cursor-pointer hover:bg-gray-600 transition-all duration-150 ease-in-out';
    tagEl.dataset.tag = tag;
    tagEl.dataset.tagOrig = tag; // For translation purposes
    
    const tagText = document.createElement('span');
    tagText.className = 'tag-text';
    tagText.textContent = translateTag(tag); // Use translated tag name via our wrapper
    tagText.dataset.i18nTag = tag; // To find element for dynamic translation updates
    
    tagEl.appendChild(tagText);
    
    tagEl.addEventListener('click', function() {
        toggleFilter(this); // 'this' refers to tagEl
    });
    
    return tagEl;
}

// getTagColor function is removed as tags will have a uniform style.

// 切换筛选器状态
function toggleFilter(clickedTagEl) {
    const clickedTag = clickedTagEl.dataset.tag; // Use dataset for consistency
    const wasActive = activeFilters.has(clickedTag);

    if (wasActive) {
        activeFilters.delete(clickedTag);
        // Standard style for inactive tag (matches new initial style in createTagElement for navbar)
        clickedTagEl.classList.remove('bg-blue-500', 'text-white', 'font-semibold');
        clickedTagEl.classList.add('bg-gray-700', 'text-gray-200'); // Navbar inactive style
    } else {
        activeFilters.add(clickedTag);
        // Style for active tag
        clickedTagEl.classList.remove('bg-gray-700', 'text-gray-200'); // Remove navbar inactive style
        clickedTagEl.classList.add('bg-blue-500', 'text-white', 'font-semibold');
    }

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
        // Style for prominent image display, respecting aspect ratio
        imageCard.className = 'image-card-item block w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer';

        const aspectRatioDiv = document.createElement('div');
        aspectRatioDiv.className = 'relative'; // For absolute positioning of the img

        // Calculate padding-bottom for aspect ratio from numeric width/height
        const imgNumericWidth = image.width && image.width > 0 ? image.width : 1;
        const imgNumericHeight = image.height && image.height > 0 ? image.height : 1;
        const ratioPercent = (imgNumericHeight / imgNumericWidth) * 100;
        
        aspectRatioDiv.style.paddingBottom = `${ratioPercent}%`;

        const imgElement = document.createElement('img');
        imgElement.src = image.src; // Thumbnail source
        imgElement.alt = image.alt || image.name || '';
        imgElement.className = 'image-thumbnail absolute top-0 left-0 w-full h-full object-cover';
        imgElement.loading = 'lazy';
        imgElement.onerror = function() {
            this.onerror = null;
            // More descriptive placeholder if needed, or a local placeholder image
            this.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image'; 
            console.error('Image load error:', image.src);
        };

        aspectRatioDiv.appendChild(imgElement);
        imageCard.appendChild(aspectRatioDiv);
        
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
            // Apply a generic, clean style for tags in the modal
            tagSpan.className = 'inline-block bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-1 mb-1';
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
    
    // 重置所有标签的视觉样式到默认非激活状态
    document.querySelectorAll('.tag').forEach(tagEl => {
        tagEl.classList.remove('bg-blue-500', 'text-white', 'font-semibold');
        tagEl.classList.add('bg-gray-100', 'text-gray-800');
    });
    
    // 应用（空的）过滤器
    applyFilters();
}

// 初始化函数
async function initGallery() {
    const loadingEl = document.getElementById('loading-gallery');
    loadingEl.classList.remove('hidden');

    allImages = await fetchImagesData();
    currentImageSet = allImages;
    console.log(`fetchImagesData completed. Number of images loaded: ${allImages.length}`);

    loadingEl.classList.add('hidden');

    if (allImages.length > 0) {
        const noResultsEl = document.getElementById('no-results');
        if (noResultsEl) noResultsEl.classList.add('hidden'); // Ensure 'no results' is hidden
        createTagFilters(); 
        renderGalleryAndPagination(currentImageSet);
        updatePageTranslations(); 
    } else {
        // Display no results message if no images were loaded and no error message was already shown by fetchImagesData
        const galleryContainer = document.getElementById('gallery-container');
        const noResultsEl = document.getElementById('no-results');
        if (galleryContainer && galleryContainer.innerHTML.trim() === '') { // Check if fetchImagesData didn't already put an error
             if (noResultsEl) noResultsEl.classList.remove('hidden');
        }
        console.warn('No images to display. Gallery will be empty or show an error from fetchImagesData.');
    }

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
