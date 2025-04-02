import { test, expect } from '@playwright/test';
import { ChronischeSchmerzenPage } from '../../pages/ChronischeSchmerzenHelpers/ChronischeSchmerzenPage';

test.describe('Chronische Schmerzen Page Tests', () => {
    let chronischeSchmerzenPage: ChronischeSchmerzenPage;

    test.beforeEach(async ({ page }) => {
        chronischeSchmerzenPage = new ChronischeSchmerzenPage(page);
        const success = await chronischeSchmerzenPage.goto();
        expect(success).toBeTruthy();
    });

    test('should display hero section correctly', async () => {
        const isHeroVisible = await chronischeSchmerzenPage.isHeroSectionVisible();
        expect(isHeroVisible).toBeTruthy();

        const heroTitle = await chronischeSchmerzenPage.getHeroTitle();
        expect(heroTitle).toBe('Effektive Schmerzlinderung durch Neuromodulation: Innovative Behandlung von chronischen Schmerzen');
    });

    test('should display stimulation types section correctly', async () => {
        const isStimulationTypesVisible = await chronischeSchmerzenPage.isStimulationTypesSectionVisible();
        expect(isStimulationTypesVisible).toBeTruthy();

        const stimulationTypesTitle = await chronischeSchmerzenPage.getStimulationTypesTitle();
        expect(stimulationTypesTitle).toBe('Zentrale Rückenmarksstimulation versus periphere Stimulation von Nerven:');
    });

    test('should display therapy process section correctly', async () => {
        const isTherapyProcessVisible = await chronischeSchmerzenPage.isTherapyProcessSectionVisible();
        expect(isTherapyProcessVisible).toBeTruthy();

        const therapyProcessTitle = await chronischeSchmerzenPage.getTherapyProcessTitle();
        expect(therapyProcessTitle).toBe('Ablauf der Neurostimulationstherapie (Rückenmarkstimulation /periphere Nervenstimulation)');
    });

    test('should display benefits section correctly', async () => {
        const isBenefitsVisible = await chronischeSchmerzenPage.isBenefitsSectionVisible();
        expect(isBenefitsVisible).toBeTruthy();

        const benefitsTitle = await chronischeSchmerzenPage.getBenefitsTitle();
        expect(benefitsTitle).toBe('Vorteile der Neuromodulation');
    });

    test('should display indications section correctly', async () => {
        const isIndicationsVisible = await chronischeSchmerzenPage.isIndicationsSectionVisible();
        expect(isIndicationsVisible).toBeTruthy();

        const indicationsTitle = await chronischeSchmerzenPage.getIndicationsTitle();
        expect(indicationsTitle).toBe('Indikationen für die Implantation eines Neurostimulators zur Stimulation vom Rückenmark oder peripheren Nerven');
    });

    test('should display Wie Weiter section correctly', async () => {
        const isWieWeiterVisible = await chronischeSchmerzenPage.isWieWeiterSectionVisible();
        expect(isWieWeiterVisible).toBeTruthy();
    });

    test('should display FAQ section correctly', async () => {
        const isFAQVisible = await chronischeSchmerzenPage.isFAQSectionVisible();
        expect(isFAQVisible).toBeTruthy();

        const faqCount = await chronischeSchmerzenPage.getFAQCount();
        expect(faqCount).toBeGreaterThan(0);
    });

    test('should display and interact with contact form correctly', async () => {
        const isContactFormVisible = await chronischeSchmerzenPage.isContactFormVisible();
        expect(isContactFormVisible).toBeTruthy();

        // Fill out the contact form
        await chronischeSchmerzenPage.fillContactForm(
            'Test',
            'User',
            '0123456789',
            'test@example.com',
            'Test Street 1',
            'Test City',
            'This is a test message'
        );
    });
}); 