import { test, expect } from '@playwright/test';
import { PatientenZuweiserPage } from '../../pages/PatientenZuweiserHelpers/PatientenZuweiserPage';

test.describe('Patienten & Zuweiser page', () => {
    let page: PatientenZuweiserPage;

    test.beforeEach(async ({ page: playwrightPage }) => {
        page = new PatientenZuweiserPage(playwrightPage);
        await page.navigate();
    });

    test('should display correct page title', async () => {
        await page.verifyPageTitle();
    });

    test('should display main content', async () => {
        await page.verifyMainContent();
    });

    test('should display appointment and phone buttons', async () => {
        await page.verifyAppointmentButton();
        await page.verifyPhoneButton();
    });

    test('should display info section', async () => {
        await page.verifyInfoSection();
    });

    test('should display referral form section', async () => {
        await page.verifyReferralFormSection();
    });

    test('should display booking section', async () => {
        await page.verifyBookingSection();
    });

    test('should display contact section', async () => {
        await page.verifyContactSection();
    });

    test('should open medicosearch widget when clicking appointment button', async () => {
        await page.clickAppointmentButton();
        await page.verifyMedicosearchWidget();
    });
}); 