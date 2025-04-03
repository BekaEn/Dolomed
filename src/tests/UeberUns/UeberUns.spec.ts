import { test, expect } from '@playwright/test';
import { UeberUnsPage } from '../../pages/UeberUnsHelpers/UeberUnsPage';

test.describe('Über uns page', () => {
    let page: UeberUnsPage;

    test.beforeEach(async ({ page: playwrightPage }) => {
        page = new UeberUnsPage(playwrightPage);
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

    test('should display mission section', async () => {
        await page.verifyMissionSection();
    });

    test('should display locations', async () => {
        await page.verifyLocations();
    });

    test('should display team section', async () => {
        await page.verifyTeamSection();
    });

    test('should display career section', async () => {
        await page.verifyCareerSection();
    });

    test('should open medicosearch widget when clicking appointment button', async () => {
        await page.clickAppointmentButton();
        await page.verifyMedicosearchWidget();
    });
}); 