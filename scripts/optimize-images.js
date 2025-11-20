const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const INPUT_DIR = process.argv[2] || './assets/images';
const OUTPUT_DIR = process.argv[3] || './assets/optimized-images';

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function optimizeImage(filePath) {
    const filename = path.basename(filePath);
    const stats = fs.statSync(filePath);

    if (stats.size <= MAX_SIZE_BYTES) {
        console.log(`✅ ${filename} is already under 5MB (${(stats.size / 1024 / 1024).toFixed(2)}MB). Copying...`);
        fs.copyFileSync(filePath, path.join(OUTPUT_DIR, filename));
        return;
    }

    console.log(`⚠️  ${filename} is ${(stats.size / 1024 / 1024).toFixed(2)}MB. Optimizing...`);

    try {
        let quality = 80;
        let outputBuffer;

        // Iteratively reduce quality until size is under limit
        do {
            outputBuffer = await sharp(filePath)
                .jpeg({ quality: quality }) // Convert to JPEG for better compression control
                .toBuffer();

            if (outputBuffer.length > MAX_SIZE_BYTES) {
                quality -= 10;
            }
        } while (outputBuffer.length > MAX_SIZE_BYTES && quality > 10);

        if (outputBuffer.length > MAX_SIZE_BYTES) {
            // If still too big, resize dimensions
            console.log(`   Still too big. Resizing dimensions...`);
            const metadata = await sharp(filePath).metadata();
            let width = Math.floor(metadata.width * 0.8);

            outputBuffer = await sharp(filePath)
                .resize(width)
                .jpeg({ quality: 80 })
                .toBuffer();
        }

        const outputPath = path.join(OUTPUT_DIR, filename.replace(/\.[^/.]+$/, "") + ".jpg");
        fs.writeFileSync(outputPath, outputBuffer);
        console.log(`🎉 Optimized ${filename} to ${(outputBuffer.length / 1024 / 1024).toFixed(2)}MB`);

    } catch (error) {
        console.error(`❌ Failed to optimize ${filename}:`, error);
    }
}

async function main() {
    if (!fs.existsSync(INPUT_DIR)) {
        console.error(`❌ Input directory ${INPUT_DIR} does not exist.`);
        return;
    }

    const files = fs.readdirSync(INPUT_DIR);

    for (const file of files) {
        if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
            await optimizeImage(path.join(INPUT_DIR, file));
        }
    }

    console.log('\n✨ Optimization complete! Check ' + OUTPUT_DIR);
}

main();
