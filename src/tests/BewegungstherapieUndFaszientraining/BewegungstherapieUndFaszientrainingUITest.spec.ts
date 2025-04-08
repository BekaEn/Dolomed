import { test, devices } from '@playwright/test';
import { 
    setupPage, 
    createDesktopContext,
    createMobileContext,
    comparePageScreenshot
} from '../../utils/uiTestUtils';

// Increase the test timeout to 2 minutes
test.setTimeout(120000);

test.describe('Bewegungstherapie und Faszientraining page visual comparison', () => {
    const languages = ['de', 'fr'] as const;
    
    for (const lang of languages) {
        test(`Desktop view - ${lang}`, async ({ browser }) => {
            // Create a new context with desktop settings
            const desktopContext = await createDesktopContext(browser, { locale: lang });
            
            try {
                // Create a new page in the desktop context
                const page = await desktopContext.newPage();
                
                // Set up the page with language-specific URL and optimized flow
                const url = lang === 'de' ? '/bewegungstherapie-und-faszientraining/' : `/${lang}/bewegungstherapie-und-faszientraining/`;
                await setupPage(page, url, {
                    width: 1600,
                    height: 1080
                }, {
                    handleCookieConsent: true,
                    waitTime: 3000,
                    scrollPage: true
                });
                
                // Additional wait to ensure all images are loaded
                await page.waitForLoadState('networkidle', { timeout: 15000 });
                
                // Use the comprehensive function for screenshot comparison
                const result = await comparePageScreenshot(
                    page,
                    `BewegungstherapieUndFaszientrainingPage-Full-${lang}`,
                    'BewegungstherapieUndFaszientrainingPage',
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
            // Create a new context with iPhone 12 device emulation
            const mobileContext = await createMobileContext(browser, 'iPhone 12', { locale: lang });
            
            try {
                // Create a new page in the mobile context
                const page = await mobileContext.newPage();
                
                // Set up the page with language-specific URL
                const url = lang === 'de' ? '/bewegungstherapie-und-faszientraining/' : `/${lang}/bewegungstherapie-und-faszientraining/`;
                
                // Use the comprehensive setup function
                await setupPage(page, url, {
                    width: 375,
                    height: 667
                }, {
                    handleCookieConsent: true,
                    waitTime: 3000,
                    scrollPage: true
                });
                
                // Force touch events to be registered (simulate some user interaction)
                await page.tap('body');
                
                // Wait for all content to load
                try {
                    // Additional wait to ensure full page render
                    await page.waitForLoadState('networkidle', { timeout: 15000 });
                } catch (error) {
                    console.log(`Warning: Some elements not found, continuing test: ${error.message}`);
                }
                
                // Use the single comprehensive function for screenshot comparison
                const result = await comparePageScreenshot(
                    page,
                    `BewegungstherapieUndFaszientrainingPage-Mobile-${lang}`,
                    'BewegungstherapieUndFaszientrainingPage',
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