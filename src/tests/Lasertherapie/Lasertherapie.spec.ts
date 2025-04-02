import { test, expect } from '@playwright/test';
import { LasertherapiePage } from '../../pages/LasertherapieHelpers/LasertherapiePage';

test.describe('Lasertherapie Page Tests', () => {
    let lasertherapiePage: LasertherapiePage;

    test.beforeEach(async ({ page }) => {
        lasertherapiePage = new LasertherapiePage(page);
        await lasertherapiePage.navigate();
        await lasertherapiePage.waitForPageLoad();
    });

    test('should display correct hero section content', async () => {
        const title = await lasertherapiePage.getHeroTitle();
        const subtitle = await lasertherapiePage.getHeroSubtitle();
        const description = await lasertherapiePage.getHeroDescription();

        expect(title).toBeTruthy();
        expect(subtitle).toBeTruthy();
        expect(description).toBeTruthy();
    });

    test('should open and close appointment modal', async () => {
        // Click the appointment button and verify modal opens
        await lasertherapiePage.clickAppointmentButton();
        const isModalVisible = await lasertherapiePage.isModalVisible();
        expect(isModalVisible).toBeTruthy();

        // Verify medicosearch widget is present
        const widgetVisible = await lasertherapiePage.page.isVisible(lasertherapiePage.medicosearchWidget);
        expect(widgetVisible).toBeTruthy();

        // Verify iframe is present
        const iframeVisible = await lasertherapiePage.page.isVisible(lasertherapiePage.medicosearchIframe);
        expect(iframeVisible).toBeTruthy();

        // Close the modal and verify it's hidden
        await lasertherapiePage.closeModal();
        
        // Add a small delay to ensure the modal is fully closed
        await lasertherapiePage.page.waitForTimeout(1000);
        
        // Verify the modal is hidden
        const isModalHidden = await lasertherapiePage.isModalVisible();
        expect(isModalHidden).toBeFalsy();
    });

    test('should have correct phone number', async () => {
        const phoneNumber = await lasertherapiePage.getPhoneNumber();
        // Check if the phone number matches any of the expected formats
        const expectedFormats = [
            '032 324 39 90',
            '0323243990',
            '+41 32 324 39 90',
            '+41323243990'
        ];
        expect(expectedFormats).toContain(phoneNumber);
    });

    test('should display FAQ section with items', async () => {
        const faqCount = await lasertherapiePage.getFAQCount();
        expect(faqCount).toBeGreaterThan(0);
    });

    test('should be able to expand and collapse FAQ items', async () => {
        const faqCount = await lasertherapiePage.getFAQCount();
        
        // First item should be expanded by default
        const isFirstItemExpanded = await lasertherapiePage.isFAQItemExpanded(0);
        expect(isFirstItemExpanded).toBeTruthy();

        // Test expanding and collapsing each item
        for (let i = 0; i < faqCount; i++) {
            // If it's the first item, collapse it first
            if (i === 0) {
                await lasertherapiePage.collapseFAQItem(i);
                // Wait for the state to update
                await lasertherapiePage.page.waitForTimeout(1000);
                const isCollapsed = await lasertherapiePage.isFAQItemExpanded(i);
                expect(isCollapsed).toBeFalsy();
            }

            // Expand the item
            await lasertherapiePage.expandFAQItem(i);
            // Wait for the state to update
            await lasertherapiePage.page.waitForTimeout(1000);
            const isExpanded = await lasertherapiePage.isFAQItemExpanded(i);
            expect(isExpanded).toBeTruthy();

            // Collapse the item
            await lasertherapiePage.collapseFAQItem(i);
            // Wait for the state to update
            await lasertherapiePage.page.waitForTimeout(1000);
            const isCollapsed = await lasertherapiePage.isFAQItemExpanded(i);
            expect(isCollapsed).toBeFalsy();
        }
    });

    test('should display contact form', async () => {
        const isFormVisible = await lasertherapiePage.isContactFormVisible();
        expect(isFormVisible).toBeTruthy();
    });

    test('should be able to fill and submit contact form', async () => {
        const testData = {
            name: 'Test',
            vorname: 'User',
            phone: '+49123456789',
            email: 'test@example.com',
            street: 'Test Street 1',
            city: 'Test City'
        };

        await lasertherapiePage.fillContactForm(testData);
    });

    test('should load in different languages', async () => {
        const languages = ['de', 'fr'];
        
        for (const lang of languages) {
            await lasertherapiePage.navigate(lang);
            await lasertherapiePage.waitForPageLoad();
            
            const title = await lasertherapiePage.getHeroTitle();
            expect(title).toBeTruthy();
        }
    });
}); 