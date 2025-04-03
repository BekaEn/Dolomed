import { Page, expect } from '@playwright/test';

export class BewegungstherapieUndFaszientrainingPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('/bewegungstherapie-und-faszientraining/');
    }

    async verifyPageTitle() {
        const title = await this.page.locator('h1').textContent();
        expect(title).toContain('Ganzheitliche Schmerzbehandlung durch Bewegungstherapie und Faszientraining bei Dolomed');
    }

    async verifyMainContent() {
        const mainContent = await this.page.locator('p.text-18').first().textContent();
        expect(mainContent).toContain('Bewegung ist der Schlüssel zu einem gesunden Körper und Lebensqualität');
    }

    async verifyPhoneNumber() {
        const phoneLink = this.page.locator('a[href="tel:032 324 39 90"]');
        await expect(phoneLink).toBeVisible();
        const phoneText = await phoneLink.textContent();
        expect(phoneText).toContain('Jetzt anrufen');
    }

    async verifyAppointmentButton() {
        const appointmentButton = this.page.locator('a:has-text("Termin vereinbaren")').first();
        await expect(appointmentButton).toBeVisible();
    }

    async verifyFAQSection() {
        const faqTitle = await this.page.locator('h2:has-text("Häufig gestellte Fragen")').textContent();
        expect(faqTitle).toContain('Häufig gestellte Fragen');
    }

    async verifyContactForm() {
        // First, wait for any form to be present
        await this.page.waitForSelector('form', { timeout: 10000 });
        
        // Get all forms and log their HTML for debugging
        const forms = await this.page.locator('form').all();
        console.log('Found forms:', forms.length);
        
        for (let i = 0; i < forms.length; i++) {
            const formHtml = await forms[i].evaluate(el => el.outerHTML);
            console.log(`Form ${i + 1}:`, formHtml);
        }

        // Try to find the form using a more general selector
        const form = this.page.locator('form').first();
        await expect(form).toBeVisible();
        
        // Verify form fields using specific selectors
        const requiredFields = [
            { name: 'Name', selector: 'input[placeholder="Name"]' },
            { name: 'Vorname', selector: 'input[placeholder="Vorname"]' },
            { name: 'Telefonnummer', selector: 'input[type="tel"]' },
            { name: 'E-Mail', selector: 'input[type="email"]' },
            { name: 'Strasse', selector: 'input[placeholder="Strasse"]' },
            { name: 'Wohnort', selector: 'input[placeholder="Wohnort:"]' }
        ];

        for (const field of requiredFields) {
            const fieldLocator = form.locator(field.selector);
            await expect(fieldLocator).toBeVisible({ timeout: 5000 });
        }
    }

    async verifyAddressSection() {
        const addresses = [
            'Standort Biel / Site Bienne',
            'Bahnhofplatz 2C / Place de la Gare 2C 2. Stock / 2ème étage, 2502 Biel-Bienne',
            'Standort Bern / Site de Berne',
            'Sidlerstrasse 4, 3012 Bern-Berne 2. Stock / 2ème étages, 2502 Bern-Berne'
        ];

        for (const address of addresses) {
            const addressElement = this.page.locator(`text="${address}"`);
            await expect(addressElement).toBeVisible();
        }
    }
} 