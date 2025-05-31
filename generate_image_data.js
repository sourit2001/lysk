const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size').default; // 用于获取图片尺寸

const imagesBaseDir = path.join(__dirname, 'images');
const outputFilePath = path.join(__dirname, 'images_data.json');
const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp'];

function getTagsFromPath(filePath, baseDir) {
    const relativePath = path.relative(baseDir, filePath);
    const parts = relativePath.split(path.sep);
    // 移除了文件名，只保留文件夹名作为标签
    return parts.slice(0, -1).filter(tag => tag.trim() !== ''); 
}

function scanDirectory(dirPath) {
    let imagesData = [];
    const items = fs.readdirSync(dirPath);

    items.forEach(item => {
        const itemPath = path.join(dirPath, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            imagesData = imagesData.concat(scanDirectory(itemPath));
        } else if (stat.isFile() && allowedExtensions.includes(path.extname(item).toLowerCase())) {
            try {
                const buffer = fs.readFileSync(itemPath);
                const dimensions = sizeOf(buffer);
                const relativePath = path.relative(__dirname, itemPath).replace(/\\/g, '/'); // 确保路径是 web-friendly
                const fileName = path.basename(itemPath);
                const tags = getTagsFromPath(itemPath, imagesBaseDir);

                imagesData.push({
                    id: relativePath.replace(/[^a-zA-Z0-9]/g, '-'), // 创建一个基于路径的唯一ID
                    path: relativePath, // 相对于项目根目录的路径
                    title: fileName,    // 默认使用文件名作为标题，可以后续调整
                    width: dimensions.width,
                    height: dimensions.height,
                    tags: tags
                });
            } catch (err) {
                console.error(`无法处理文件 ${itemPath}: ${err.message}`);
            }
        }
    });

    return imagesData;
}

function main() {
    console.log('开始扫描图片文件夹...');
    const allImages = scanDirectory(imagesBaseDir);
    
    fs.writeFileSync(outputFilePath, JSON.stringify(allImages, null, 2), 'utf8');
    console.log(`图片数据已成功生成到 ${outputFilePath}`);
    console.log(`共找到 ${allImages.length} 张图片。`);
}

if (require.main === module) {
    main();
}
