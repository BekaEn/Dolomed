import { Page } from '@playwright/test';

export class ChronischeSchmerzenPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(): Promise<boolean> {
        try {
            await this.page.goto('https://dolomed.ch/behandlung-von-chronischen/');
            return true;
        } catch (error) {
            console.error('Failed to navigate to Chronische Schmerzen page:', error);
            return false;
        }
    }

    // Hero Section
    async isHeroSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="701a914"]').isVisible();
    }

    async getHeroTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="1f97e82c"] h1').textContent() || '';
    }

    // Stimulation Types Section
    async isStimulationTypesSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="493d7dd2"]').isVisible();
    }

    async getStimulationTypesTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="2975fbc3"] h2').textContent() || '';
    }

    // Therapy Process Section
    async isTherapyProcessSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="fce865a"]').isVisible();
    }

    async getTherapyProcessTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="1839ab9a"] h2').textContent() || '';
    }

    // Benefits Section
    async isBenefitsSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="22f9f5cf"]').isVisible();
    }

    async getBenefitsTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="1dff7ef9"] h2').textContent() || '';
    }

    // Indications Section
    async isIndicationsSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="2a8af965"]').isVisible();
    }

    async getIndicationsTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="60b5dd2d"] h2').textContent() || '';
    }

    // Wie Weiter Section
    async isWieWeiterSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="7baf22c0"]').isVisible();
    }

    // FAQ Section
    async isFAQSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="50df2394"]').isVisible();
    }

    async getFAQCount(): Promise<number> {
        return await this.page.locator('.elementor-accordion-item').count();
    }

    async isFAQContentVisible(index: number): Promise<boolean> {
        try {
            // Wait for the accordion item to be visible
            const accordionItem = await this.page.locator('.elementor-accordion-item').nth(index);
            await accordionItem.waitFor({ state: 'visible', timeout: 5000 });
            
            // Check if the content is visible by checking the hidden attribute
            const content = await accordionItem.locator('.elementor-tab-content');
            const isHidden = await content.evaluate(el => el.hasAttribute('hidden'));
            return !isHidden;
        } catch (error) {
            console.error(`Failed to check FAQ content visibility for index ${index}:`, error);
            return false;
        }
    }

    async clickFAQItem(index: number): Promise<void> {
        try {
            // Get the accordion item
            const accordionItem = await this.page.locator('.elementor-accordion-item').nth(index);
            
            // Click the tab title
            await accordionItem.locator('.elementor-accordion-title').click();
            
            // Wait for the content to become visible by checking the hidden attribute
            const content = await accordionItem.locator('.elementor-tab-content');
            await this.page.waitForFunction(
                (contentSelector) => {
                    const element = document.querySelector(contentSelector) as HTMLElement;
                    return element && !element.hasAttribute('hidden');
                },
                `.elementor-accordion-item:nth-child(${index + 1}) .elementor-tab-content`,
                { timeout: 5000 }
            );
            
            // Additional wait to ensure animation is complete
            await this.page.waitForTimeout(500);
        } catch (error) {
            console.error(`Failed to click FAQ item ${index}:`, error);
            throw error;
        }
    }

    // Contact Form
    async isContactFormVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-section[data-id="15065b88"] .wpcf7').isVisible();
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
        // Use more specific selectors to target the correct form
        await this.page.locator('.elementor-section[data-id="15065b88"] input[name="Name"]').first().fill(name);
        await this.page.locator('.elementor-section[data-id="15065b88"] input[name="Vorname"]').first().fill(vorname);
        await this.page.locator('.elementor-section[data-id="15065b88"] input[name="tel-873"]').first().fill(telefon);
        await this.page.locator('.elementor-section[data-id="15065b88"] input[name="email-848"]').first().fill(email);
        await this.page.locator('.elementor-section[data-id="15065b88"] input[name="Strasse"]').first().fill(strasse);
        await this.page.locator('.elementor-section[data-id="15065b88"] input[name="Wohnort"]').first().fill(wohnort);
        await this.page.locator('.elementor-section[data-id="15065b88"] textarea[name="your-message"]').first().fill(message);
    }
} 