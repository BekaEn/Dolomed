import { Page } from '@playwright/test';

export class KopfschmerzenPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(): Promise<boolean> {
        await this.page.goto('https://dolomed.ch/kopfschmerzen-und-gesichtsschmerzen/');
        return true;
    }

    // Hero Section
    async isHeroSectionVisible(): Promise<boolean> {
        const heroSection = this.page.locator('.elementor-element[data-id="10b1b47e"]');
        return await heroSection.isVisible();
    }

    async getHeroTitle(): Promise<string | null> {
        const title = this.page.locator('.elementor-element[data-id="7a00afce"] h1');
        return await title.textContent();
    }

    // Section Visibility Methods
    async isSectionVisible(section: 'migraine' | 'tension' | 'cluster' | 'postpuncture' | 'facial' | 'trigeminal'): Promise<boolean> {
        const sectionIds = {
            migraine: '638345f0',
            tension: '519cad9b',
            cluster: '59e99375',
            postpuncture: '299211e0',
            facial: '53182e8d',
            trigeminal: '90f3885'
        };
        const section_id = sectionIds[section];
        return await this.page.locator(`.elementor-element[data-id="${section_id}"]`).isVisible();
    }

    async getSectionTitle(section: 'migraine' | 'tension' | 'cluster' | 'postpuncture' | 'facial' | 'trigeminal'): Promise<string | null> {
        const titleIds = {
            migraine: '2ac3f89d',
            tension: '614494ee',
            cluster: '5baa794d',
            postpuncture: '58a146d6',
            facial: '3ec9476',
            trigeminal: '2547223'
        };
        const title_id = titleIds[section];
        return await this.page.locator(`.elementor-element[data-id="${title_id}"] h2`).textContent();
    }

    async getSectionText(section: 'migraine' | 'tension' | 'cluster' | 'postpuncture' | 'facial' | 'trigeminal'): Promise<string | null> {
        const textIds = {
            migraine: '15053d3a',
            tension: '3ca5e1da',
            cluster: '6ddc1047',
            postpuncture: '531f3b02',
            facial: '6146de79',
            trigeminal: 'cc259a0'
        };
        const text_id = textIds[section];
        return await this.page.locator(`.elementor-element[data-id="${text_id}"] p`).textContent();
    }

    async areTreatmentsVisible(section: 'migraine' | 'tension' | 'cluster' | 'postpuncture' | 'facial' | 'trigeminal'): Promise<boolean> {
        const treatmentIds = {
            migraine: 'a1fb04e',
            tension: '1757f0c3',
            cluster: '76607c8a',
            postpuncture: '7ca3fe7',
            facial: '41657f9b',
            trigeminal: '37552c4'
        };
        const treatment_id = treatmentIds[section];
        return await this.page.locator(`.elementor-element[data-id="${treatment_id}"]`).isVisible();
    }

    // FAQ Section
    async isFAQSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="61dec6a3"]').isVisible();
    }

    async getFAQCount(): Promise<number> {
        const faqItems = this.page.locator('.elementor-accordion-item');
        return await faqItems.count();
    }

    async clickFAQItem(index: number): Promise<void> {
        const faqItems = this.page.locator('.elementor-accordion-title');
        await faqItems.nth(index).click();
    }

    async isFAQContentVisible(index: number): Promise<boolean> {
        const faqContent = this.page.locator('.elementor-tab-content').nth(index);
        return await faqContent.isVisible();
    }

    // Contact Form
    async isContactFormVisible(): Promise<boolean> {
        try {
            // Use a more specific selector that targets the main contact form in the page content
            const form = this.page.locator('#page .wpcf7-form[action*="wpcf7-f15505"]');
            return await form.isVisible();
        } catch (error) {
            console.error('Error checking contact form visibility:', error);
            return false;
        }
    }

    async fillContactForm(
        name: string,
        vorname: string,
        telefon: string,
        email: string,
        strasse: string,
        wohnort: string,
        message: string
    ): Promise<void> {
        // Target the main contact form specifically
        const formSelector = '#page .wpcf7-form[action*="wpcf7-f15505"]';
        
        // Fill out form fields within the specific form
        await this.page.locator(`${formSelector} input[name="Name"]`).fill(name);
        await this.page.locator(`${formSelector} input[name="Vorname"]`).fill(vorname);
        await this.page.locator(`${formSelector} input[name="tel-873"]`).fill(telefon);
        await this.page.locator(`${formSelector} input[name="email-848"]`).fill(email);
        await this.page.locator(`${formSelector} input[name="Strasse"]`).fill(strasse);
        await this.page.locator(`${formSelector} input[name="Wohnort"]`).fill(wohnort);
        await this.page.locator(`${formSelector} textarea[name="your-message"]`).fill(message);
    }
} 