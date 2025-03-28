import { Page } from '@playwright/test';
import { createCanvas, loadImage } from 'canvas';
import fs from 'fs';
import path from 'path';

// Add this interface at the top of the file
interface ViewportSize {
    width: number;
    height: number;
}

// Add this at the top of the file
const MAX_RETRIES = 3;
const RETRY_DELAY = 5000;

// Helper function to wait
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Add retry mechanism for page operations
async function retryOperation<T>(
    operation: () => Promise<T>,
    retries = MAX_RETRIES,
    delay = RETRY_DELAY
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        if (retries > 0) {
            await wait(delay);
            return retryOperation(operation, retries - 1, delay);
        }
        throw error;
    }
}

// Visual comparison utilities
export async function createVisualDiffReport(actualPath: string, baselinePath: string, diffPath: string) {
    try {
        // Load both images
        const actualImage = await loadImage(actualPath);
        const baselineImage = await loadImage(baselinePath);

        // Create canvas with dimensions of actual image
        const canvas = createCanvas(actualImage.width, actualImage.height);
        const ctx = canvas.getContext('2d');

        // Draw actual image
        ctx.drawImage(actualImage, 0, 0);

        // Compare pixels and highlight differences
        const actualData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const baselineCtx = createCanvas(baselineImage.width, baselineImage.height).getContext('2d');
        baselineCtx.drawImage(baselineImage, 0, 0);
        const baselineData = baselineCtx.getImageData(0, 0, baselineImage.width, baselineImage.height);

        let diffCount = 0;
        for (let i = 0; i < actualData.data.length; i += 4) {
            if (actualData.data[i] !== baselineData.data[i] ||
                actualData.data[i + 1] !== baselineData.data[i + 1] ||
                actualData.data[i + 2] !== baselineData.data[i + 2]) {
                actualData.data[i] = 255;     // Red
                actualData.data[i + 1] = 0;   // Green
                actualData.data[i + 2] = 0;   // Blue
                diffCount++;
            }
        }

        // Put the diff data back on canvas
        ctx.putImageData(actualData, 0, 0);

        // Save diff image
        const buffer = canvas.toBuffer('image/png');
        fs.writeFileSync(diffPath, buffer);

        return diffCount / 4; // Convert pixel components to actual pixels
    } catch (error) {
        console.error('Error in createVisualDiffReport:', error);
        throw error;
    }
}

// Scrolling utility
export async function scrollFullPage(page: Page, waitForSelector?: string) {
    await page.evaluate(async () => {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        
        // First, get the full height of the page
        const getDocumentHeight = () => {
            const body = document.body;
            const html = document.documentElement;
            
            return Math.max(
                body.scrollHeight,
                body.offsetHeight,
                html.clientHeight,
                html.scrollHeight,
                html.offsetHeight
            );
        };

        // Scroll in smaller increments
        const totalHeight = getDocumentHeight();
        const viewportHeight = window.innerHeight;
        let currentPosition = 0;

        while (currentPosition < totalHeight) {
            currentPosition += viewportHeight;
            window.scrollTo(0, currentPosition);
            await delay(500);
        }

        // Ensure we're at the bottom
        window.scrollTo(0, totalHeight);
        await delay(500);

        // Scroll back to top
        window.scrollTo(0, 0);
        await delay(500);
    });

    if (waitForSelector) {
        await page.waitForSelector(waitForSelector, { state: 'attached' });
    }

    // Additional stability wait
    await page.waitForTimeout(2000);
}

// Helper to accept cookie consent banner
export async function acceptCookieConsent(page: Page, timeout: number = 5000): Promise<boolean> {
    try {
        // Wait for cookie consent banner to appear
        await page.waitForSelector('.cky-consent-container', { timeout });
        
        // Click the accept button
        await page.click('.cky-btn-accept');
        
        // Wait for banner to disappear (optional but recommended)
        await page.waitForTimeout(1000);
        
        return true;
    } catch (error) {
        // Banner might not appear (e.g., if cookies already accepted)
        console.log('Cookie consent banner not found or already accepted');
        return false;
    }
}

// Standard page setup
export async function setupPage(
    page: Page, 
    url: string, 
    viewport?: ViewportSize, 
    options: {
        handleCookieConsent?: boolean;
        waitTime?: number;
    } = { handleCookieConsent: true }
) {
    if (viewport) {
        await page.setViewportSize(viewport);
    } else {
        await page.setViewportSize({ width: 1600, height: 1080 }); // default desktop size
    }
    
    await page.goto(url);
    
    // Handle cookie consent if needed
    if (options.handleCookieConsent) {
        await acceptCookieConsent(page);
    }
    
    const waitTime = options.waitTime ?? 20000;
    await page.waitForTimeout(waitTime);
    await scrollFullPage(page);
}

// Ensure the page is fully loaded and scrolled before taking a screenshot
export async function preparePageForScreenshot(page: Page) {
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');

    // Scroll to the bottom of the page
    await scrollFullPage(page);

    // Add a small delay to ensure everything is settled
    await page.waitForTimeout(1000);
}

// Improved scrolling utility
export async function scrollToBottom(page: Page) {
    await page.evaluate(async () => {
        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
        let lastHeight = document.documentElement.scrollHeight;
        while (true) {
            window.scrollTo(0, document.documentElement.scrollHeight);
            await delay(1000);
            const newHeight = document.documentElement.scrollHeight;
            if (newHeight === lastHeight) {
                break;
            }
            lastHeight = newHeight;
        }
    });
}

// Modified comparePageScreenshot function
export async function comparePageScreenshot(
    page: Page, 
    screenshotName: string, 
    baselineFolder: string,
    waitTime: number = 20000,
    options: {
        handleCookieConsent?: boolean;
    } = { handleCookieConsent: true }
) {
    try {
        // Handle cookie consent if option is enabled
        if (options.handleCookieConsent) {
            await acceptCookieConsent(page);
        }

        // Ensure the page is fully loaded with retry mechanism
        await retryOperation(async () => {
            await page.waitForLoadState('networkidle', { timeout: 30000 });
            await page.waitForLoadState('domcontentloaded', { timeout: 30000 });
        });

        // Get page dimensions with retry mechanism
        const dimensions = await retryOperation(async () => {
            return page.evaluate(() => {
                return {
                    height: Math.max(
                        document.body.scrollHeight,
                        document.body.offsetHeight,
                        document.documentElement.clientHeight,
                        document.documentElement.scrollHeight,
                        document.documentElement.offsetHeight
                    ),
                    width: Math.max(
                        document.body.scrollWidth,
                        document.body.offsetWidth,
                        document.documentElement.clientWidth,
                        document.documentElement.scrollWidth,
                        document.documentElement.offsetWidth
                    )
                };
            });
        });

        // Set viewport with retry mechanism
        await retryOperation(async () => {
            await page.setViewportSize({
                width: dimensions.width,
                height: dimensions.height
            });
        });

        // Scroll through the page with retry mechanism
        await retryOperation(async () => {
            await scrollFullPage(page);
        });

        // Take the screenshot with retry mechanism
        const timestamp = new Date().getTime();
        const actualPath = path.join(process.cwd(), 'test-results', `${screenshotName}-${timestamp}-actual.png`);
        const diffPath = path.join(process.cwd(), 'test-results', `${screenshotName}-${timestamp}-diff.png`);
        
        await retryOperation(async () => {
            await page.screenshot({
                path: actualPath,
                fullPage: true,
                timeout: 60000, // Increased timeout
                animations: 'disabled'
            });
        });

        // Verify screenshot was taken
        if (!fs.existsSync(actualPath)) {
            throw new Error(`Failed to create screenshot at: ${actualPath}`);
        }

        // Get baseline
        const baselinePath = path.join(process.cwd(), 'src', 'ScreenShots', baselineFolder, `${screenshotName}.png`);
        if (!fs.existsSync(baselinePath)) {
            throw new Error('Baseline screenshot not found at: ' + baselinePath);
        }

        // Run comparison with retry mechanism
        let diffCount;
        try {
            diffCount = await retryOperation(async () => {
                return await createVisualDiffReport(
                    actualPath,
                    baselinePath,
                    diffPath
                );
            });
            
            await wait(1000);
            
        } catch (error) {
            console.error('Error during visual comparison:', error);
            throw error;
        }

        return { 
            diffCount, 
            diffPath,
            actualPath,
            baselinePath 
        };
    } catch (error) {
        console.error('Error during screenshot comparison:', error);
        throw error;
    }
} 