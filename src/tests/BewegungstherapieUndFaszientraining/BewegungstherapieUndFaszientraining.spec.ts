import { test, expect } from '@playwright/test';
import { BewegungstherapieUndFaszientrainingPage } from '../../pages/BewegungstherapieUndFaszientrainingHelpers/BewegungstherapieUndFaszientrainingPage';

test.describe('Bewegungstherapie und Faszientraining Page Tests', () => {
    let pageObject: BewegungstherapieUndFaszientrainingPage;

    test.beforeEach(async ({ page }) => {
        pageObject = new BewegungstherapieUndFaszientrainingPage(page);
        await pageObject.navigate();
    });

    test('should display correct page title', async () => {
        await pageObject.verifyPageTitle();
    });

    test('should display main content', async () => {
        await pageObject.verifyMainContent();
    });

    test('should display correct phone number', async () => {
        await pageObject.verifyPhoneNumber();
    });

    test('should display appointment button', async () => {
        await pageObject.verifyAppointmentButton();
    });

    test('should display FAQ section', async () => {
        await pageObject.verifyFAQSection();
    });

    test('should display contact form with all required fields', async () => {
        await pageObject.verifyContactForm();
    });

    test('should display correct address information', async () => {
        await pageObject.verifyAddressSection();
    });
}); 