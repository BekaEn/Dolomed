import { test } from '@playwright/test';
import { setupPage, comparePageScreenshot } from '../../utils/uiTestUtils';
import fs from 'fs';

test.describe('Chronischen Schmerzen page visual comparison', () => {
    const languages = ['de', 'fr'] as const;
    
    for (const lang of languages) {
        test(`Desktop view - ${lang}`, async ({ page }) => {
            // Set up the page with language-specific URL
            const url = lang === 'de' ? '/chronischen-schmerzen/' : `/${lang}/chronischen-schmerzen/`;
            await setupPage(page, url, {
                width: 1600,
                height: 1080
            });
            
            // Wait for critical elements to load
            await page.waitForSelector('.elementor-element[data-id="21d876af"]', { state: 'visible' });
            
            // Additional wait to ensure all images are loaded
            await page.waitForLoadState('networkidle', { timeout: 15000 });
            
            const { diffCount, diffPath, actualPath } = await comparePageScreenshot(
                page,
                `ChronischenSchmerzenPage-Full-${lang}`,
                'ChronischenSchmerzenPage'
            );

            // Attach both actual and diff images
            await test.info().attach('actual', {
                path: actualPath,
                contentType: 'image/png'
            });

            if (fs.existsSync(diffPath)) {
                await test.info().attach('diff', {
                    path: diffPath,
                    contentType: 'image/png'
                });
            }
            
            if (typeof diffCount === 'number' && diffCount >= 1000) {
                throw new Error(`Visual differences detected in ${lang}: ${diffCount} pixels different. Check ${diffPath} for details.`);
            }
        });

        test(`Mobile view - ${lang}`, async ({ page }) => {
            // Set up the page with language-specific URL
            const url = lang === 'de' ? '/chronischen-schmerzen/' : `/${lang}/chronischen-schmerzen/`;
            await setupPage(page, url, {
                width: 375,  // iPhone SE width
                height: 667  // iPhone SE height
            });
            
            // Wait for language content to fully load
            try {
                // Wait for the language selector to be visible (might be in mobile menu)
                await page.waitForSelector('.dropdownlang, .pix-wpml-header-btn, .wpml-ls', { timeout: 10000 });
                
                // Wait for hero section to be visible
                await page.waitForSelector('.elementor-element[data-id="21d876af"]', { state: 'visible' });
                
                // Additional wait to ensure full page render
                await page.waitForLoadState('networkidle', { timeout: 15000 });
            } catch (error) {
                test.info().annotations.push({
                    type: 'warning',
                    description: `Element wait failed on mobile: ${error.message}`
                });
            }
            
            const { diffCount, diffPath, actualPath } = await comparePageScreenshot(
                page,
                `ChronischenSchmerzenPage-Mobile-${lang}`,
                'ChronischenSchmerzenPage'
            );

            // Attach both actual and diff images
            await test.info().attach('actual', {
                path: actualPath,
                contentType: 'image/png'
            });

            if (fs.existsSync(diffPath)) {
                await test.info().attach('diff', {
                    path: diffPath,
                    contentType: 'image/png'
                });
            }
            
            if (typeof diffCount === 'number' && diffCount >= 1000) {
                throw new Error(`Visual differences detected in ${lang}: ${diffCount} pixels different. Check ${diffPath} for details.`);
            }
        });
    }
}); 