/**
 * Jenkins Image Comparison Utility
 * This utility provides functions for comparing images in the Jenkins CI environment
 * It avoids using canvas and relies directly on pixelmatch and pngjs
 */

const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');
let pixelmatch;

// Use dynamic import for pixelmatch (ES Module)
(async () => {
  const pixelmatchModule = await import('pixelmatch');
  pixelmatch = pixelmatchModule.default;
})();

/**
 * Create directory if it doesn't exist
 * @param {string} dirPath - Path to the directory to create
 */
function ensureDirectoryExists(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Set up paths for baseline, actual, and diff images
 * @param {string} baseDir - Base directory
 * @param {string} screenshotName - Name of the screenshot
 * @returns {Object} Object containing paths for baseline, actual, and diff images
 */
function setupPaths(baseDir, screenshotName) {
  const baselinePath = path.join(baseDir, 'baseline', `${screenshotName}.png`);
  const actualPath = path.join(baseDir, 'actual', `${screenshotName}.png`);
  const diffPath = path.join(baseDir, 'diff', `${screenshotName}.png`);

  // Ensure directories exist
  ensureDirectoryExists(path.dirname(baselinePath));
  ensureDirectoryExists(path.dirname(actualPath));
  ensureDirectoryExists(path.dirname(diffPath));

  return { baselinePath, actualPath, diffPath };
}

/**
 * Read PNG file
 * @param {string} filePath - Path to the PNG file
 * @returns {Promise<PNG>} Promise resolving to a PNG object
 */
function readPNG(filePath) {
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(new PNG())
      .on('parsed', function() {
        resolve(this);
      })
      .on('error', reject);
  });
}

/**
 * Create a new PNG with specified dimensions
 * @param {number} width - Width of the PNG
 * @param {number} height - Height of the PNG
 * @returns {PNG} PNG object
 */
function createNewPNG(width, height) {
  return new PNG({ width, height });
}

/**
 * Compare two PNG images and generate a diff image
 * @param {string} actualPath - Path to the actual image
 * @param {string} baselinePath - Path to the baseline image
 * @param {string} diffPath - Path to save the diff image
 * @param {Object} options - Comparison options
 * @returns {Object} Result object containing diff count and whether comparison passed
 */
async function compareImages(actualPath, baselinePath, diffPath, options = {}) {
  const defaultOptions = {
    threshold: 0.1,
    includeAA: false,
    alpha: 0.3,
    diffColor: [255, 0, 0],
    diffMask: false,
    failureThreshold: 0.01
  };

  const opts = { ...defaultOptions, ...options };
  
  try {
    // Ensure pixelmatch is loaded
    if (!pixelmatch) {
      console.log("Waiting for pixelmatch module to load...");
      await new Promise(resolve => setTimeout(resolve, 500));
      if (!pixelmatch) {
        const pixelmatchModule = await import('pixelmatch');
        pixelmatch = pixelmatchModule.default;
      }
    }
    
    // Read the images
    const actual = await readPNG(actualPath);
    const baseline = await readPNG(baselinePath);

    // Check if dimensions match
    if (actual.width !== baseline.width || actual.height !== baseline.height) {
      console.error(`Image dimensions do not match. Actual: ${actual.width}x${actual.height}, Baseline: ${baseline.width}x${baseline.height}`);
      return createErrorDiff(diffPath, Math.max(actual.width, baseline.width), Math.max(actual.height, baseline.height));
    }

    // Create diff image
    const diff = createNewPNG(actual.width, actual.height);
    
    // Compare the images
    const diffPixels = pixelmatch(
      actual.data,
      baseline.data,
      diff.data,
      actual.width,
      actual.height,
      opts
    );

    // Save the diff image
    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    // Calculate the percentage of differing pixels
    const totalPixels = actual.width * actual.height;
    const diffPercentage = diffPixels / totalPixels;
    
    // Determine if comparison passed based on threshold
    const passed = diffPercentage <= opts.failureThreshold;

    return {
      diffCount: diffPixels,
      diffPercentage,
      passed,
      width: actual.width,
      height: actual.height
    };
  } catch (error) {
    console.error('Error comparing images:', error);
    return {
      diffCount: -1,
      diffPercentage: 1,
      passed: false,
      error: error.message
    };
  }
}

/**
 * Generate a diff image indicating an error when image dimensions don't match
 * @param {string} diffPath - Path to save the diff image
 * @param {number} width - Width of the diff image
 * @param {number} height - Height of the diff image
 * @returns {Object} Result object indicating failure
 */
function createErrorDiff(diffPath, width, height) {
  try {
    // Create a new PNG with red background
    const diff = createNewPNG(width, height);
    
    // Fill with red to indicate error
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (width * y + x) << 2;
        diff.data[idx] = 255;      // R
        diff.data[idx + 1] = 0;    // G
        diff.data[idx + 2] = 0;    // B
        diff.data[idx + 3] = 255;  // A
      }
    }
    
    // Save the diff image
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    
    return {
      diffCount: width * height,
      diffPercentage: 1,
      passed: false,
      error: 'Image dimensions do not match'
    };
  } catch (error) {
    console.error('Error creating error diff image:', error);
    return {
      diffCount: -1,
      diffPercentage: 1,
      passed: false,
      error: error.message
    };
  }
}

/**
 * Generates a shell script for uploading screenshots to ClickUp
 * @param {Array<Object>} screenshotInfo - Array of objects with screenshot info (name, path)
 * @param {string} taskId - ClickUp task ID
 * @param {string} outputPath - Path where to save the shell script
 * @param {string} clickupApiToken - ClickUp API token (will be read from env var if not provided)
 */
function generateUploadScript(screenshotInfo, taskId, outputPath, clickupApiToken = null) {
    const fs = require('fs');
    
    if (!screenshotInfo || !Array.isArray(screenshotInfo) || screenshotInfo.length === 0) {
        console.error('No screenshots provided for upload');
        return;
    }
    
    if (!taskId) {
        console.error('No ClickUp task ID provided');
        return;
    }
    
    // Create upload script content
    let scriptContent = `#!/bin/bash
# Auto-generated script for uploading screenshots to ClickUp
# Generated at: ${new Date().toISOString()}

# Use provided token or get from environment
CLICKUP_API_TOKEN="${clickupApiToken || '${CLICKUP_API_TOKEN}'}"

if [ -z "$CLICKUP_API_TOKEN" ]; then
    echo "ERROR: ClickUp API token not provided"
    exit 1
fi

echo "Uploading ${screenshotInfo.length} screenshots to ClickUp task ${taskId}"
`;

    // Add upload commands for each screenshot
    screenshotInfo.forEach((screenshot, index) => {
        if (!screenshot.path || !screenshot.name) {
            console.warn(`Skipping invalid screenshot at index ${index}`);
            return;
        }
        
        scriptContent += `
# Upload ${screenshot.name}
echo "Uploading ${index + 1}/${screenshotInfo.length}: ${screenshot.name}"
curl -s -X POST 'https://api.clickup.com/api/v2/task/${taskId}/attachment' \\
    -H "Authorization: $CLICKUP_API_TOKEN" \\
    -F "attachment=@${screenshot.path}" \\
    -F "filename=${screenshot.name}"

if [ $? -ne 0 ]; then
    echo "WARNING: Failed to upload ${screenshot.name}"
fi
`;
    });

    scriptContent += `
echo "Upload script completed"
`;

    try {
        fs.writeFileSync(outputPath, scriptContent);
        console.log(`Upload script generated at ${outputPath}`);
        // Make the script executable
        fs.chmodSync(outputPath, '755');
    } catch (error) {
        console.error(`Error generating upload script: ${error.message}`);
    }
}

module.exports = {
  setupPaths,
  compareImages,
  createErrorDiff,
  generateUploadScript
}; 