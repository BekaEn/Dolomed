import { test, expect } from '@playwright/test';
import { TopischeTherapieMitHochkonzentriertemCapsaicinPage } from '../../pages/TopischeTherapieMitHochkonzentriertemCapsaicinHelpers/TopischeTherapieMitHochkonzentriertemCapsaicinPage';

test.describe('Topische Therapie mit hochkonzentriertem Capsaicin Page', () => {
    let page: TopischeTherapieMitHochkonzentriertemCapsaicinPage;

    test.beforeEach(async ({ page: playwrightPage }) => {
        page = new TopischeTherapieMitHochkonzentriertemCapsaicinPage(playwrightPage);
        await page.navigate();
    });

    test('should display correct page title', async () => {
        await page.verifyPageTitle();
    });

    test('should display main content', async () => {
        await page.verifyMainContent();
    });

    test('should display phone number', async () => {
        await page.verifyPhoneNumber();
    });

    test('should display appointment button', async () => {
        await page.verifyAppointmentButton();
    });

    test('should display FAQ section', async () => {
        await page.verifyFAQSection();
    });

    test('should display address section', async () => {
        await page.verifyAddressSection();
    });
}); 