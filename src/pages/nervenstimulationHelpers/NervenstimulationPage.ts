import { Page } from '@playwright/test';

export class NervenstimulationPage {
    constructor(public page: Page) {}

    async goto(): Promise<boolean> {
        try {
            await this.page.goto('https://dolomed.ch/nervenstimulation/');
            return true;
        } catch (error) {
            console.error('Failed to navigate to Nervenstimulation page:', error);
            return false;
        }
    }

    // Hero Section
    async isHeroSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="637a0f6a"]').isVisible();
    }

    async getHeroTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="2d25cc7e"] h1').textContent() || '';
    }

    async getHeroSubtitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="68cbe40e"] h2').textContent() || '';
    }

    // Section Visibility
    async isSectionVisible(sectionId: string): Promise<boolean> {
        const sectionMap: { [key: string]: string } = {
            'was-ist': '7472c176',
            'tens': '1dde01a8',
            'periphere': '400f4697',
            'zentrale': 'dd0f4b3'
        };
        return await this.page.locator(`.elementor-element[data-id="${sectionMap[sectionId]}"]`).isVisible();
    }

    async getSectionTitle(sectionId: string): Promise<string> {
        const sectionMap: { [key: string]: string } = {
            'was-ist': '50edf91c',
            'tens': '3cb5aee3',
            'periphere': '229500f',
            'zentrale': '7c6816b0'
        };
        return await this.page.locator(`.elementor-element[data-id="${sectionMap[sectionId]}"] h2`).textContent() || '';
    }

    async getSectionText(sectionId: string): Promise<string> {
        const sectionMap: { [key: string]: string } = {
            'was-ist': '21f5857a',
            'tens': '35420572',
            'periphere': '6e697ca7',
            'zentrale': '45d6cdc9'
        };
        return await this.page.locator(`.elementor-element[data-id="${sectionMap[sectionId]}"] p`).textContent() || '';
    }

    // FAQ Section
    async isFAQSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="5f9c34c7"]').isVisible();
    }

    async getFAQCount(): Promise<number> {
        return await this.page.locator('.elementor-accordion-item').count();
    }

    async isFAQContentVisible(index: number): Promise<boolean> {
        try {
            // Wait for the accordion item to be present
            const accordionItems = await this.page.locator('.elementor-accordion-item').all();
            if (index >= accordionItems.length) return false;
            
            const item = accordionItems[index];
            
            // Wait for the content to be visible after clicking
            await item.click();
            await this.page.waitForTimeout(500);
            
            // Check if the content is visible
            const content = await item.locator('.elementor-tab-content').first();
            return await content.isVisible();
        } catch (error) {
            console.error('Error checking FAQ content visibility:', error);
            return false;
        }
    }

    async clickFAQItem(index: number): Promise<void> {
        try {
            const accordionItems = await this.page.locator('.elementor-accordion-item').all();
            if (index >= accordionItems.length) return;
            
            const item = accordionItems[index];
            await item.click();
            await this.page.waitForTimeout(500);
        } catch (error) {
            console.error('Error clicking FAQ item:', error);
        }
    }

    // Contact Form
    async isContactFormVisible(): Promise<boolean> {
        return await this.page.locator('#wpcf7-f15505-p15791-o1').isVisible();
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
        const formSelector = '#wpcf7-f15505-p15791-o1';
        await this.page.locator(`${formSelector} input[name="Name"]`).fill(name);
        await this.page.locator(`${formSelector} input[name="Vorname"]`).fill(vorname);
        await this.page.locator(`${formSelector} input[name="tel-873"]`).fill(phone);
        await this.page.locator(`${formSelector} input[name="email-848"]`).fill(email);
        await this.page.locator(`${formSelector} input[name="Strasse"]`).fill(street);
        await this.page.locator(`${formSelector} input[name="Wohnort"]`).fill(city);
        await this.page.locator(`${formSelector} textarea[name="your-message"]`).fill(message);
    }
} 