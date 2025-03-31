import { Page } from '@playwright/test';

export class ChronischenSchmerzenPage {
    private page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // Navigation
    async navigate(lang: 'de' | 'fr' = 'de') {
        const url = lang === 'de' ? '/chronischen-schmerzen/' : `/${lang}/chronischen-schmerzen/`;
        await this.page.goto(url);
        // Wait for the page to be fully loaded
        await this.page.waitForLoadState('networkidle');
    }

    // Hero Section
    async getHeroTitle() {
        const selector = '.elementor-element[data-id="21d876af"] h1';
        await this.page.waitForSelector(selector, { state: 'visible' });
        return this.page.locator(selector).textContent();
    }

    async getHeroDescription() {
        const selector = '.elementor-element[data-id="47270710"] p';
        await this.page.waitForSelector(selector, { state: 'visible' });
        return this.page.locator(selector).textContent();
    }

    // Main Sections
    async sectionExists(sectionId: string): Promise<boolean> {
        const count = await this.page.locator(`.elementor-element[data-id="${sectionId}"]`).count();
        return count > 0;
    }

    async hasHeading(sectionId: string): Promise<boolean> {
        const count = await this.page.locator(`.elementor-element[data-id="${sectionId}"] h1, .elementor-element[data-id="${sectionId}"] h2`).count();
        return count > 0;
    }

    async getSectionTitle(sectionId: string) {
        // First try h1, then h2
        const selectors = [
            `.elementor-element[data-id="${sectionId}"] h1`,
            `.elementor-element[data-id="${sectionId}"] h2`
        ];
        
        for (const selector of selectors) {
            const element = this.page.locator(selector);
            if (await element.count() > 0) {
                await this.page.waitForSelector(selector, { state: 'visible' });
                return element.textContent();
            }
        }
        return null;
    }

    async getSectionContent(sectionId: string) {
        // Try different content selectors in order of preference
        const contentSelectors = [
            `.elementor-element[data-id="${sectionId}"] .elementor-text-editor p`,
            `.elementor-element[data-id="${sectionId}"] .elementor-text-editor`,
            `.elementor-element[data-id="${sectionId}"] p`,
            `.elementor-element[data-id="${sectionId}"] .elementor-widget-text-editor`
        ];

        for (const selector of contentSelectors) {
            const element = this.page.locator(selector);
            if (await element.count() > 0) {
                await this.page.waitForSelector(selector, { state: 'visible' });
                return element.textContent();
            }
        }

        // If no content found, check if the section has any text content at all
        const sectionElement = this.page.locator(`.elementor-element[data-id="${sectionId}"]`);
        if (await sectionElement.count() > 0) {
            return sectionElement.textContent();
        }

        return null;
    }

    // FAQ Section
    async getFAQTitle() {
        const selector = '.elementor-element[data-id="58a9736f"] h2';
        await this.page.waitForSelector(selector, { state: 'visible' });
        return this.page.locator(selector).textContent();
    }

    async getFAQItems() {
        const selector = '.elementor-accordion-item';
        await this.page.waitForSelector(selector, { state: 'visible' });
        return this.page.locator(selector).count();
    }

    async expandFAQItem(index: number) {
        const selector = `.elementor-accordion-item:nth-child(${index + 1})`;
        await this.page.waitForSelector(selector, { state: 'visible' });
        await this.page.locator(selector).click();
        // Wait for animation to complete
        await this.page.waitForTimeout(300);
    }

    async getFAQAnswer(index: number) {
        const selector = `.elementor-accordion-item:nth-child(${index + 1}) .elementor-tab-content`;
        await this.page.waitForSelector(selector, { state: 'visible' });
        return this.page.locator(selector).textContent();
    }

    // Contact Form
    async getContactFormTitle() {
        const selector = '.elementor-element[data-id="26681224"] h2';
        await this.page.waitForSelector(selector, { state: 'visible' });
        return this.page.locator(selector).textContent();
    }

    async fillContactForm(data: {
        name: string;
        firstName: string;
        phone: string;
        email: string;
        street: string;
        city: string;
        clinicalNotes: string[];
        doctorInfo: string;
    }) {
        // Scroll to contact form section
        const formSection = '.elementor-element[data-id="af85e00"]';
        await this.page.locator(formSection).scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(500); // Allow time for any lazy loading

        // Wait for form to be visible using the specific form ID
        const formSelector = '#wpcf7-f15505-p16039-o1';
        await this.page.waitForSelector(formSelector, { state: 'visible' });

        // Fill form fields using more specific selectors
        await this.page.locator(`${formSelector} input[name="Name"]`).first().fill(data.name);
        await this.page.locator(`${formSelector} input[name="Vorname"]`).first().fill(data.firstName);
        await this.page.locator(`${formSelector} input[name="tel-873"]`).first().fill(data.phone);
        await this.page.locator(`${formSelector} input[name="email-848"]`).first().fill(data.email);
        await this.page.locator(`${formSelector} input[name="Strasse"]`).first().fill(data.street);
        await this.page.locator(`${formSelector} input[name="Wohnort"]`).first().fill(data.city);
        
        // Handle checkboxes with proper waiting
        for (const note of data.clinicalNotes) {
            const checkboxSelector = `${formSelector} input[name="KlinischeAngaben[]"][value="${note}"]`;
            await this.page.waitForSelector(checkboxSelector, { state: 'visible' });
            await this.page.locator(checkboxSelector).check();
            await this.page.waitForTimeout(100); // Small delay between checkboxes
        }
        
        await this.page.locator(`${formSelector} textarea[name="your-message"]`).first().fill(data.doctorInfo);
    }

    async submitContactForm() {
        // Use the specific form ID for the submit button
        const formSelector = '#wpcf7-f15505-p16039-o1';
        const submitSelector = `${formSelector} input[type="submit"]`;
        await this.page.waitForSelector(submitSelector, { state: 'visible' });
        await this.page.locator(submitSelector).click();
    }

    // Contact Information
    async getContactInfo() {
        // Scroll to contact info section
        const contactSection = '.elementor-element[data-id="584ddfe6"]';
        await this.page.locator(contactSection).scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);

        return {
            biel: {
                address: await this.page.locator('.elementor-element[data-id="7a6276a7"] .elementor-icon-list-text').textContent(),
                phone: await this.page.locator('.elementor-element[data-id="2cb0e129"] .elementor-icon-list-text').textContent(),
                email: await this.page.locator('.elementor-element[data-id="38268cbb"] .elementor-icon-list-text').textContent()
            },
            bern: {
                address: await this.page.locator('.elementor-element[data-id="2aeb9091"] .elementor-icon-list-text').textContent(),
                phone: await this.page.locator('.elementor-element[data-id="53e9220b"] .elementor-icon-list-text').textContent(),
                email: await this.page.locator('.elementor-element[data-id="20a71002"] .elementor-icon-list-text').textContent()
            }
        };
    }
} 