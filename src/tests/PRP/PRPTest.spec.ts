import { test, expect } from '@playwright/test';
import { PRPPage } from '../../pages/PRPHelpers/PRPPage';

test.describe('PRP Page Tests', () => {
    let prpPage: PRPPage;

    test.beforeEach(async ({ page }) => {
        prpPage = new PRPPage(page);
        await prpPage.navigate();
    });

    test('should display all main sections', async () => {
        // Hero Section
        await expect(await prpPage.isHeroSectionVisible()).toBeTruthy();
        const heroTitle = await prpPage.getHeroTitle();
        expect(heroTitle).toContain('Förderung der Selbstheilung durch Eigenbluttherapie');
        
        // What is PRP Section
        await expect(await prpPage.isWhatIsPRPSectionVisible()).toBeTruthy();
        const whatIsPRPTitle = await prpPage.getWhatIsPRPTitle();
        expect(whatIsPRPTitle).toBe('Was ist Platelet Rich Plasma (PRP)?');
        
        // Applications Section
        await expect(await prpPage.isApplicationsSectionVisible()).toBeTruthy();
        const applicationsTitle = await prpPage.getApplicationsTitle();
        expect(applicationsTitle).toBe('Einsatzmöglichkeiten der PRP-Behandlung/ Eigenblutbehandlung');
        
        // Process Section
        await expect(await prpPage.isProcessSectionVisible()).toBeTruthy();
        const processTitle = await prpPage.getProcessTitle();
        expect(processTitle).toBe('Ablauf der PRP-Therapie');
        
        // Benefits Section
        await expect(await prpPage.isBenefitsSectionVisible()).toBeTruthy();
        const benefitsTitle = await prpPage.getBenefitsTitle();
        expect(benefitsTitle).toBe('Vorteile der PRP-Therapie');
        
        // Next Steps Section
        await expect(await prpPage.isNextStepsSectionVisible()).toBeTruthy();
        const nextStepsTitle = await prpPage.getNextStepsTitle();
        expect(nextStepsTitle).toBe('Wie weiter?');
        
        // FAQ Section
        await expect(await prpPage.isFAQSectionVisible()).toBeTruthy();
        const faqTitle = await prpPage.getFAQTitle();
        expect(faqTitle).toBe('Häufig gestellte Fragen (FAQ)');
        
        // Contact Section
        await expect(await prpPage.isContactSectionVisible()).toBeTruthy();
        const contactTitle = await prpPage.getContactTitle();
        expect(contactTitle).toBe('ZUWEISUNG / BON DE DÉLÉGATION');
    });

    test('should display correct content in lists', async () => {
        // Applications List
        const applications = await prpPage.getApplicationsListItems();
        expect(applications).toContain('Orthopädie und Traumatologie: Behandlung von Gelenk- und Bänderverletzungen, insbesondere bei Knie-, Schulter- und Sprunggelenksverletzungen.');
        expect(applications).toContain('Arthrose: Linderung der Symptome und Förderung der Regeneration bei Gelenkarthrose.');
        expect(applications).toContain('Sportverletzungen: Beschleunigung der Heilung bei Verletzungen von Muskeln, Sehnen und Bändern.');
        expect(applications).toContain('Dermatologie: Behandlung von Hauterkrankungen wie Neurodermitis und Förderung der Wundheilung.');

        // Process List
        const process = await prpPage.getProcessListItems();
        expect(process).toContain('Blutentnahme: Eine kleine Menge Blut (ca. 15ml) wird aus der Vene des Patienten entnommen.');
        expect(process).toContain('Aufbereitung: Das Blut wird 5 Minuten in einer Zentrifuge aufbereitet, um das Platelet Rich Plasma zu gewinnen');
        expect(process).toContain('Injektion: Das PRP wird in die betroffene Stelle injiziert, um die Heilung zu fördern. Meist wird dies präzise unter Ultraschallkontrolle durchgeführt.');
        expect(process).toContain('Wiederholung: Die Therapie sollte mindestens 3x durchgeführt werden, im Abstand von je einer Woche');
        expect(process).toContain('Nachsorge: Regelmäßige Kontrolltermine zur Überwachung des Heilungsprozesses.');

        // Benefits List
        const benefits = await prpPage.getBenefitsListItems();
        expect(benefits).toContain('Natürliche Heilung:  Nutzung körpereigener Substanzen zur Förderung der Heilung.');
        expect(benefits).toContain('Minimale Nebenwirkungen: Da es sich um körpereigenes Blut handelt, sind Nebenwirkungen selten.');
        expect(benefits).toContain('Vielseitige Anwendung: Effektiv bei einer Vielzahl von Verletzungen und Erkrankungen.');
    });

    test('should handle FAQ interactions', async () => {
        const faqItems = await prpPage.getFAQItems();
        expect(faqItems.length).toBeGreaterThan(0);

        // Test first FAQ item
        await prpPage.toggleFAQItem(0);
        const firstFAQ = faqItems[0];
        expect(firstFAQ.question).toContain('Wird die Eigenbluttherapie von der Krankenkasse bezahlt?');
        expect(firstFAQ.answer).toContain('Die Kostenübernahme durch die gesetzlichen Krankenkassen variiert');
    });

    test('should handle contact form', async () => {
        await expect(await prpPage.isContactFormVisible()).toBeTruthy();

        const formData = {
            name: 'Test Name',
            firstName: 'Test First Name',
            phone: '+41 123 456 789',
            email: 'test@example.com',
            street: 'Test Street 1',
            city: 'Test City',
            clinicalNotes: ['Reguläres Aufgebot'],
            referrer: 'Test Referrer Info'
        };

        await prpPage.fillContactForm(formData);
    });

    test('should handle language switching', async () => {
        await prpPage.navigate('fr');
        const heroTitle = await prpPage.getHeroTitle();
        expect(heroTitle).toContain("Favoriser l'autoguérison par l'autohémothérapie : le plasma  riche en plaquettes (PRP) pour un traitement efficace. (Possible sous sédation)");
    });

    test('should handle button interactions', async () => {
        // Test appointment button
        await prpPage.clickAppointmentButton();
        
        // Test call button - verify href instead of clicking
        const callHref = await prpPage.getCallButtonHref();
        expect(callHref).toBe('tel:032 324 39 90');
        
        // Test next steps button - verify href instead of clicking
        const nextStepsHref = await prpPage.getNextStepsButtonHref();
        expect(nextStepsHref).toBe('#');
    });
}); 