import { test, expect } from '@playwright/test';
import { NervenschmerzenPage } from '../../pages/nervenschmerzenHelpers/NervenschmerzenPage';

test.describe('Nervenschmerzen Page Tests', () => {
    let nervenschmerzenPage: NervenschmerzenPage;

    test.beforeEach(async ({ page }) => {
        nervenschmerzenPage = new NervenschmerzenPage(page);
        const success = await nervenschmerzenPage.goto();
        expect(success).toBeTruthy();
    });

    test('should display hero section correctly', async () => {
        const isHeroVisible = await nervenschmerzenPage.isHeroSectionVisible();
        expect(isHeroVisible).toBeTruthy();

        const heroTitle = await nervenschmerzenPage.getHeroTitle();
        expect(heroTitle).toContain('Behandlung von Nervenschmerzen');
    });

    test('should display all main sections', async () => {
        const sections = ['depression', 'nervenschmerzen', 'postoperativer', 'crps', 'polyneuropathie', 'post-zoster'];
        
        for (const section of sections) {
            const isVisible = await nervenschmerzenPage.isSectionVisible(section);
            expect(isVisible).toBeTruthy();
        }
    });

    test('should display section titles correctly', async () => {
        const sections = ['depression', 'nervenschmerzen', 'postoperativer', 'crps', 'polyneuropathie', 'post-zoster'];
        
        for (const section of sections) {
            const title = await nervenschmerzenPage.getSectionTitle(section);
            expect(title).toBeTruthy();
        }
    });

    test('should display section content correctly', async () => {
        const sections = ['depression', 'nervenschmerzen', 'postoperativer', 'crps', 'polyneuropathie', 'post-zoster'];
        
        for (const section of sections) {
            const text = await nervenschmerzenPage.getSectionText(section);
            expect(text).toBeTruthy();
        }
    });

    test('should display treatment options for each section', async () => {
        const sections = ['depression', 'nervenschmerzen', 'postoperativer', 'crps', 'polyneuropathie', 'post-zoster'];
        
        for (const section of sections) {
            const areTreatmentsVisible = await nervenschmerzenPage.areTreatmentsVisible(section);
            expect(areTreatmentsVisible).toBeTruthy();
        }
    });

    test('should display FAQ section correctly', async () => {
        const isFAQVisible = await nervenschmerzenPage.isFAQSectionVisible();
        expect(isFAQVisible).toBeTruthy();

        const faqCount = await nervenschmerzenPage.getFAQCount();
        expect(faqCount).toBeGreaterThan(0);

        // Test first FAQ item
        await nervenschmerzenPage.clickFAQItem(0);
        const isFirstFAQContentVisible = await nervenschmerzenPage.isFAQContentVisible(0);
        expect(isFirstFAQContentVisible).toBeTruthy();
    });

    test('should display contact form correctly', async () => {
        const isFormVisible = await nervenschmerzenPage.isContactFormVisible();
        expect(isFormVisible).toBeTruthy();

        // Test form filling
        await nervenschmerzenPage.fillContactForm(
            'Test',
            'User',
            '1234567890',
            'test@example.com',
            'Test Street 1',
            'Test City',
            'Test message'
        );
    });
}); 