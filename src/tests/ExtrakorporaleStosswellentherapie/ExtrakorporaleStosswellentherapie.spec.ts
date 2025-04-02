import { test, expect } from '@playwright/test';
import { ExtrakorporaleStosswellentherapiePage } from '../../pages/ExtrakorporaleStosswellentherapieHelpers/ExtrakorporaleStosswellentherapiePage';

test.describe('Extrakorporale Stoßwellentherapie Page Tests', () => {
    let page: ExtrakorporaleStosswellentherapiePage;

    test.beforeEach(async ({ page: testPage }) => {
        page = new ExtrakorporaleStosswellentherapiePage(testPage);
        await page.navigateToPage();
    });

    test('should display all sections correctly', async () => {
        await page.verifyAllSections();
    });

    test('should display hero section content correctly', async () => {
        const title = await page.getHeroTitle();
        expect(title).toContain('Effektive Behandlung muskuloskelettaler Beschwerden');

        const description = await page.getHeroDescription();
        expect(description).toContain('Die extrakorporale Stoßwellentherapie (ESWT)');
    });

    test('should open appointment modal when clicking appointment button', async () => {
        await page.clickAppointmentButton();
        // The modal should be visible after clicking
        await expect(page['page'].locator('.modal')).toBeVisible();
    });

    test('should have correct phone number link', async () => {
        const phoneLink = await page['page'].locator('.elementor-element[data-id="34bbbd4"] a').getAttribute('href');
        expect(phoneLink).toBe('tel:032 324 39 90');
    });

    test('should display content in all sections', async () => {
        const whatIsContent = await page.getSectionContent(page['whatIsContent']);
        expect(whatIsContent).toContain('Die Stoßwellentherapie verwendet hochenergetische Schallwellen');

        const applicationsContent = await page.getSectionContent(page['applicationsContent']);
        expect(applicationsContent).toContain('Die Stoßwellentherapie wird erfolgreich bei verschiedenen muskuloskelettalen Beschwerden eingesetzt');

        const theoreticalContent = await page.getSectionContent(page['theoreticalContent']);
        expect(theoreticalContent).toContain('Die Stoßwellentherapie basiert auf der Übertragung von mechanischen Schallwellen');

        const processContent = await page.getSectionContent(page['processContent']);
        expect(processContent).toContain('Eine typische Behandlung mit Stoßwellentherapie umfasst die folgenden Schritte');

        const benefitsContent = await page.getSectionContent(page['benefitsContent']);
        expect(benefitsContent).toContain('Die Stoßwellentherapie bietet eine Vielzahl von Vorteilen');
    });

    test('should have working FAQ section', async () => {
        const faqItems = await page.getFAQItems();
        expect(faqItems.length).toBeGreaterThan(0);

        // Test first FAQ item
        await page.toggleFAQItem(0);
        const isExpanded = await page.isFAQItemExpanded(0);
        expect(isExpanded).toBeTruthy();
    });

    test('should have working navigation links', async () => {
        const links = await page.getNavigationLinks();
        expect(links.length).toBeGreaterThan(0);
    });
}); 