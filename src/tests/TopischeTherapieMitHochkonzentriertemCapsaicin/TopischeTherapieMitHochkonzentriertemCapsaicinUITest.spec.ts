import { test, expect } from '@playwright/test';
import { TopischeTherapieMitHochkonzentriertemCapsaicinPage } from '../../pages/TopischeTherapieMitHochkonzentriertemCapsaicinHelpers/TopischeTherapieMitHochkonzentriertemCapsaicinPage';
import { setupPage, comparePageScreenshot } from '../../utils/uiTestUtils';
import fs from 'fs';

test.describe('Topische Therapie mit hochkonzentriertem Capsaicin page visual comparison', () => {
    const languages = ['de', 'fr'] as const;
    
    for (const lang of languages) {
        test(`Desktop view - ${lang}`, async ({ page }) => {
            // Set up the page with language-specific URL
            const url = lang === 'de' ? '/topische-therapie-mit-hochkonzentriertem-capsaicin/' : `/${lang}/topische-therapie-mit-hochkonzentriertem-capsaicin/`;
            await setupPage(page, url, {
                width: 1600,
                height: 1080
            });
            
            // Additional wait to ensure all images are loaded
            await page.waitForLoadState('networkidle', { timeout: 15000 });
            
            const { diffCount, diffPath, actualPath } = await comparePageScreenshot(
                page,
                `TopischeTherapieMitHochkonzentriertemCapsaicinPage-Full-${lang}`,
                'TopischeTherapieMitHochkonzentriertemCapsaicinPage'
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
            const url = lang === 'de' ? '/topische-therapie-mit-hochkonzentriertem-capsaicin/' : `/${lang}/topische-therapie-mit-hochkonzentriertem-capsaicin/`;
            await setupPage(page, url, {
                width: 375,  // iPhone SE width
                height: 667  // iPhone SE height
            });
            
            // Wait for language content to fully load
            try {
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
                `TopischeTherapieMitHochkonzentriertemCapsaicinPage-Mobile-${lang}`,
                'TopischeTherapieMitHochkonzentriertemCapsaicinPage'
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