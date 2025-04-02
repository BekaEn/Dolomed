import { test, expect } from '@playwright/test';
import { RueckenschmerzenPage } from '../../pages/RueckenschmerzenHelpers/RueckenschmerzenPage';

test.describe('Rückenschmerzen Page Tests', () => {
    let rueckenschmerzenPage: RueckenschmerzenPage;

    test.beforeEach(async ({ page }) => {
        rueckenschmerzenPage = new RueckenschmerzenPage(page);
        const success = await rueckenschmerzenPage.goto();
        expect(success).toBeTruthy();
    });

    test('should display hero section correctly', async () => {
        const isHeroVisible = await rueckenschmerzenPage.isHeroSectionVisible();
        expect(isHeroVisible).toBeTruthy();

        const heroTitle = await rueckenschmerzenPage.getHeroTitle();
        expect(heroTitle).toBeTruthy();

        const heroSubtitle = await rueckenschmerzenPage.getHeroSubtitle();
        expect(heroSubtitle).toBeTruthy();
    });

    test('should display what is section correctly', async () => {
        const isWhatIsVisible = await rueckenschmerzenPage.isWhatIsSectionVisible();
        expect(isWhatIsVisible).toBeTruthy();

        const whatIsTitle = await rueckenschmerzenPage.getWhatIsTitle();
        expect(whatIsTitle).toBeTruthy();
    });

    test('should display diagnosis section correctly', async () => {
        const isDiagnosisVisible = await rueckenschmerzenPage.isDiagnosisSectionVisible();
        expect(isDiagnosisVisible).toBeTruthy();

        const diagnosisTitle = await rueckenschmerzenPage.getDiagnosisTitle();
        expect(diagnosisTitle).toBeTruthy();
    });

    test('should display therapy options section correctly', async () => {
        const isTherapyOptionsVisible = await rueckenschmerzenPage.isTherapyOptionsSectionVisible();
        expect(isTherapyOptionsVisible).toBeTruthy();

        const therapyOptionsTitle = await rueckenschmerzenPage.getTherapyOptionsTitle();
        expect(therapyOptionsTitle).toBeTruthy();
    });

    test('should display therapy process section correctly', async () => {
        const isTherapyProcessVisible = await rueckenschmerzenPage.isTherapyProcessSectionVisible();
        expect(isTherapyProcessVisible).toBeTruthy();

        const therapyProcessTitle = await rueckenschmerzenPage.getTherapyProcessTitle();
        expect(therapyProcessTitle).toBeTruthy();
    });

    test('should display benefits section correctly', async () => {
        const isBenefitsVisible = await rueckenschmerzenPage.isBenefitsSectionVisible();
        expect(isBenefitsVisible).toBeTruthy();

        const benefitsTitle = await rueckenschmerzenPage.getBenefitsTitle();
        expect(benefitsTitle).toBeTruthy();
    });

    test('should display wie weiter section correctly', async () => {
        const isWieWeiterVisible = await rueckenschmerzenPage.isWieWeiterSectionVisible();
        expect(isWieWeiterVisible).toBeTruthy();
    });

    test('should handle FAQ section interactions', async () => {
        const isFAQVisible = await rueckenschmerzenPage.isFAQSectionVisible();
        expect(isFAQVisible).toBeTruthy();

        const faqCount = await rueckenschmerzenPage.getFAQCount();
        expect(faqCount).toBeGreaterThan(0);
    });

    test('should handle contact form interactions', async () => {
        const isContactFormVisible = await rueckenschmerzenPage.isContactFormVisible();
        expect(isContactFormVisible).toBeTruthy();

        await rueckenschmerzenPage.fillContactForm(
            'Test Name',
            'Test Vorname',
            '1234567890',
            'test@example.com',
            'Test Street 1',
            'Test City',
            ['Reguläres Aufgebot'],
            'Test message'
        );
    });
}); 