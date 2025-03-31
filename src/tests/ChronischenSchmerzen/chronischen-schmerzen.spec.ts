import { test, expect } from '@playwright/test';
import { ChronischenSchmerzenPage } from '../../pages/ChronischenSchmerzenHelpers/ChronischenSchmerzenPage';

test.describe('Chronischen Schmerzen Page Tests', () => {
    let chronischenSchmerzenPage: ChronischenSchmerzenPage;

    test.beforeEach(async ({ page }) => {
        chronischenSchmerzenPage = new ChronischenSchmerzenPage(page);
        await chronischenSchmerzenPage.navigate();
    });

    test('should display hero section correctly', async () => {
        const title = await chronischenSchmerzenPage.getHeroTitle();
        expect(title).toContain('Innovative Schmerztherapie: Ketamin-Infusionen bei chronischen Schmerzen');

        const description = await chronischenSchmerzenPage.getHeroDescription();
        expect(description).toContain('Ketamin ist ein vielseitiges Medikament');
    });

    test('should display main sections', async () => {
        // Check if main sections exist
        const sections = [
            'd955f5f',  // What is Ketamin Therapy section
            'dc9b7fd',  // Ketamin Infusions in Therapy section
            '6388746f', // Therapy Process section
            '306dee88', // Benefits section
            '573960f3'  // Next Steps section
        ];

        for (const sectionId of sections) {
            const exists = await chronischenSchmerzenPage.sectionExists(sectionId);
            expect(exists).toBeTruthy();
        }
    });

    test('should display section titles and content', async () => {
        // Test What is Ketamin Therapy section
        const title = await chronischenSchmerzenPage.getSectionTitle('395fe4e6');
        expect(title).toBe('Was ist eine Ketamintherapie?');

        const content = await chronischenSchmerzenPage.getSectionContent('3b4facdf');
        expect(content).toContain('Ketamin ist ein Medikament');

        // Test Ketamin Infusions section
        const infusionTitle = await chronischenSchmerzenPage.getSectionTitle('62a2da27');
        expect(infusionTitle).toBe('Ketamin-Infusionen in der Therapie');

        const infusionContent = await chronischenSchmerzenPage.getSectionContent('7d4271a2');
        expect(infusionContent).toContain('Ketamin-Infusionen sind eine vielversprechende Therapieoption');
    });

    test('should handle FAQ section', async () => {
        // Check FAQ title
        const faqTitle = await chronischenSchmerzenPage.getFAQTitle();
        expect(faqTitle).toBe('Häufig gestellte Fragen (FAQ)');

        // Check number of FAQ items
        const faqCount = await chronischenSchmerzenPage.getFAQItems();
        expect(faqCount).toBeGreaterThan(0);

        // Test expanding and reading FAQ items
        await chronischenSchmerzenPage.expandFAQItem(0);
        const firstAnswer = await chronischenSchmerzenPage.getFAQAnswer(0);
        expect(firstAnswer).toContain('Ketamin-Infusionen werden zur Behandlung von chronischen Schmerzen');

        // Test another FAQ item
        await chronischenSchmerzenPage.expandFAQItem(1);
        const secondAnswer = await chronischenSchmerzenPage.getFAQAnswer(1);
        expect(secondAnswer).toContain('Die Häufigkeit der Ketamin-Infusionen hängt vom individuellen Behandlungsplan ab');
    });

    test('should handle contact form', async () => {
        // Check contact form title
        const formTitle = await chronischenSchmerzenPage.getContactFormTitle();
        expect(formTitle).toBe('ZUWEISUNG / BON DE DÉLÉGATION');

        // Fill contact form
        const formData = {
            name: 'Test Name',
            firstName: 'Test First Name',
            phone: '1234567890',
            email: 'test@example.com',
            street: 'Test Street',
            city: 'Test City',
            clinicalNotes: ['Reguläres Aufgebot'],
            doctorInfo: 'Test Doctor Info'
        };

        await chronischenSchmerzenPage.fillContactForm(formData);
    });

    test('should display contact information correctly', async () => {
        const contactInfo = await chronischenSchmerzenPage.getContactInfo();

        // Check Biel location
        expect(contactInfo.biel.address).toContain('Bahnhofplatz 2C');
        expect(contactInfo.biel.phone).toContain('+41 32 324 39 90');
        expect(contactInfo.biel.email).toContain('info@dolomed.ch');

        // Check Bern location
        expect(contactInfo.bern.address).toContain('Sidlerstrasse 4');
        expect(contactInfo.bern.phone).toContain('+41 32 324 39 90');
        expect(contactInfo.bern.email).toContain('info@dolomed.ch');
    });
}); 