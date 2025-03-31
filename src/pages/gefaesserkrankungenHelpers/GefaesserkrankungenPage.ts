import { Page } from '@playwright/test';

export class GefaesserkrankungenPage {
    constructor(public page: Page) {}

    async goto(): Promise<boolean> {
        try {
            await this.page.goto('https://dolomed.ch/gefaesserkrankungen/');
            return true;
        } catch (error) {
            console.error('Failed to navigate to Gefässerkrankungen page:', error);
            return false;
        }
    }

    // Hero Section
    async isHeroSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="627bb9d8"]').isVisible();
    }

    async getHeroTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="628e155f"] h1').textContent() || '';
    }

    // Section Visibility
    async isSectionVisible(sectionId: string): Promise<boolean> {
        const sectionMap: { [key: string]: string } = {
            'what-is': '34a881ab',
            'pavk': '4cf00cb0',
            'angina': '71281d6c'
        };
        return await this.page.locator(`.elementor-element[data-id="${sectionMap[sectionId]}"]`).isVisible();
    }

    async getSectionTitle(sectionId: string): Promise<string> {
        const sectionMap: { [key: string]: string } = {
            'what-is': '35f3191e',
            'pavk': '31d6cd4e',
            'angina': '540784f0'
        };
        return await this.page.locator(`.elementor-element[data-id="${sectionMap[sectionId]}"] h2`).textContent() || '';
    }

    async getSectionText(sectionId: string): Promise<string> {
        const sectionMap: { [key: string]: string } = {
            'what-is': '3baa1c76',
            'pavk': '544f78b9',
            'angina': '315e1163'
        };
        return await this.page.locator(`.elementor-element[data-id="${sectionMap[sectionId]}"] p`).textContent() || '';
    }

    // Treatment Options
    async areTreatmentsVisible(sectionId: string): Promise<boolean> {
        const treatmentMap: { [key: string]: string } = {
            'pavk': '1602add1',
            'angina': '1ccd46ff'
        };
        return await this.page.locator(`.elementor-element[data-id="${treatmentMap[sectionId]}"]`).isVisible();
    }

    // FAQ Section
    async isFAQSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="2c0e8b58"]').isVisible();
    }

    async getFAQCount(): Promise<number> {
        return await this.page.locator('.elementor-accordion-item').count();
    }

    async isFAQContentVisible(index: number): Promise<boolean> {
        return await this.page.locator(`#elementor-tab-content-${7741 + index}`).isVisible();
    }

    async clickFAQItem(index: number): Promise<void> {
        await this.page.locator(`#elementor-tab-title-${7741 + index}`).click();
        await this.page.waitForTimeout(300); // Wait for animation
    }

    // Contact Form
    async isContactFormVisible(): Promise<boolean> {
        return await this.page.locator('#wpcf7-f15505-p15743-o1').isVisible();
    }

    async fillContactForm(
        name: string,
        vorname: string,
        phone: string,
        email: string,
        street: string,
        city: string,
        message: string
    ): Promise<void> {
        const formSelector = '#wpcf7-f15505-p15743-o1';
        await this.page.locator(`${formSelector} input[name="Name"]`).fill(name);
        await this.page.locator(`${formSelector} input[name="Vorname"]`).fill(vorname);
        await this.page.locator(`${formSelector} input[name="tel-873"]`).fill(phone);
        await this.page.locator(`${formSelector} input[name="email-848"]`).fill(email);
        await this.page.locator(`${formSelector} input[name="Strasse"]`).fill(street);
        await this.page.locator(`${formSelector} input[name="Wohnort"]`).fill(city);
        await this.page.locator(`${formSelector} textarea[name="your-message"]`).fill(message);
    }
} 