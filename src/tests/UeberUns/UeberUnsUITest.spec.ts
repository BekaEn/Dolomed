import { test } from '@playwright/test';
import { 
    setupPage, 
    createDesktopContext,
    createMobileContext
} from '../../utils/uiTestUtils';
import { comparePageScreenshot } from '../../utils/imageCompare';

// Increase the test timeout to 120 seconds
test.setTimeout(120000);

test.describe('Uber Uns page visual comparison', () => {
    const languages = ['de', 'fr'] as const;
    
    for (const lang of languages) {
        test(`Desktop view - ${lang}`, async ({ browser }) => {
            // Create a new context with desktop settings
            const desktopContext = await createDesktopContext(browser, { locale: lang });
            
            try {
                // Create a new page in the desktop context
                const page = await desktopContext.newPage();
                
                // Set up the page with language-specific URL
                const url = getLanguageUrl(lang);
                await setupPage(page, url, undefined, {
                    handleCookieConsent: true,
                    waitTime: 3000,
                });
                
                // Wait for network to be idle
                await page.waitForLoadState('networkidle', { timeout: 15000 });
                
                // Use the comprehensive function for screenshot comparison
                // The comparePageScreenshot will handle appropriate scrolling through the page
                // to trigger lazy loading before taking the screenshot
                const result = await comparePageScreenshot(
                    page,
                    `UeberUnsPage_Full_${lang}`,
                    'UeberUnsPage',
                    test.info(),
                    {
                        threshold: 0.3,
                        includeAA: true,
                        maxDiffPercentage: 5.0
                    }
                );
                
                // Log test information including diff paths
                console.log(`Desktop test results for ${lang}:
                    - Passed: ${result.passed}
                    - Difference: ${result.percentDifferent.toFixed(2)}%
                    - Maximum allowed: 5.0%`);
                
                // Fail the test if the comparison fails
                if (!result.passed) {
                    throw new Error(`Visual differences detected in ${lang}: ${result.percentDifferent.toFixed(2)}% of pixels are different. Max allowed: 5.0%. Check the diff image for details.`);
                }
            } catch (error) {
                // Log the error properly
                console.error(`Test failed: ${error.message}`);
                throw error;
            } finally {
                // Always close the context
                await desktopContext.close();
            }
        });

        test(`Mobile view - ${lang}`, async ({ browser }) => {
            // Create a new context with mobile device emulation
            const mobileContext = await createMobileContext(browser, 'iPhone 12', { locale: lang });
            
            try {
                // Create a new page in the mobile context
                const page = await mobileContext.newPage();
                
                // Get current viewport size
                const viewport = page.viewportSize() || { width: 375, height: 667 };
                console.log(`Mobile viewport size: ${viewport.width}x${viewport.height}`);
                
                // Set up the page with language-specific URL
                const url = getLanguageUrl(lang);
                await setupPage(page, url, undefined, {
                    handleCookieConsent: true,
                    waitTime: 3000,
                });
                
                // Fix layout issues before taking screenshot
                await fixMobileLayout(page);
                
                // Wait for network to be idle
                await page.waitForLoadState('networkidle', { timeout: 15000 });
                
                // Use the comprehensive function for screenshot comparison
                // The comparePageScreenshot will handle appropriate scrolling through the page
                // to trigger lazy loading before taking the screenshot
                const result = await comparePageScreenshot(
                    page,
                    `UeberUnsPage_Mobile_${lang}`,
                    'UeberUnsPage',
                    test.info(),
                    {
                        threshold: 0.3,
                        includeAA: true,
                        maxDiffPercentage: 5.0
                    }
                );
                
                // Log test information including diff paths
                console.log(`Mobile test results for ${lang}:
                    - Passed: ${result.passed}
                    - Difference: ${result.percentDifferent.toFixed(2)}%
                    - Maximum allowed: 5.0%`);
                
                // Fail the test if the comparison fails
                if (!result.passed) {
                    throw new Error(`Visual differences detected in ${lang}: ${result.percentDifferent.toFixed(2)}% of pixels are different. Max allowed: 5.0%. Check the diff image for details.`);
                }
            } catch (error) {
                // Log the error properly
                console.error(`Test failed: ${error.message}`);
                throw error;
            } finally {
                // Always close the context
                await mobileContext.close();
            }
        });
    }
});

/**
 * Fixes mobile layout issues before taking a screenshot
 */
async function fixMobileLayout(page: any): Promise<void> {
    // Fix the layout by applying CSS constraints
    await page.evaluate(() => {
        // Get the viewport width
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        console.log(`Viewport dimensions: ${viewportWidth}x${viewportHeight}`);
        
        // Force content width to match viewport width exactly
        document.documentElement.style.width = `${viewportWidth}px`;
        document.documentElement.style.maxWidth = `${viewportWidth}px`;
        document.body.style.width = `${viewportWidth}px`;
        document.body.style.maxWidth = `${viewportWidth}px`;
        document.body.style.overflowX = 'hidden';
        document.body.style.paddingRight = '0';
        document.body.style.marginRight = '0';
        
        // Fix common layout issues by constraining elements
        const containerElements = document.querySelectorAll('.elementor-container, .elementor-section, .elementor-widget, .elementor-column');
        containerElements.forEach((el: Element) => {
            // Force all container elements to respect viewport width
            const element = el as HTMLElement;
            const style = window.getComputedStyle(element);
            const width = parseFloat(style.width);
            
            if (width > viewportWidth) {
                element.style.width = `${viewportWidth}px`;
                element.style.maxWidth = `${viewportWidth}px`;
                element.style.marginRight = '0';
                element.style.paddingRight = '0';
                element.style.boxSizing = 'border-box';
                console.log(`Fixed oversized element: ${element.className}, width: ${width}px`);
            }
        });
        
        // Find and fix any elements with overflow or that extend beyond viewport
        document.querySelectorAll('*').forEach((el: Element) => {
            const element = el as HTMLElement;
            const rect = element.getBoundingClientRect();
            
            // Check if element extends beyond viewport width
            if (rect.right > viewportWidth + 5) { // 5px tolerance
                element.style.maxWidth = '100%';
                element.style.width = '100%';
                element.style.boxSizing = 'border-box';
                element.style.overflowX = 'hidden';
                console.log(`Fixed element extending beyond viewport: ${element.tagName}.${element.className}`);
            }
        });
        
        // Remove any horizontal scrolling
        document.documentElement.style.overflowX = 'hidden';
        
        // Return the actual content height to verify
        return {
            documentHeight: Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            ),
            bodyWidth: document.body.offsetWidth,
            htmlWidth: document.documentElement.offsetWidth
        };
    }).then((dimensions) => {
        console.log(`Content dimensions after fixes - Height: ${dimensions.documentHeight}px, Body width: ${dimensions.bodyWidth}px, HTML width: ${dimensions.htmlWidth}px`);
    });
    
    // Wait a moment for any style recalculations
    await page.waitForTimeout(500);
}

// Helper function to get the correct URL for each language
function getLanguageUrl(lang: string): string {
    // German is served from the base path for ueber-uns
    if (lang === 'de') return '/ueber-uns/';
    
    // All other languages use their language code in the URL
    return `/${lang}/ueber-uns/`;
} 