/**
 * 图片库主要功能实现
 * 实现图片加载、过滤、模态框展示等功能
 */

// 保存所有图片数据
let allImages = [];
// 当前应用的过滤器
let activeFilters = new Set(); // Stores active tag strings
let currentImageSet = []; // Holds the current set of images (all or filtered)

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
                tags: Array.isArray(img.tags) ? img.tags : [],
                modified: img.modified // Add modified timestamp
            };
        }).filter(imgObject => imgObject !== null) // Remove any null entries that were skipped
          .sort((a, b) => (b.modified || 0) - (a.modified || 0)); // Sort by modification time, newest first
    } catch (error) {
        console.error('加载图片数据失败 (Failed to load image data):', error);
        document.getElementById('gallery-container').innerHTML = 
            '<p class="text-red-500 text-center">无法加载图片数据，请检查 images_data.json 文件是否存在且格式正确。</p>';
        return []; // Return empty array on error to prevent further issues
    }
}

// 创建动态标签过滤器 (all tags in one container)
function createTagFilters(imagesData) {
    const allTagsContainer = document.getElementById('all-tags-container');
    if (!allTagsContainer) {
        console.error('Tag container #all-tags-container not found.');
        return;
    }
    allTagsContainer.innerHTML = ''; // 清空现有标签

    const primaryTagsOrder = [
        "Xaiver", "Zayne", "Rafayel", "Sylus", "Caleb", 
        "主线", "五星", "写真", "生日", 
        "春日", "樱花", "烟花", "四星" // Added more primary tags
    ];
    const allUniqueTagsFromData = new Set();
    imagesData.forEach(image => {
        if (image.tags && Array.isArray(image.tags)) {
            image.tags.forEach(tag => allUniqueTagsFromData.add(tag.trim()));
        }
    });

    const displayTags = [];
    const otherTags = [];
    const primaryTagsSet = new Set(primaryTagsOrder.map(t => t.toLowerCase())); // For case-insensitive matching if needed, though data is likely consistent

    // First, populate displayTags in the correct order
    primaryTagsOrder.forEach(pt => {
        // Find the tag from data that matches pt (case-sensitive for now, assuming data consistency)
        const foundTag = Array.from(allUniqueTagsFromData).find(ut => ut === pt);
        if (foundTag) {
            displayTags.push(foundTag);
        }
    });

    // Collect other tags
    allUniqueTagsFromData.forEach(tag => {
        if (!primaryTagsOrder.includes(tag)) {
            otherTags.push(tag);
        }
    });
    otherTags.sort((a, b) => a.localeCompare(b)); // Sort other tags alphabetically

    // Render primary tags
    displayTags.forEach(tag => {
        allTagsContainer.appendChild(createTagElement(tag));
    });

    // Handle "More" dropdown for other tags
    if (otherTags.length > 0) {
        const moreButtonContainer = document.createElement('div');
        moreButtonContainer.className = 'relative group'; // For group-hover to work

        const moreButton = document.createElement('button');
        moreButton.className = 'tag filterable-tag py-1 px-2.5 bg-gray-100 text-black rounded text-base cursor-pointer hover:bg-gray-200 transition-all duration-150 ease-in-out flex items-center';
        const moreButtonTextSpan = document.createElement('span');
        moreButtonTextSpan.dataset.i18nKey = 'moreButtonText'; // For dynamic language switching if key is added to translations.json
        moreButtonTextSpan.textContent = 'More'; // Set text directly to 'More'
        
        moreButton.appendChild(moreButtonTextSpan);
        moreButton.innerHTML += ' <i class="fas fa-chevron-down text-xs ml-1"></i>'; // Add icon next to span

        const moreDropdown = document.createElement('div');
        moreDropdown.className = 'absolute left-0 mt-1 w-auto min-w-[150px] bg-white rounded-md shadow-lg hidden group-hover:block border border-gray-200 z-20';
        // min-w-[150px] is an example, adjust as needed

        const moreList = document.createElement('ul');
        moreList.className = 'py-1';

        otherTags.forEach(tag => {
            const listItem = document.createElement('li');
            const tagInDropdown = createTagElement(tag);
            
            // Modify class for dropdown appearance - remove button-like styles, add block/text styles
            tagInDropdown.className = 'filterable-tag block w-full px-4 py-2 text-left text-black text-base cursor-pointer hover:bg-gray-100 transition-all duration-150 ease-in-out';
            // Ensure dataset.tag and event listeners from createTagElement are preserved.
            
            listItem.appendChild(tagInDropdown);
            moreList.appendChild(listItem);
        });

        moreDropdown.appendChild(moreList);
        moreButtonContainer.appendChild(moreButton);
        moreButtonContainer.appendChild(moreDropdown);
        allTagsContainer.appendChild(moreButtonContainer);
    }
}

// 创建标签元素 (simplified style, no category, no count)
function createTagElement(tag) { // category parameter removed
    const tagEl = document.createElement('div');
    // New style: clean, button-like, similar to image card style as requested
    tagEl.className = 'tag filterable-tag py-1 px-2.5 bg-white text-black rounded text-base cursor-pointer hover:bg-gray-100 transition-all duration-150 ease-in-out';
    tagEl.dataset.tag = tag;
    tagEl.dataset.tagOrig = tag; // For translation purposes
    
    const tagText = document.createElement('span');
    tagText.className = 'tag-text';
    tagText.textContent = translateTag(tag); // Use translated tag name via our wrapper
    tagText.dataset.i18nTag = tag; // To find element for dynamic translation updates
    
    tagEl.appendChild(tagText);
    
    tagEl.addEventListener('click', function(event) { // Capture event object
        toggleFilter(this, event); // Pass both element and event
    });
    
    return tagEl;
}

// getTagColor function is removed as tags will have a uniform style.

// 切换筛选器状态
function toggleFilter(clickedTagEl, event) { // Add event parameter
    const clickedTag = clickedTagEl.dataset.tag;
    const wasActive = activeFilters.has(clickedTag);

    if (event && event.metaKey) { // CMD/CTRL click for multi-select
        if (wasActive) {
            activeFilters.delete(clickedTag);
            clickedTagEl.classList.remove('bg-black', 'text-white', 'font-semibold');
            clickedTagEl.classList.add('bg-white', 'text-black');
        } else {
            activeFilters.add(clickedTag);
            clickedTagEl.classList.remove('bg-white', 'text-black');
            clickedTagEl.classList.add('bg-black', 'text-white', 'font-semibold');
        }
    } else { // Normal click for single-select (or deselect if already active)
        if (wasActive) {
            // If it was active, just deactivate it
            activeFilters.delete(clickedTag);
            clickedTagEl.classList.remove('bg-black', 'text-white', 'font-semibold');
            clickedTagEl.classList.add('bg-white', 'text-black');
        } else {
            // Clicked an INACTIVE tag - SELECT IT, DESELECT OTHERS
            // 1. Update the master list of active filters.
            activeFilters.clear();
            activeFilters.add(clickedTag); // clickedTag is clickedTagEl.dataset.tag

            // 2. Iterate through ALL tag DOM elements and set their style.
            const allTagElementsInDOM = document.querySelectorAll('.filterable-tag'); // Use common class
            allTagElementsInDOM.forEach(tagElementInLoop => {
                if (tagElementInLoop.dataset.tag === clickedTag) { // Compare by dataset.tag
                    tagElementInLoop.classList.remove('bg-white', 'text-black');
                    tagElementInLoop.classList.add('bg-black', 'text-white', 'font-semibold');
                } else {
                    tagElementInLoop.classList.remove('bg-black', 'text-white', 'font-semibold');
                    tagElementInLoop.classList.add('bg-white', 'text-black');
                }
            });
        }
    }

    applyFilters();
}

// 应用所有活动的筛选器
function applyFilters() {
    const noResultsEl = document.getElementById('no-results');
    
    // currentPage = 1; // No longer needed as there's no pagination

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
    currentImageSet = imagesToProcess; // Update the current set
    renderGallery(currentImageSet); 
}

// 渲染图库
function renderGallery(imagesToDisplay) {
    const galleryEl = document.getElementById('gallery-container');
    galleryEl.innerHTML = ''; // Clear previous items

    if (imagesToDisplay.length === 0) {
        return;
    }

    // Assuming #gallery-container is styled with display:grid and grid-auto-rows in CSS.
    const gridAutoRowHeight = 10; // Must match grid-auto-rows in CSS (e.g., 10px)
    const gapStyle = getComputedStyle(galleryEl).gap;
    // A simple way to get the first gap value if it's like "12px 12px" or just "12px"
    // More robust parsing might be needed for complex gap values.
    const gridGap = parseFloat(gapStyle.split(' ')[0]) || 8; // Default to 8px if parsing fails

    imagesToDisplay.forEach((image) => {
        const imageCard = document.createElement('div');
        imageCard.className = 'image-card-item bg-gray-50 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer';

        const imgElement = document.createElement('img');
        imgElement.src = image.src;
        imgElement.alt = image.alt || image.name || '';
        // Image fills the card. Card's height will be set by grid-row-end.
        imgElement.className = 'image-thumbnail w-full h-full'; 
        imgElement.loading = 'lazy';

        const isAnimated = image.originalSrc && (
            image.originalSrc.toLowerCase().endsWith('.gif') ||
            image.originalSrc.toLowerCase().endsWith('.webp') ||
            image.originalSrc.toLowerCase().includes('animated')
        );

        if (isAnimated) {
            imageCard.classList.add('animated-content'); // CSS applies object-fit: contain
        } else {
            imgElement.classList.add('object-cover'); // Default to cover for static images
        }
        
        imgElement.onerror = function() {
            this.onerror = null;
            this.src = 'https://via.placeholder.com/400x300?text=Error+Loading+Image';
            console.error('Image load error:', image.src);
        };

        imageCard.appendChild(imgElement);
        galleryEl.appendChild(imageCard); // Append card to DOM to get its width

        // Calculate and set grid-row-end span
        requestAnimationFrame(() => {
            let calcWidth = image.width && image.width > 0 ? image.width : 16; // Default aspect ratio if data missing (e.g., 16:9)
            let calcHeight = image.height && image.height > 0 ? image.height : 9;

            if (isAnimated && (calcWidth > calcHeight)) { // Landscape animated image
                // Force card aspect ratio to 3:4 for calculation, to match portrait cards
                calcWidth = 3;
                calcHeight = 4;
            }
            // For non-animated, or portrait/square animated, use their original aspect ratio for calcWidth/calcHeight.
            
            const cardClientWidth = imageCard.clientWidth; // Get actual width in the grid column
            let targetCardHeight = (calcHeight / calcWidth) * cardClientWidth;

            // If it's an animated image, reduce its calculated card height to make the preview smaller.
            if (isAnimated) {
                targetCardHeight *= 0.8; // Make animated previews 20% smaller in height.
            }
            
            const rowSpan = Math.ceil((targetCardHeight + gridGap) / (gridAutoRowHeight + gridGap));
            imageCard.style.gridRowEnd = `span ${rowSpan > 0 ? rowSpan : 1}`; // Ensure span is at least 1
        });

        imageCard.addEventListener('click', () => {
            openModal(image);
        });
    });
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
        createTagFilters(allImages); 
        renderGallery(currentImageSet);
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
