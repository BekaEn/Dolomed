import { test, expect } from '@playwright/test';
import { AkupunkturPage } from '../../pages/AkupunkturHelpers/AkupunkturPage';

test.describe('Akupunktur Page Tests', () => {
    let akupunkturPage: AkupunkturPage;

    test.beforeEach(async ({ page }) => {
        akupunkturPage = new AkupunkturPage(page);
        await akupunkturPage.navigate();
    });

    test('should display correct hero section content', async () => {
        const title = await akupunkturPage.getHeroTitle();
        const description = await akupunkturPage.getHeroDescription();

        expect(title).toBeTruthy();
        expect(description).toBeTruthy();
    });

    test('should display all main sections', async () => {
        const sections = [
            { id: '5aeed2ad', name: 'Hero section' },
            { id: 'd185432', name: 'Description section' },
            { id: '600885b5', name: 'FAQ section' },
            { id: '3db79b11', name: 'Contact form section' }
        ];

        for (const section of sections) {
            // First check if the section exists
            const exists = await akupunkturPage.sectionExists(section.id);
            expect(exists).toBe(true);

            // Check for either content or heading
            const content = await akupunkturPage.getSectionContent(section.id);
            const hasHeading = await akupunkturPage.hasHeading(section.id);
            
            // A section should have either content or a heading
            expect(content !== null || hasHeading).toBe(true);
        }
    });

    test('should handle FAQ section interactions', async () => {
        const faqCount = await akupunkturPage.getFAQItems();
        expect(faqCount).toBeGreaterThan(0);

        // Test first FAQ item
        await akupunkturPage.expandFAQItem(0);
        const answer = await akupunkturPage.getFAQAnswer(0);
        expect(answer).toBeTruthy();
    });

    test('should display contact information for both locations', async () => {
        const contactInfo = await akupunkturPage.getContactInfo();

        // Check Biel location
        expect(contactInfo.biel.address).toBeTruthy();
        expect(contactInfo.biel.phone).toBeTruthy();
        expect(contactInfo.biel.email).toBeTruthy();

        // Check Bern location
        expect(contactInfo.bern.address).toBeTruthy();
        expect(contactInfo.bern.phone).toBeTruthy();
        expect(contactInfo.bern.email).toBeTruthy();
    });

    test('should support language switching', async () => {
        await akupunkturPage.navigate('fr');
        const title = await akupunkturPage.getHeroTitle();
        expect(title).toBeTruthy();
    });
}); 