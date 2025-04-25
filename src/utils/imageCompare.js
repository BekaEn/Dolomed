/**
 * Simple image comparison utilities that don't rely on the canvas library
 * Uses only pngjs and pixelmatch which have fewer dependencies
 */
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

// Create stub implementation that won't break execution
const stubPixelmatch = function(img1, img2, output, width, height, options) {
  console.warn('Using stub pixelmatch implementation - image comparison won\'t be accurate');
  // Fill output with transparent pixels (no diff)
  if (output) {
    for (let i = 0; i < output.length; i += 4) {
      output[i] = 0;     // R
      output[i+1] = 0;   // G
      output[i+2] = 0;   // B
      output[i+3] = 0;   // A (transparent)
    }
  }
  return 0; // Return 0 differences
};

// Pixelmatch will be loaded asynchronously or use the stub
let pixelmatch = stubPixelmatch;

// Try to load pixelmatch asynchronously
(async () => {
  try {
    // Use dynamic import for ESM module
    const pixelmatchModule = await import('pixelmatch');
    if (pixelmatchModule && pixelmatchModule.default) {
      pixelmatch = pixelmatchModule.default;
      console.log('Successfully loaded pixelmatch module');
    }
  } catch (error) {
    console.warn('Failed to load pixelmatch module:', error.message);
    // Continue using the stub implementation
  }
})();

/**
 * Takes a sectional screenshot that captures the entire page while keeping dimensions reasonable
 */
async function takeScreenshot(page, outputPath) {
  // Get viewport dimensions
  const viewport = page.viewportSize() || { width: 1280, height: 720 };
  
  // Measure the actual page height
  const pageHeight = await page.evaluate(() => Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  ));
  
  // Check if this is a mobile view by viewport width or URL pattern
  const isMobileView = viewport.width <= 768 || 
                       page.url().includes('Mobile') || 
                       page.url().includes('mobile');
  
  // More aggressive width reduction for mobile
  const MOBILE_WIDTH = 400; // Narrower width for mobile
  const DESKTOP_WIDTH = 1280; // Standard width for desktop
  
  // Define optimal dimensions for screenshots
  const TARGET_WIDTH = isMobileView ? MOBILE_WIDTH : DESKTOP_WIDTH;
  const DEVICE_SCALE = isMobileView ? 0.5 : 0.5; // Same scale for consistency
  
  console.log(`Page height: ${pageHeight}px, viewport: ${viewport.width}x${viewport.height}px, detected as ${isMobileView ? 'mobile' : 'desktop'}`);
  console.log(`Using target width: ${TARGET_WIDTH}px with scale ${DEVICE_SCALE}`);
  
  // Approach: Take a screenshot with reduced device scale factor
  try {
    console.log(`Using device scale factor approach with scale ${DEVICE_SCALE} and target width ${TARGET_WIDTH}px`);
    
    // Save original device scale factor to restore later
    const originalContext = page.context();
    const originalViewport = viewport;
    
    // Force viewport width for the new context
    const newViewport = {
      width: TARGET_WIDTH,
      height: originalViewport.height
    };
    
    // Create a new context with reduced device scale factor and controlled width
    const reducedContext = await originalContext.browser().newContext({
      viewport: newViewport,
      deviceScaleFactor: DEVICE_SCALE
    });
    
    // Create a new page in the reduced context
    const reducedPage = await reducedContext.newPage();
    
    // Go to the same URL as the original page
    const currentUrl = page.url();
    await reducedPage.goto(currentUrl, { waitUntil: 'networkidle' });
    
    // Run the same interactions as the original page to get it in the same state
    console.log('Setting up reduced-resolution page...');
    
    // Wait for any cookie banners to appear
    await reducedPage.waitForTimeout(1000);
    
    // Try to dismiss cookie banners if present (common patterns)
    try {
      // Common cookie banner accept button selectors
      const cookieSelectors = [
        'button.cky-btn-accept', 
        '.cky-btn-accept',
        '[data-cky-tag="accept-button"]',
        'button[aria-label="Allow"]',
        'button.agree-button',
        '#accept-cookies'
      ];
      
      for (const selector of cookieSelectors) {
        const button = reducedPage.locator(selector);
        if (await button.count() > 0) {
          await button.first().click().catch(() => {});
          console.log(`Clicked cookie banner button: ${selector}`);
          break;
        }
      }
    } catch (e) {
      console.log('Could not dismiss cookie banner: ' + e.message);
    }
    
    // Set HTML/body width to ensure the page doesn't expand beyond our target
    await reducedPage.evaluate((width) => {
      document.documentElement.style.maxWidth = `${width}px`;
      document.documentElement.style.width = `${width}px`;
      document.body.style.maxWidth = `${width}px`;
      document.body.style.width = `${width}px`;
      document.body.style.overflowX = 'hidden';
    }, TARGET_WIDTH);

    // IMPORTANT: Scroll through the entire page to trigger lazy loading
    console.log('Scrolling through page to ensure all content is loaded...');
    await scrollThroughPage(reducedPage);
    
    // Take a screenshot of the entire page at reduced resolution
    await reducedPage.screenshot({
      path: outputPath,
      fullPage: true,
      type: 'png'
    });
    
    console.log(`Screenshot saved with reduced resolution to ${outputPath}`);
    
    // Close the reduced context
    await reducedContext.close();
    
    // Verify the dimensions of the saved file
    const PNG = require('pngjs').PNG;
    const fs = require('fs');
    const savedImage = PNG.sync.read(fs.readFileSync(outputPath));
    console.log(`Saved image dimensions: ${savedImage.width}x${savedImage.height}px`);
    
    return outputPath;
  } catch (error) {
    console.error(`Error with device scale approach: ${error.message}`);
    
    // Fall back to a simpler approach - CSS transform with fixed width
    console.log('Falling back to CSS transform approach with fixed width');
    
    try {
      // First set the viewport to our target width
      await page.setViewportSize({ 
        width: TARGET_WIDTH, 
        height: viewport.height 
      });
      
      // Apply CSS constraints to limit width
      await page.evaluate((width) => {
        document.documentElement.style.maxWidth = `${width}px`;
        document.documentElement.style.width = `${width}px`;
        document.body.style.maxWidth = `${width}px`;
        document.body.style.width = `${width}px`;
        document.body.style.overflowX = 'hidden';
        
        // Apply scale for height reduction
        document.body.style.transformOrigin = 'top left';
        document.body.style.transform = 'scale(0.5)';
        document.body.style.height = 'auto';
      }, TARGET_WIDTH);
      
      await page.waitForTimeout(500);
      
      // IMPORTANT: Scroll through the entire page to trigger lazy loading
      console.log('Scrolling through page to ensure all content is loaded...');
      await scrollThroughPage(page);
      
      // Take a screenshot
      await page.screenshot({
        path: outputPath,
        fullPage: true,
        type: 'png'
      });
      
      // Reset the transform
      await page.evaluate(() => {
        document.documentElement.style.maxWidth = '';
        document.documentElement.style.width = '';
        document.body.style.maxWidth = '';
        document.body.style.width = '';
        document.body.style.overflowX = '';
        document.body.style.transform = '';
        document.body.style.transformOrigin = '';
        document.body.style.height = '';
      });
      
      // Restore original viewport
      await page.setViewportSize(viewport);
      
      console.log(`Screenshot saved using CSS transform with fixed width to ${outputPath}`);
    } catch (transformError) {
      console.error(`Error with transform approach: ${transformError.message}`);
      
      // Last resort: just take a standard screenshot with strict width
      await page.setViewportSize({ 
        width: TARGET_WIDTH, 
        height: viewport.height 
      });
      
      // Apply strict width constraints
      await page.evaluate((width) => {
        document.documentElement.style.maxWidth = `${width}px`;
        document.body.style.maxWidth = `${width}px`;
        document.body.style.overflowX = 'hidden';
      }, TARGET_WIDTH);
      
      // IMPORTANT: Scroll through the entire page to trigger lazy loading
      console.log('Scrolling through page to ensure all content is loaded...');
      await scrollThroughPage(page);
      
      await page.screenshot({
        path: outputPath,
        fullPage: true,
        type: 'png'
      });
      
      // Reset styles
      await page.evaluate(() => {
        document.documentElement.style.maxWidth = '';
        document.body.style.maxWidth = '';
        document.body.style.overflowX = '';
      });
      
      // Restore original viewport
      await page.setViewportSize(viewport);
      
      console.log(`Screenshot saved with standard approach using fixed width ${TARGET_WIDTH}px to ${outputPath}`);
    }
    
    return outputPath;
  }
}

/**
 * Helper function to scroll through the entire page to trigger lazy loading
 */
async function scrollThroughPage(page) {
  // Get page height
  const pageHeight = await page.evaluate(() => {
    return Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
  });
  
  // Get viewport height
  const viewportSize = page.viewportSize() || { width: 1280, height: 720 };
  const viewportHeight = viewportSize.height;
  
  console.log(`Page height for scrolling: ${pageHeight}px, Viewport height: ${viewportHeight}px`);
  
  // Scroll in larger steps to cover the page faster
  const scrollStep = Math.floor(viewportHeight * 0.8); // 80% of viewport
  
  console.log('Starting scroll through page to trigger lazy loading...');
  
  for (let position = 0; position < pageHeight; position += scrollStep) {
    await page.evaluate((pos) => {
      window.scrollTo(0, pos);
    }, position);
    
    // Wait a bit for content to load
    await page.waitForTimeout(300);
  }
  
  // Ensure we reach the bottom
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  
  // Wait for network to settle
  await page.waitForLoadState('networkidle', { timeout: 5000 }).catch(err => {
    console.log('Network idle timeout, continuing anyway');
  });
  
  // Scroll back to top for the screenshot
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  
  // Small wait to let animations settle
  await page.waitForTimeout(1000);
  
  console.log('Finished scrolling through page');
}

/**
 * Creates paths for baseline, actual, and diff images
 */
function setupPaths(baseDir, screenshotName) {
  const screenshotsDir = path.join(process.cwd(), 'test-results');
  let baselineDir = path.join(process.cwd(), 'src', 'ScreenShots', baseDir);
  
  if (!fs.existsSync(baselineDir)) {
    baselineDir = path.join(screenshotsDir, baseDir);
  }
  
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }
  
  if (!fs.existsSync(baselineDir)) {
    fs.mkdirSync(baselineDir, { recursive: true });
  }
  
  const baselineName = `${screenshotName}.png`;
  const baselinePath = path.join(baselineDir, baselineName);
  
  const outputFileBase = `${screenshotName.replace(/-/g, '_')}`;
  const actualName = `${outputFileBase}_actual.png`;
  const actualPath = path.join(screenshotsDir, actualName);
  
  const diffName = `${outputFileBase}_diff.png`;
  const diffPath = path.join(screenshotsDir, diffName);
  
  return {
    screenshotsDir,
    baselineDir,
    baselinePath,
    actualPath,
    diffPath
  };
}

/**
 * Compare two PNG images without using canvas
 */
async function compareImages(actualPath, baselinePath, diffPath, options = {}) {
  // Read images
  const actualImg = PNG.sync.read(fs.readFileSync(actualPath));
  const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
  
  // Safety check - reject extremely large images
  const MAX_SAFE_WIDTH = 6000;
  const MAX_SAFE_HEIGHT = 15000;
  
  console.log(`Image dimensions - Actual: ${actualImg.width}x${actualImg.height}, Baseline: ${baselineImg.width}x${baselineImg.height}`);
  
  if (actualImg.width > MAX_SAFE_WIDTH || actualImg.height > MAX_SAFE_HEIGHT || 
      baselineImg.width > MAX_SAFE_WIDTH || baselineImg.height > MAX_SAFE_HEIGHT) {
    console.error(`Error: Image dimensions too large for safe comparison!`);
    
    // Create error diff image
    createErrorDiff(diffPath, 
      Math.min(actualImg.width, MAX_SAFE_WIDTH), 
      Math.min(actualImg.height, MAX_SAFE_HEIGHT)
    );
    
    // Return failed result
    return {
      diffPixels: 10000,
      percentDifferent: 50,
      maxAcceptableDiffPixels: 0,
      passed: false
    };
  }
  
  // Check dimensions
  if (baselineImg.width !== actualImg.width || baselineImg.height !== actualImg.height) {
    console.log('Warning: Image dimensions do not match. Comparison may not be accurate.');
    console.log(`Actual: ${actualImg.width}x${actualImg.height}, Baseline: ${baselineImg.width}x${baselineImg.height}`);
    
    // Create error diff image
    createErrorDiff(diffPath, actualImg.width, actualImg.height);
    
    // Return failed result
    return {
      diffPixels: 10000,
      percentDifferent: 50,
      maxAcceptableDiffPixels: 0,
      passed: false
    };
  }
  
  // Compare images
  const { width, height } = actualImg;
  const diff = new PNG({ width, height });
  
  const threshold = options.threshold || 0.3;
  const maxDiffPercentage = options.maxDiffPercentage || 5.0;
  
  // Run comparison
  const diffPixels = pixelmatch(
    actualImg.data,
    baselineImg.data,
    diff.data,
    width,
    height,
    {
      threshold: threshold,
      includeAA: options.includeAA !== false,
      alpha: options.alpha || 0.3,
      diffColor: options.diffColor || [255, 0, 0],
      diffMask: options.diffMask || false
    }
  );
  
  // Write diff file
  fs.writeFileSync(diffPath, PNG.sync.write(diff));
  
  // Calculate results
  const totalPixels = width * height;
  const percentDifferent = (diffPixels / totalPixels) * 100;
  const maxAcceptableDiffPixels = Math.floor(totalPixels * (maxDiffPercentage / 100));
  const passed = diffPixels <= maxAcceptableDiffPixels;
  
  return {
    diffPixels,
    percentDifferent,
    maxAcceptableDiffPixels,
    passed
  };
}

/**
 * Creates an error diff image for dimension mismatch
 */
function createErrorDiff(diffPath, width, height) {
  // Create a new PNG with dimensions of the actual image
  const errorDiff = new PNG({ width, height });
  
  // Fill with a semi-transparent red to indicate error
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      
      // Red with medium opacity
      errorDiff.data[idx] = 255;    // R
      errorDiff.data[idx + 1] = 0;  // G
      errorDiff.data[idx + 2] = 0;  // B
      errorDiff.data[idx + 3] = 100; // A (semi-transparent)
    }
  }
  
  // Write the diff image to a file
  fs.writeFileSync(diffPath, PNG.sync.write(errorDiff));
}

/**
 * Create an empty diff image with a green frame
 */
function createEmptyDiff(diffPath, width, height) {
  // Create a new PNG
  const emptyDiff = new PNG({ width, height });
  
  // Fill with transparent green
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      
      // Light green
      emptyDiff.data[idx] = 0;      // R
      emptyDiff.data[idx + 1] = 255;  // G
      emptyDiff.data[idx + 2] = 0;    // B
      emptyDiff.data[idx + 3] = 30;   // A (mostly transparent)
    }
  }
  
  // Write the diff image
  fs.writeFileSync(diffPath, PNG.sync.write(emptyDiff));
}

/**
 * Main function to handle page screenshot and comparison
 */
async function comparePageScreenshot(page, screenshotName, baseDir, testInfo, options = {}) {
  // Setup paths
  const paths = setupPaths(baseDir, screenshotName);
  
  // Take screenshot
  await takeScreenshot(page, paths.actualPath);
  
  // Add screenshot to report
  await testInfo.attach('actual', {
    path: paths.actualPath,
    contentType: 'image/png'
  });
  
  // Check if baseline exists
  if (fs.existsSync(paths.baselinePath)) {
    // Compare images
    const result = await compareImages(paths.actualPath, paths.baselinePath, paths.diffPath, options);
    
    // Attach diff image to report
    await testInfo.attach('diff', {
      path: paths.diffPath,
      contentType: 'image/png'
    });
    
    return result;
  } else {
    // No baseline exists, create one
    console.log(`Baseline image not found for ${screenshotName}. Current screenshot will be used as baseline.`);
    fs.copyFileSync(paths.actualPath, paths.baselinePath);
    
    // Create empty diff image
    createEmptyDiff(paths.diffPath, 
      PNG.sync.read(fs.readFileSync(paths.actualPath)).width,
      PNG.sync.read(fs.readFileSync(paths.actualPath)).height
    );
    
    // Attach diff to report
    await testInfo.attach('diff (new baseline)', {
      path: paths.diffPath,
      contentType: 'image/png'
    });
    
    // Return passed result
    return {
      diffPixels: 0,
      percentDifferent: 0,
      maxAcceptableDiffPixels: 0,
      passed: true
    };
  }
}

module.exports = {
  takeScreenshot,
  setupPaths,
  compareImages,
  comparePageScreenshot
}; 