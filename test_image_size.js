const fs = require('fs'); // Moved to the top
const sizeOf = require('image-size');
const path = require('path');

// Let's use a specific image path that appeared in your logs.
// Please ensure this image file actually exists at this path:
// /Users/lizhu/Downloads/CCR/lysk3/images/Xaiver/主线/主线.png
const testImagePath = path.join(__dirname, 'images', 'Xaiver', '主线', '主线.png');

console.log('--- Testing image-size library ---');

try {
    console.log('1. Value of require(\'image-size\'):', require('image-size'));
    console.log('2. Type of sizeOf variable (should be function):', typeof sizeOf);

    if (fs.existsSync(testImagePath)) {
        if (typeof sizeOf === 'function') {
            const dimensions = sizeOf(testImagePath);
            console.log(`3. Dimensions for ${testImagePath}:`, dimensions);
        } else {
            console.error('ERROR: sizeOf is not a function.');
            console.log('Value of sizeOf:', sizeOf);
        }
    } else {
        console.error(`ERROR: Test image file not found at ${testImagePath}`);
        console.log('Please verify the path and file existence.');
    }

} catch (err) {
    console.error(`ERROR during test:`, err);
    console.error('Type of sizeOf at time of error:', typeof sizeOf);
    console.log('Value of sizeOf at time of error:', sizeOf);
}

console.log('--- End of test ---');
