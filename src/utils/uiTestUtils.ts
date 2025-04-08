import { Page, BrowserContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

/**
 * Interface for viewport size
 */
interface ViewportSize {
    width: number;
    height: number;
}

/**
 * Handles cookie consent banner acceptance using multiple selectors and strategies
 */
export async function handleCookieConsent(page: Page): Promise<boolean> {
    try {
        // Wait for the cookie consent banner to appear with a timeout
        console.log('Checking for cookie consent banner...');
        
        // Multiple possible selectors for the cookie banner
        const consentSelectors = [
            'div.cky-consent-bar',
            '.cky-consent-container',
            '[data-cky-tag="notice"]',
            '.cky-btn-accept',
            'button.cky-btn.cky-btn-accept'
        ];
        
        // Try each selector with a short timeout
        let bannerFound = false;
        
        for (const selector of consentSelectors) {
            console.log(`Trying to find cookie banner with selector: ${selector}`);
            
            const isVisible = await page.waitForSelector(selector, { 
                state: 'visible',
                timeout: 5000  // Short timeout per selector
            }).then(() => true).catch(() => false);
            
            if (isVisible) {
                bannerFound = true;
                console.log(`Cookie banner found with selector: ${selector}`);
                break;
            }
        }
        
        if (bannerFound) {
            console.log('Cookie consent banner found, accepting cookies...');
            
            // Try different methods to accept cookies
            const acceptSelectors = [
                'button.cky-btn-accept',
                '.cky-btn-accept',
                'button.cky-btn.cky-btn-accept',
                '[data-cky-tag="accept-button"]',
                'button[aria-label="Allow"]'
            ];
            
            // Try each accept button with multiple attempts
            let accepted = false;
            
            for (const selector of acceptSelectors) {
                try {
                    console.log(`Trying to click accept button with selector: ${selector}`);
                    
                    // Try force click first
                    await page.evaluate((sel) => {
                        const element = document.querySelector(sel);
                        if (element) {
                            console.log('Force clicking element via JS');
                            (element as HTMLElement).click();
                            return true;
                        }
                        return false;
                    }, selector).catch(() => false);
                    
                    // Then try regular click
                    await page.click(selector, { timeout: 2000 }).catch(() => {});
                    
                    // Wait to see if banner disappears
                    const bannerGone = await page.waitForSelector('div.cky-consent-bar', { 
                        state: 'hidden',
                        timeout: 3000
                    }).then(() => true).catch(() => false);
                    
                    if (bannerGone) {
                        accepted = true;
                        console.log(`Successfully accepted cookies using selector: ${selector}`);
                        break;
                    }
                } catch (e) {
                    console.log(`Failed to click ${selector}: ${e.message}`);
                }
            }
            
            // Final fallback: try to remove the banner with JavaScript
            if (!accepted) {
                console.log('Attempting to remove cookie banner via JavaScript...');
                await page.evaluate(() => {
                    const banners = document.querySelectorAll('.cky-consent-bar, .cky-consent-container, [data-cky-tag="notice"]');
                    banners.forEach(banner => {
                        if (banner) {
                            console.log('Removing banner via JS');
                            banner.remove();
                        }
                    });
                });
            }
            
            // Additional wait to ensure banner animations are complete
            await page.waitForTimeout(2000);
            
            console.log('Cookie consent handling completed');
        return true;
        } else {
            console.log('No cookie consent banner found or it was already handled');
            return false;
        }
    } catch (error) {
        console.log('Error handling cookie consent:', error.message);
        
        // Last resort: try to remove any consent banners via JavaScript
        try {
            await page.evaluate(() => {
                document.querySelectorAll('.cky-consent-bar, .cky-consent-container, [data-cky-tag="notice"]')
                    .forEach(el => el.remove());
            });
        } catch (e) {
            console.log('Failed to remove cookie banner via JS:', e.message);
        }
        return false;
    }
}

/**
 * Optimized page scrolling with intelligent pauses for content loading
 */
export async function optimizedScrollPage(page: Page): Promise<void> {
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
    
    console.log(`Page height: ${pageHeight}px, starting scrolling...`);
    
    // Scroll in larger chunks with fewer pauses
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    const scrollStep = Math.floor(viewportHeight); // Full viewport at a time
    
    // Use a more efficient approach with fewer evaluate calls
    for (let position = 0; position < pageHeight; position += scrollStep) {
        await page.evaluate((pos) => {
            window.scrollTo({
                top: pos,
                behavior: 'auto' // Using 'auto' instead of 'smooth' for faster scrolling
            });
        }, position);
        
        // Brief pause to allow content to load
        await page.waitForTimeout(300);
        
        // Check if we're at a position with likely lazy-loaded content (e.g., every 1000px)
        if (position % 1000 < scrollStep) {
            // Wait a bit longer every 1000px to ensure lazy content loads
            await page.waitForLoadState('networkidle', { timeout: 1000 }).catch(() => {
                // Ignore timeout errors from networkidle
            });
        }
    }
    
    // Final scroll to bottom to ensure everything is triggered
    await page.evaluate(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'auto'
        });
    });
    
    // Brief wait for final network requests
    await page.waitForLoadState('networkidle', { timeout: 2000 }).catch(() => {
        console.log('Final network idle wait timed out, continuing anyway');
    });
    
    console.log('Scrolling completed');
}

/**
 * Standard page setup with appropriate waiting
 */
export async function setupPage(
    page: Page, 
    url: string, 
    viewport?: ViewportSize, 
    options: {
        handleCookieConsent?: boolean;
        waitTime?: number;
        scrollPage?: boolean;
    } = { 
        handleCookieConsent: true,
        waitTime: 3000,
        scrollPage: true
    }
) {
    // Set viewport if provided
    if (viewport) {
        await page.setViewportSize(viewport);
    }
    
    // Navigate to URL
    await page.goto(url);
    
    // Handle cookie consent if needed
    if (options.handleCookieConsent) {
        await handleCookieConsent(page);
    }
    
    // Wait for initial loading
    await page.waitForLoadState('networkidle');
    
    // Wait for specified time
    const waitTime = options.waitTime ?? 3000;
    console.log(`Waiting ${waitTime}ms for page to fully render...`);
    await page.waitForTimeout(waitTime);
    
    // Scroll page if needed
    if (options.scrollPage) {
        await optimizedScrollPage(page);
        
        // Return to top of page
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        await page.waitForTimeout(1000);
    }
}

/**
 * Sets up screenshot paths and directories
 */
export interface ScreenshotPaths {
    screenshotsDir: string;
    baselineDir: string;
    baselinePath: string;
    actualPath: string;
    diffPath: string;
}

export function setupScreenshotPaths(
    baseDir: string, 
    screenshotName: string
): ScreenshotPaths {
    const timestamp = Date.now();
    
    // Get the screenshots output directory from the test-results folder
    // This will be created by Playwright
    const screenshotsDir = path.join(process.cwd(), 'test-results');
    
    // Check for src/ScreenShots directory first (existing structure)
    let baselineDir = path.join(process.cwd(), 'src', 'ScreenShots', baseDir);
    
    // If that doesn't exist, use the screenshots/baseDir directory
    if (!fs.existsSync(baselineDir)) {
        baselineDir = path.join(screenshotsDir, baseDir);
    }
    
    // Create directories if they don't exist
    if (!fs.existsSync(screenshotsDir)) {
        fs.mkdirSync(screenshotsDir, { recursive: true });
    }
    
    if (!fs.existsSync(baselineDir)) {
        fs.mkdirSync(baselineDir, { recursive: true });
    }
    
    // Set up file paths - use existing naming pattern from src/ScreenShots/HomePage
    // Just the name without any suffix for baseline
    const baselineName = `${screenshotName}.png`;
    const baselinePath = path.join(baselineDir, baselineName);
    
    // Create a special output folder for the test results using proper naming
    const outputFileBase = `${screenshotName.replace(/-/g, '_')}`;
    
    // Use better naming that matches the screenshot content
    const actualName = `${outputFileBase}_actual.png`;
    const actualPath = path.join(screenshotsDir, actualName);
    
    const diffName = `${outputFileBase}_diff.png`;
    const diffPath = path.join(screenshotsDir, diffName);
    
    // Log paths for debugging
    console.log(`Screenshot paths:
        - Baseline directory: ${baselineDir}
        - Baseline: ${baselinePath}
        - Actual: ${actualPath}
        - Diff: ${diffPath}`);
    
    return {
        screenshotsDir,
        baselineDir,
        baselinePath,
        actualPath,
        diffPath
    };
}

/**
 * Takes a full-page screenshot and attaches it to the test report
 */
export async function takeFullPageScreenshot(
    page: Page, 
    paths: ScreenshotPaths,
    testInfo: any
): Promise<string> {
    // Take a full-page screenshot
    await page.screenshot({
        path: paths.actualPath,
        fullPage: true, // Capture the full page, not just the viewport
        type: 'png'
    });
    
    // Attach the screenshot to the test report
    await testInfo.attach('actual', {
        path: paths.actualPath,
        contentType: 'image/png'
    });
    
    return paths.actualPath;
}

/**
 * Interface for comparison options
 */
export interface ComparisonOptions {
    threshold: number;
    includeAA: boolean;
    alpha: number;
    diffColor: [number, number, number];
    diffMask: boolean;
    maxDiffPercentage: number;
}

/**
 * Interface for comparison result
 */
export interface ComparisonResult {
    diffPixels: number;
    percentDifferent: number;
    maxAcceptableDiffPixels: number;
    passed: boolean;
}

/**
 * Compare screenshots using Pixelmatch with configurable options
 */
export async function compareScreenshots(
    actualPath: string, 
    baselinePath: string, 
    diffPath: string,
    options: Partial<ComparisonOptions> = {}
): Promise<ComparisonResult> {
    // Dynamically import pixelmatch (ESM module)
    const pixelmatch = (await import('pixelmatch')).default;
    
    // Read both PNG images
    const actualImg = PNG.sync.read(fs.readFileSync(actualPath));
    const baselineImg = PNG.sync.read(fs.readFileSync(baselinePath));
    
    // Create a PNG for the diff output
    const { width, height } = actualImg;
    const diff = new PNG({ width, height });
    
    // Check if dimensions match
    if (baselineImg.width !== width || baselineImg.height !== height) {
        console.log('Warning: Image dimensions do not match. Resizing not implemented.');
        console.log(`Actual: ${width}x${height}, Baseline: ${baselineImg.width}x${baselineImg.height}`);
        
        // Create a red diff image to indicate error
        createErrorDiffImage(diffPath, actualPath);
        
        // Return a high difference count to indicate a mismatch
        return {
            diffPixels: 10000,
            percentDifferent: 100,
            maxAcceptableDiffPixels: 0,
            passed: false
        };
    }
    
    // Default comparison settings with overrides from options
    const comparisonSettings = {
        threshold: options.threshold ?? 0.3,
        includeAA: options.includeAA ?? true,
        alpha: options.alpha ?? 0.3,
        diffColor: options.diffColor ?? [255, 0, 0] as [number, number, number],
        diffMask: options.diffMask ?? false
    };
    
    // Calculate pixels per image
    const totalPixels = width * height;
    
    // Compare the images - returns the number of different pixels
    const diffPixels = pixelmatch(
        actualImg.data,
        baselineImg.data,
        diff.data,
        width,
        height,
        comparisonSettings
    );
    
    // Force some difference in the diff image even if pixels are identical
    // This ensures the diff image is visually different from a blank image
    if (diffPixels === 0) {
        // Add a visible indicator that shows this was a perfect match
        // Use a frame around the image to indicate "perfect match"
        const borderWidth = 10;
        const blue = [0, 0, 255, 200];
        
        // Draw top and bottom borders
        for (let x = 0; x < width; x++) {
            // Top border
            for (let y = 0; y < borderWidth; y++) {
                const idx = (width * y + x) << 2;
                diff.data[idx] = blue[0];     // R
                diff.data[idx + 1] = blue[1]; // G
                diff.data[idx + 2] = blue[2]; // B
                diff.data[idx + 3] = blue[3]; // A
            }
            
            // Bottom border
            for (let y = height - borderWidth; y < height; y++) {
                const idx = (width * y + x) << 2;
                diff.data[idx] = blue[0];     // R
                diff.data[idx + 1] = blue[1]; // G
                diff.data[idx + 2] = blue[2]; // B
                diff.data[idx + 3] = blue[3]; // A
            }
        }
        
        // Draw left and right borders
        for (let y = 0; y < height; y++) {
            // Left border
            for (let x = 0; x < borderWidth; x++) {
                const idx = (width * y + x) << 2;
                diff.data[idx] = blue[0];     // R
                diff.data[idx + 1] = blue[1]; // G
                diff.data[idx + 2] = blue[2]; // B
                diff.data[idx + 3] = blue[3]; // A
            }
            
            // Right border
            for (let x = width - borderWidth; x < width; x++) {
                const idx = (width * y + x) << 2;
                diff.data[idx] = blue[0];     // R
                diff.data[idx + 1] = blue[1]; // G
                diff.data[idx + 2] = blue[2]; // B
                diff.data[idx + 3] = blue[3]; // A
            }
        }
        
        // Add "PERFECT MATCH" text in the center
        console.log('No differences found, adding visual indicator to diff image');
    }
    
    // Write the diff image to a file
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
    
    // Calculate percentage different for better context
    const percentDifferent = (diffPixels / totalPixels) * 100;
    
    // Set acceptable difference threshold (default 5%)
    const maxAcceptableDiffPercentage = options.maxDiffPercentage ?? 5.0;
    const maxAcceptableDiffPixels = Math.floor(totalPixels * (maxAcceptableDiffPercentage / 100));
    
    console.log(`Pixel difference count: ${diffPixels} (${percentDifferent.toFixed(2)}% of total)`);
    console.log(`Maximum acceptable difference: ${maxAcceptableDiffPixels} pixels (${maxAcceptableDiffPercentage}%)`);
    
    // Determine if test passed
    const passed = diffPixels <= maxAcceptableDiffPixels;
    
    if (passed) {
        console.log(`Test passed: Difference of ${percentDifferent.toFixed(2)}% is within acceptable limit of ${maxAcceptableDiffPercentage}%`);
    } else {
        console.log(`Test failed: Difference of ${percentDifferent.toFixed(2)}% exceeds acceptable limit of ${maxAcceptableDiffPercentage}%`);
    }
    
    // Return results
    return {
        diffPixels,
        percentDifferent,
        maxAcceptableDiffPixels,
        passed
    };
}

/**
 * Creates an error diff image (red overlay) to use when dimensions don't match
 */
function createErrorDiffImage(diffPath: string, actualPath: string): void {
    try {
        // Read the actual image to get dimensions
        const actualImg = PNG.sync.read(fs.readFileSync(actualPath));
        const { width, height } = actualImg;
        
        // Create a new PNG with same dimensions
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
        console.log(`Created error diff image: ${diffPath}`);
    } catch (error) {
        console.error('Error creating error diff image:', error);
    }
}

/**
 * Creates a desktop browser context with standard settings
 */
export async function createDesktopContext(
    browser: any, 
    options: {
        width?: number;
        height?: number;
        locale?: string;
    } = {}
): Promise<BrowserContext> {
    return await browser.newContext({
        viewport: { 
            width: options.width ?? 1920, 
            height: options.height ?? 1080 
        },
        locale: options.locale,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false
    });
}

/**
 * Creates a mobile browser context with standard settings
 */
export async function createMobileContext(
    browser: any,
    deviceName: string = 'iPhone 12',
    options: {
        locale?: string;
    } = {}
): Promise<BrowserContext> {
    const devices = require('@playwright/test').devices;
    
    return await browser.newContext({
        ...devices[deviceName],
        locale: options.locale,
        isMobile: true,
        hasTouch: true
    });
}

/**
 * Comprehensive function to handle visual comparison of a page
 */
export async function comparePageScreenshot(
    page: Page, 
    screenshotName: string, 
    baseDir: string,
    testInfo: any,
    options: Partial<ComparisonOptions> = {}
): Promise<ComparisonResult> {
    // Setup screenshot paths
    const paths = setupScreenshotPaths(baseDir, screenshotName);
    
    // Take screenshot
    await takeFullPageScreenshot(page, paths, testInfo);
    
    // If baseline exists, compare screenshots
    if (fs.existsSync(paths.baselinePath)) {
        const result = await compareScreenshots(paths.actualPath, paths.baselinePath, paths.diffPath, options);
        
        // Always attach diff image
        if (fs.existsSync(paths.diffPath)) {
            // Ensure diff image is attached with higher priority so it appears first
            await testInfo.attach('diff', {
                path: paths.diffPath,
                contentType: 'image/png'
            });
        } else {
            // If no diff image was created (should not happen with our improved logic),
            // create one forcibly to ensure consistent reporting
            console.log('No diff image found, creating one now...');
            createEmptyDiffImage(paths.diffPath, paths.actualPath);
            
            await testInfo.attach('diff (generated)', {
                path: paths.diffPath,
                contentType: 'image/png'
            });
        }
        
        // Log the paths for debugging
        console.log(`Screenshot comparison complete:
            - Actual: ${paths.actualPath}
            - Diff: ${paths.diffPath}
            - Result: ${result.passed ? 'PASSED' : 'FAILED'} (${result.percentDifferent.toFixed(2)}% different)`);
        
        return result;
    } else {
        console.log(`Baseline image not found for ${screenshotName}. Current screenshot will be used as baseline.`);
        // Copy the current screenshot as the baseline for future comparisons
        fs.copyFileSync(paths.actualPath, paths.baselinePath);
        
        // Create a placeholder "empty" diff image to ensure consistent reporting
        createEmptyDiffImage(paths.diffPath, paths.actualPath);
        
        // Attach the empty diff image
        if (fs.existsSync(paths.diffPath)) {
            await testInfo.attach('diff (new baseline)', {
                path: paths.diffPath,
                contentType: 'image/png'
            });
        }
        
        console.log(`Created new baseline image: ${paths.baselinePath}`);
        
        // Return a "passed" result since this is the first run
        return {
            diffPixels: 0,
            percentDifferent: 0,
            maxAcceptableDiffPixels: 0,
            passed: true
        };
    }
}

/**
 * Creates an empty diff image (green transparent overlay) to use when no baseline exists
 */
function createEmptyDiffImage(diffPath: string, actualPath: string): void {
    try {
        // Read the actual image to get dimensions
        const actualImg = PNG.sync.read(fs.readFileSync(actualPath));
        const { width, height } = actualImg;
        
        // Create a new PNG with same dimensions
        const emptyDiff = new PNG({ width, height });
        
        // Fill with a semi-transparent green to indicate "new baseline"
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (width * y + x) << 2;
                
                // Very light green with low opacity
                emptyDiff.data[idx] = 0;      // R
                emptyDiff.data[idx + 1] = 255;  // G
                emptyDiff.data[idx + 2] = 0;    // B
                emptyDiff.data[idx + 3] = 30;   // A (mostly transparent)
            }
        }
        
        // Write the diff image to a file
        fs.writeFileSync(diffPath, PNG.sync.write(emptyDiff));
        console.log(`Created empty diff image: ${diffPath}`);
    } catch (error) {
        console.error('Error creating empty diff image:', error);
    }
} 