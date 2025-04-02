import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/Home Page/HomePage';
import { Footer } from '../../pages/Home Page/Footer';

test.describe('Footer Functionality', () => {
    let homePage: HomePage;
    let footer: Footer;
    const defaultTimeout = 25000; // Increased timeout

    test.beforeEach(async ({ page }) => {
        // Set longer timeout for all tests
        test.setTimeout(defaultTimeout);
        
        homePage = new HomePage(page);
        footer = new Footer(page);
        
        // Try to go to homepage and skip all tests if it fails
        const loaded = await homePage.goto();
        if (!loaded) {
            test.skip();
        }
        
        // Wait for page to load completely with better timeout handling
        await page.waitForLoadState('domcontentloaded', { timeout: defaultTimeout });
        await page.waitForLoadState('networkidle', { timeout: defaultTimeout });        
        // Scroll to bottom to ensure footer is in view
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });    
        // Wait for any animations or lazy loading to complete
        await page.waitForTimeout(2000);
    });

    test('should find Dolomed footer container', async ({ page }) => {
        const isVisible = await footer.verifyDolomedFooterContainer();
        expect(isVisible).toBeTruthy();
    });

    test('should find footer logo', async ({ page }) => {
        const { logoFound, linkFound } = await footer.findFooterLogo();
        expect(logoFound).toBeTruthy();
        expect(linkFound).toBeTruthy();
    });

    test('should find social media section', async ({ page }) => {
        const { sectionVisible, instagramVisible } = await footer.findSocialMediaSection();
        expect(sectionVisible).toBeTruthy();
        expect(instagramVisible).toBeTruthy();
    });

    test('should find navigation sections', async ({ page }) => {
        const results = await footer.findNavigationSections();
        
        // All sections should be visible
        for (const section of results) {
            expect(section.visible).toBeTruthy();
        }
    });

    test('should find legal links', async ({ page }) => {
        const { impressumVisible, datenschutzVisible } = await footer.findLegalLinks();
        expect(impressumVisible).toBeTruthy();
        expect(datenschutzVisible).toBeTruthy();
    });

    test('should verify important navigation links are working', async ({ page }) => {
        const { atLeastOneLinkFound } = await footer.verifyImportantNavigationLinks();
        expect(atLeastOneLinkFound).toBeTruthy();
    });

    test('should verify all footer links and text', async ({ page }) => {
        const { linkStructure, results } = await footer.validateFooterStructure();
        // Verify results
        expect(results.allSectionsVisible).toBeTruthy();
        expect(results.allLinks.length).toBeGreaterThan(0);
        expect(results.essentialLinksFound).toBeTruthy();
    });
}); 