import { test } from '@playwright/test';
import { setupPage, comparePageScreenshot } from '../../utils/uiTestUtils';
import fs from 'fs';

test.describe('Schmerzen Innerer Organe page visual comparison', () => {
    const languages = ['de', 'fr'] as const;
    
    for (const lang of languages) {
        test(`Desktop view - ${lang}`, async ({ page }) => {
            // Set up the page with language-specific URL
            const url = lang === 'de' ? '/schmerzen-innerer-organe/' : `/${lang}/schmerzen-innerer-organe/`;
            await setupPage(page, url, {
                width: 1600,
                height: 1080
            });
            
            // Wait for critical elements to load
            await page.waitForSelector('.elementor-element[data-id="4a814d00"]', { state: 'visible' });
            
            // Additional wait to ensure all images are loaded
            await page.waitForLoadState('networkidle', { timeout: 15000 });
            
            const { diffCount, diffPath, actualPath } = await comparePageScreenshot(
                page,
                `SchmerzenInnererOrganePage-Full-${lang}`,
                'SchmerzenInnererOrganePage'
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
            const url = lang === 'de' ? '/schmerzen-innerer-organe/' : `/${lang}/schmerzen-innerer-organe/`;
            await setupPage(page, url, {
                width: 375,  // iPhone SE width
                height: 667  // iPhone SE height
            });
            
            // Wait for language content to fully load
            try {
                // Wait for the language selector to be visible (might be in mobile menu)
                await page.waitForSelector('.dropdownlang, .pix-wpml-header-btn, .wpml-ls', { timeout: 10000 });
                
                // Wait for hero section to be visible
                await page.waitForSelector('.elementor-element[data-id="4a814d00"]', { state: 'visible' });
                
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
                `SchmerzenInnererOrganePage-Mobile-${lang}`,
                'SchmerzenInnererOrganePage'
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
        
        // Test individual sections for detailed visual comparison
        test(`Section-by-section visual tests - ${lang}`, async ({ page }) => {
            // Set up the page with language-specific URL
            const url = lang === 'de' ? '/schmerzen-innerer-organe/' : `/${lang}/schmerzen-innerer-organe/`;
            await setupPage(page, url, {
                width: 1600,
                height: 1080
            });
            
            // Array of sections to test with their selectors
            const sections = [
                { name: 'Hero', selector: '.elementor-element[data-id="4a814d00"]' },
                { name: 'WhatAre', selector: '.elementor-element[data-id="5fe61570"]' },
                { name: 'Pankreatitis', selector: '.elementor-element[data-id="37f0389"]' },
                { name: 'Endometriose', selector: '.elementor-element[data-id="1d695aaf"]' },
                { name: 'PelvicPain', selector: '.elementor-element[data-id="2892ea96"]' },
                { name: 'AnginaPectoris', selector: '.elementor-element[data-id="41f81d5"]' },
                { name: 'WieWeiter', selector: '.e-con-inner:has(.elementor-element[data-id="a10eaeb"])' },
                { name: 'FAQ', selector: '.elementor-element[data-id="fe5401c"]' },
                { name: 'Contact', selector: '.elementor-section[data-id="fb3726c"]' }
            ];
            
            // Test each section
            for (const section of sections) {
                // Scroll to section
                await page.locator(section.selector).scrollIntoViewIfNeeded();
                
                // Additional wait to ensure section is fully rendered
                await page.waitForTimeout(500);
                
                // Take section screenshot
                const { diffCount, diffPath, actualPath } = await comparePageScreenshot(
                    page,
                    `SchmerzenInnererOrganePage-${section.name}-${lang}`,
                    'SchmerzenInnererOrganePage'
                );
                
                // Attach actual image
                await test.info().attach(`${section.name}-actual`, {
                    path: actualPath,
                    contentType: 'image/png'
                });
                
                // Attach diff image if exists
                if (fs.existsSync(diffPath)) {
                    await test.info().attach(`${section.name}-diff`, {
                        path: diffPath,
                        contentType: 'image/png'
                    });
                }
                
                // Check for significant differences
                if (typeof diffCount === 'number' && diffCount >= 500) {
                    test.info().annotations.push({
                        type: 'warning',
                        description: `Visual differences detected in ${section.name} section (${lang}): ${diffCount} pixels different.`
                    });
                }
            }
        });
    }
}); 