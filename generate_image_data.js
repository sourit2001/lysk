const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size').default; // 用于获取图片尺寸
const sharp = require('sharp'); // 用于图像处理，如创建缩略图

const imagesBaseDir = path.join(__dirname, 'images');
const thumbnailsBaseDir = path.join(__dirname, 'images', 'thumbnails'); // Corrected path for thumbnails
const outputFilePath = path.join(__dirname, 'images_data.json');
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

function getTagsFromPath(filePath, baseDir) {
    const relativePath = path.relative(baseDir, filePath);
    const parts = relativePath.split(path.sep);
    // 移除了文件名，只保留文件夹名作为标签
    return parts.slice(0, -1).filter(tag => tag.trim() !== ''); 
}

async function scanDirectory(dirPath) { // Changed to async to handle sharp promises
    let imagesData = [];
    if (!fs.existsSync(thumbnailsBaseDir)) {
        fs.mkdirSync(thumbnailsBaseDir, { recursive: true });
        console.log(`创建缩略图目录: ${thumbnailsBaseDir}`);
    }
    const items = fs.readdirSync(dirPath);

    // Use a for...of loop to handle async operations correctly within the loop
    for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            // Skip the thumbnails directory itself
            if (itemPath === thumbnailsBaseDir) {
                console.log(`跳过缩略图目录: ${itemPath}`);
                continue;
            }
            const subDirImages = await scanDirectory(itemPath); // await the recursive call
            imagesData = imagesData.concat(subDirImages);
        } else if (stat.isFile() && allowedExtensions.includes(path.extname(item).toLowerCase())) {
            try {
                const buffer = fs.readFileSync(itemPath);
                const dimensions = sizeOf(buffer);
                const originalRelativePath = path.relative(__dirname, itemPath).replace(/\\/g, '/');
                const fileName = path.basename(itemPath);
                const tags = getTagsFromPath(itemPath, imagesBaseDir);

                // 创建缩略图
                const relativeToImagesBase = path.relative(imagesBaseDir, itemPath);
                const thumbnailSubDir = path.join(thumbnailsBaseDir, path.dirname(relativeToImagesBase));
                if (!fs.existsSync(thumbnailSubDir)) {
                    fs.mkdirSync(thumbnailSubDir, { recursive: true });
                }
                const thumbnailName = path.basename(itemPath);
                const thumbnailFullPath = path.join(thumbnailSubDir, thumbnailName);
                const thumbnailRelativePath = path.relative(__dirname, thumbnailFullPath).replace(/\\/g, '/');

                try {
                    await sharp(itemPath)
                        .resize({ width: 400 }) // 设置缩略图宽度为400px，高度自动按比例调整
                        .toFile(thumbnailFullPath);
                    console.log(`已生成缩略图: ${thumbnailFullPath}`);
                } catch (thumbErr) {
                    console.error(`无法为 ${itemPath} 生成缩略图: ${thumbErr.message}`);
                    continue; // 跳过此图片
                }

                imagesData.push({
                    id: originalRelativePath.replace(/[^a-zA-Z0-9]/g, '-'),
                    originalSrc: originalRelativePath,
                    thumbnailSrc: thumbnailRelativePath,
                    name: fileName, // Changed 'title' to 'name' for consistency with gallery.js expectations
                    dimensions: { width: dimensions.width, height: dimensions.height }, // Original dimensions
                    tags: tags
                });
            } catch (err) {
                console.error(`无法处理文件 ${itemPath}: ${err.message}`);
            }
        }
    } // End of for...of loop

    return imagesData;
}

async function main() { // Changed to async to handle scanDirectory
    console.log('开始扫描图片文件夹...');
    const allImages = await scanDirectory(imagesBaseDir); // await the call
    
    fs.writeFileSync(outputFilePath, JSON.stringify(allImages, null, 2), 'utf8');
    console.log(`图片数据已成功生成到 ${outputFilePath}`);
    console.log(`共找到 ${allImages.length} 张图片。`);
}

if (require.main === module) {
    main();
}
