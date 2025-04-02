import { test, expect } from '@playwright/test';
import { StammzellentherapiePage } from '../../pages/Stammzellentherapie/StammzellentherapiePage';

test.describe('Dolomed Stammzellentherapie Page Tests', () => {
    let stammzellentherapiePage: StammzellentherapiePage;

    test.beforeEach(async ({ page }) => {
        stammzellentherapiePage = new StammzellentherapiePage(page);
        // Navigate to the Stammzellentherapie page
        await stammzellentherapiePage.navigate();
        await stammzellentherapiePage.waitForPageLoad();
    });

    // Test navigation to the Stammzellentherapie page
    test('should navigate to the Stammzellentherapie page successfully', async () => {
        expect(await stammzellentherapiePage.page.title()).toContain('Dolomed');
    });

    // Test Hero Section
    test('should display hero section correctly', async () => {
        // Verify hero title content
        const heroTitle = await stammzellentherapiePage.getHeroTitle();
        expect(heroTitle).toContain('Stammzellentherapie');
        
        // Verify hero subtitle content
        const heroSubtitle = await stammzellentherapiePage.getHeroSubtitle();
        expect(heroSubtitle).toContain('Moderne Heilungsmethoden mit Stammzellentherapie: Effektive Behandlungsmöglichkeiten bei Dolomed');
        
        // Verify hero description content
        const heroDescription = await stammzellentherapiePage.getHeroDescription();
        expect(heroDescription).toContain('Stammzellentherapie');
        
        // Verify buttons are present
        const appointmentButton = stammzellentherapiePage.page.locator(stammzellentherapiePage.appointmentButton);
        await expect(appointmentButton).toBeVisible();
        await expect(appointmentButton).toHaveText('Termin vereinbaren');
        
        const callButton = stammzellentherapiePage.page.locator(stammzellentherapiePage.callButton);
        await expect(callButton).toBeVisible();
        await expect(callButton).toHaveText('Jetzt anrufen');
    });

    // Test FAQ Section
    test('should display FAQ section with working accordion', async () => {
        // Scroll to FAQ section
        await stammzellentherapiePage.page.locator(stammzellentherapiePage.faqSection).scrollIntoViewIfNeeded();
        
        // Get FAQ count
        const faqCount = await stammzellentherapiePage.getFAQCount();
        expect(faqCount).toBeGreaterThan(0);
        
        // Test clicking on first accordion item
        await stammzellentherapiePage.expandFAQItem(0);
        await stammzellentherapiePage.page.waitForTimeout(300); // Wait for animation
        
        // Test clicking on second accordion item
        await stammzellentherapiePage.expandFAQItem(1);
        await stammzellentherapiePage.page.waitForTimeout(300);
    });

    // Test Contact Form
    test('should allow filling the contact form', async () => {
        // Scroll to contact form section
        await stammzellentherapiePage.page.locator(stammzellentherapiePage.contactForm).scrollIntoViewIfNeeded();
        
        // Wait for the form to be visible and ready
        await stammzellentherapiePage.page.waitForSelector(stammzellentherapiePage.contactForm);
        await stammzellentherapiePage.page.waitForTimeout(500);
        
        // Fill out the contact form
        await stammzellentherapiePage.fillContactForm({
            name: 'Test Name',
            vorname: 'Test Vorname',
            phone: '123456789',
            email: 'test@example.com',
            street: 'Test Strasse',
            city: 'Test Wohnort'
        });
        
        // Verify form fields are filled correctly
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.contactFormName)).toHaveValue('Test Name');
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.contactFormVorname)).toHaveValue('Test Vorname');
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.contactFormPhone)).toHaveValue('123456789');
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.contactFormEmail)).toHaveValue('test@example.com');
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.contactFormStreet)).toHaveValue('Test Strasse');
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.contactFormCity)).toHaveValue('Test Wohnort');
    });

    // Test call buttons
    test('should have working call buttons', async () => {
        // Verify the href attribute of the call button
        const callButton = stammzellentherapiePage.page.locator(stammzellentherapiePage.callButton);
        const href = await callButton.getAttribute('href');
        expect(href).toBe('tel:032 324 39 90');
    });

    // Test scroll functionality and interaction
    test('should properly render elements when scrolling through the page', async () => {
        // Test initial viewport - Hero section should be visible
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.heroTitle)).toBeVisible();
        
        // Scroll to FAQ section
        await stammzellentherapiePage.page.locator(stammzellentherapiePage.faqSection).scrollIntoViewIfNeeded();
        await stammzellentherapiePage.page.waitForTimeout(300);
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.faqSection)).toBeVisible();
        
        // Interact with FAQ accordion
        await stammzellentherapiePage.expandFAQItem(2);
        await stammzellentherapiePage.page.waitForTimeout(300);
        
        // Scroll to Contact Form section
        await stammzellentherapiePage.page.locator(stammzellentherapiePage.contactForm).scrollIntoViewIfNeeded();
        await stammzellentherapiePage.page.waitForTimeout(300);
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.contactForm)).toBeVisible();
        
        // Interact with contact form
        await stammzellentherapiePage.page.locator(stammzellentherapiePage.contactFormName).fill('Scroll Test');
        await expect(stammzellentherapiePage.page.locator(stammzellentherapiePage.contactFormName)).toHaveValue('Scroll Test');
    });

    // Test language switching
    test('should support both German and French languages', async () => {
        // Test German version
        await stammzellentherapiePage.navigate('de');
        await stammzellentherapiePage.waitForPageLoad();
        const germanTitle = await stammzellentherapiePage.getHeroTitle();
        expect(germanTitle).toContain('Stammzellentherapie');
        
        // Test French version
        await stammzellentherapiePage.navigate('fr');
        await stammzellentherapiePage.waitForPageLoad();
        const frenchTitle = await stammzellentherapiePage.getHeroTitle();
        expect(frenchTitle).toContain('Thérapie par cellules souches');
    });
}); 