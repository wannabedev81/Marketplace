const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');

//processing image
const processImage = async (filePath, filename) => {
    const outputDir = path.join(__dirname, '../../uploads/processed');
    const sizes = [300, 600, 1024];
    const formats = ['jpg', 'webp'];
    const results = [];

    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const normalizedPath = path.resolve(filePath);
    console.log("🔍 Starting processImage for:", normalizedPath);

    if (!fs.existsSync(normalizedPath)) {
        console.error("❌ Input file does not exist:", normalizedPath);
        return results;
    }

    try {
        for (const size of sizes) {
            for (const format of formats) {
                const processedFilename = `${filename}-${size}w.${format}`;
                const outputFile = path.join(outputDir, processedFilename);

                await sharp(normalizedPath)
                    .rotate()
                    .resize({ width: size })
                    .toFormat(format, { quality: 80 })
                    .toFile(outputFile);

                results.push({
                    size: `${size}w`,
                    format,
                    path: `/uploads/processed/${processedFilename}`
                });
            }
        }

        console.log("✅ Finished all processing, results:", results);

        // Delete original file AFTER processing
        await fs.promises.unlink(normalizedPath);
        console.log('🗑️ Deleted original file:', normalizedPath);

    } catch (err) {
        console.error('Sharp failed to process image', err);
    }

    return results;
};

module.exports = { processImage };