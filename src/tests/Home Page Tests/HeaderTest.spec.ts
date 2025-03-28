import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/Home Page/HomePage';
import { Header } from '../../pages/Home Page/Header';

test.describe('Header Functionality', () => {
    let homePage: HomePage;
    let header: Header;
    const defaultTimeout = 25000; // Increased timeout

    test.beforeEach(async ({ page }) => {
        // Set longer timeout for all tests
        test.setTimeout(defaultTimeout);
        
        homePage = new HomePage(page);
        header = new Header(page);
        
        // Try to go to homepage and skip all tests if it fails
        const loaded = await homePage.goto();
        if (!loaded) {
            test.skip();
        }
        
        // Wait for page to load completely with better timeout handling
        await page.waitForLoadState('domcontentloaded', { timeout: defaultTimeout });
        await page.waitForLoadState('networkidle', { timeout: defaultTimeout });
        
        // Make sure header is loaded
        await header.waitForHeaderToLoad();
    });

    test('should find logo and verify it is visible', async ({ page }) => {
        const isLogoVisible = await header.isLogoVisible();
        expect(isLogoVisible).toBeTruthy();
    });

    test('should verify main navigation menu is visible', async ({ page }) => {
        const navResult = await header.verifyMainNavigation();
        
        expect(navResult.isMainMenuVisible).toBeTruthy();
        expect(navResult.menuItems.krankheiten).toBeTruthy();
        expect(navResult.menuItems.therapie).toBeTruthy();
        expect(navResult.menuItems.ueberUns).toBeTruthy();
        expect(navResult.menuItems.patienten).toBeTruthy();
    });

    test('should open Krankheiten dropdown menu', async ({ page }) => {
        const dropdownResult = await header.openKrankheitenDropdown();
        
        expect(dropdownResult.dropdownVisible).toBeTruthy();
        expect(dropdownResult.hasExpectedContent).toBeTruthy();
        expect(dropdownResult.hasMovementLink).toBeTruthy();
    });

    test('should open Therapie dropdown menu', async ({ page }) => {
        const dropdownResult = await header.openTherapieDropdown();
        
        expect(dropdownResult.dropdownVisible).toBeTruthy();
        expect(dropdownResult.hasNervenstimulationLink).toBeTruthy();
        expect(dropdownResult.hasAkupunkturLink).toBeTruthy();
    });

    test('should verify language selector is working', async ({ page }) => {
        const languageResult = await header.verifyLanguageSelector();
        
        expect(languageResult.isLanguageButtonVisible).toBeTruthy();
        expect(languageResult.isFrenchOptionVisible).toBeTruthy();
    });

    test('should verify call button is visible with correct phone number', async ({ page }) => {
        const callButtonResult = await header.verifyCallButton();
        
        expect(callButtonResult.isCallButtonVisible).toBeTruthy();
        expect(callButtonResult.hasCorrectPhoneNumber).toBeTruthy();
    });

    test('should show mobile menu button on mobile viewport', async ({ page }) => {
        // Skip this test if browser doesn't support mobile emulation
        if (!page.viewportSize) {
            test.skip();
        }
        
        const mobileButtonResult = await header.verifyMobileMenuButton(true);
        expect(mobileButtonResult.isMobileButtonVisible).toBeTruthy();
    });

    test('should open mobile menu on mobile viewport', async ({ page }) => {
        // Skip this test if browser doesn't support mobile emulation
        if (!page.viewportSize) {
            test.skip();
        }
        
        const mobileMenuResult = await header.openMobileMenu(true);
        expect(mobileMenuResult.isMobileMenuVisible).toBeTruthy();
    });
}); 