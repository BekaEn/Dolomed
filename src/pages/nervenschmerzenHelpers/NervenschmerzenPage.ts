import { Page } from '@playwright/test';

export class NervenschmerzenPage {
    constructor(public page: Page) {}

    async goto(): Promise<boolean> {
        try {
            await this.page.goto('https://dolomed.ch/behandlung-von-nervenschmerzen/');
            return true;
        } catch (error) {
            console.error('Failed to navigate to Nervenschmerzen page:', error);
            return false;
        }
    }

    // Hero Section
    async isHeroSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="d906bc5"]').isVisible();
    }

    async getHeroTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="e1a8403"] h1').textContent() || '';
    }

    // Section Visibility
    async isSectionVisible(sectionId: string): Promise<boolean> {
        const sectionMap: { [key: string]: string } = {
            'depression': '29bfcc4a',
            'nervenschmerzen': '43157c0d',
            'postoperativer': '4620b221',
            'crps': '5e3eabf7',
            'polyneuropathie': '79be273a',
            'post-zoster': '18331e5d'
        };
        return await this.page.locator(`.elementor-element[data-id="${sectionMap[sectionId]}"]`).isVisible();
    }

    async getSectionTitle(sectionId: string): Promise<string> {
        const sectionMap: { [key: string]: string } = {
            'depression': '1d8432aa',
            'nervenschmerzen': '7f2817f7',
            'postoperativer': '6b5facd',
            'crps': '51a6c5d1',
            'polyneuropathie': '7900e0e4',
            'post-zoster': '4c2144d7'
        };
        return await this.page.locator(`.elementor-element[data-id="${sectionMap[sectionId]}"] h2`).textContent() || '';
    }

    async getSectionText(sectionId: string): Promise<string> {
        const sectionMap: { [key: string]: string } = {
            'depression': '46c8be33',
            'nervenschmerzen': '42ff624f',
            'postoperativer': '6f09f5d4',
            'crps': '192ddc2f',
            'polyneuropathie': '6ec3db84',
            'post-zoster': '2cd05f6b'
        };
        return await this.page.locator(`.elementor-element[data-id="${sectionMap[sectionId]}"] p`).textContent() || '';
    }

    // Treatment Options
    async areTreatmentsVisible(sectionId: string): Promise<boolean> {
        const treatmentMap: { [key: string]: string } = {
            'depression': '11cc5d66',
            'nervenschmerzen': '1c25515c',
            'postoperativer': '4a397336',
            'crps': '2b2fdd8d',
            'polyneuropathie': '3720024f',
            'post-zoster': 'b97111c'
        };
        return await this.page.locator(`.elementor-element[data-id="${treatmentMap[sectionId]}"]`).isVisible();
    }

    // FAQ Section
    async isFAQSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="74de61e3"]').isVisible();
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
        return await this.page.locator('#wpcf7-f15505-p15746-o1').isVisible();
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
        const formSelector = '#wpcf7-f15505-p15746-o1';
        await this.page.locator(`${formSelector} input[name="Name"]`).fill(name);
        await this.page.locator(`${formSelector} input[name="Vorname"]`).fill(vorname);
        await this.page.locator(`${formSelector} input[name="tel-873"]`).fill(phone);
        await this.page.locator(`${formSelector} input[name="email-848"]`).fill(email);
        await this.page.locator(`${formSelector} input[name="Strasse"]`).fill(street);
        await this.page.locator(`${formSelector} input[name="Wohnort"]`).fill(city);
        await this.page.locator(`${formSelector} textarea[name="your-message"]`).fill(message);
    }
} 