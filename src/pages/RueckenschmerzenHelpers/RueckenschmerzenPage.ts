import { Page } from '@playwright/test';

export class RueckenschmerzenPage {
    page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(): Promise<boolean> {
        try {
            await this.page.goto('https://dolomed.ch/behandlung-von-rueckenschmerzen/');
            return true;
        } catch (error) {
            console.error('Failed to navigate to Rückenschmerzen page:', error);
            return false;
        }
    }

    // Hero Section
    async isHeroSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="3832e0ff"]').isVisible();
    }

    async getHeroTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="16365d16"] h1').textContent() || '';
    }

    async getHeroSubtitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="21ff723e"] h2').textContent() || '';
    }

    // What is Section
    async isWhatIsSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="5ea3f2a4"]').isVisible();
    }

    async getWhatIsTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="678ab28e"] h2').textContent() || '';
    }

    // Diagnosis Section
    async isDiagnosisSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="79b63512"]').isVisible();
    }

    async getDiagnosisTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="7f79cba"] h2').textContent() || '';
    }

    // Therapy Options Section
    async isTherapyOptionsSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="45011970"]').isVisible();
    }

    async getTherapyOptionsTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="698a9970"] h2').textContent() || '';
    }

    // Therapy Process Section
    async isTherapyProcessSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="38220ef5"]').isVisible();
    }

    async getTherapyProcessTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="565bf108"] h2').textContent() || '';
    }

    // Benefits Section
    async isBenefitsSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="c59e8de"]').isVisible();
    }

    async getBenefitsTitle(): Promise<string> {
        return await this.page.locator('.elementor-element[data-id="9d21746"] h2').textContent() || '';
    }

    // Wie Weiter Section
    async isWieWeiterSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="ffe72ac"]').isVisible();
    }

    // FAQ Section
    async isFAQSectionVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-element[data-id="99b95d9"]').isVisible();
    }

    async getFAQCount(): Promise<number> {
        return await this.page.locator('.elementor-accordion-item').count();
    }

    async isFAQContentVisible(index: number): Promise<boolean> {
        try {
            const accordionItem = await this.page.locator('.elementor-accordion-item').nth(index);
            await accordionItem.waitFor({ state: 'visible', timeout: 5000 });
            
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
            const accordionItem = await this.page.locator('.elementor-accordion-item').nth(index);
            await accordionItem.locator('.elementor-accordion-title').click();
            
            const content = await accordionItem.locator('.elementor-tab-content');
            await this.page.waitForFunction(
                (contentSelector) => {
                    const element = document.querySelector(contentSelector) as HTMLElement;
                    return element && !element.hasAttribute('hidden');
                },
                `.elementor-accordion-item:nth-child(${index + 1}) .elementor-tab-content`,
                { timeout: 5000 }
            );
            
            await this.page.waitForTimeout(500);
        } catch (error) {
            console.error(`Failed to click FAQ item ${index}:`, error);
            throw error;
        }
    }

    // Contact Form
    async isContactFormVisible(): Promise<boolean> {
        return await this.page.locator('.elementor-section[data-id="6b46402"] .wpcf7').isVisible();
    }

    async fillContactForm(
        name: string,
        vorname: string,
        telefon: string,
        email: string,
        strasse: string,
        wohnort: string,
        klinischeAngaben: string[],
        message: string
    ): Promise<void> {
        await this.page.locator('.elementor-section[data-id="6b46402"] input[name="Name"]').first().fill(name);
        await this.page.locator('.elementor-section[data-id="6b46402"] input[name="Vorname"]').first().fill(vorname);
        await this.page.locator('.elementor-section[data-id="6b46402"] input[name="tel-873"]').first().fill(telefon);
        await this.page.locator('.elementor-section[data-id="6b46402"] input[name="email-848"]').first().fill(email);
        await this.page.locator('.elementor-section[data-id="6b46402"] input[name="Strasse"]').first().fill(strasse);
        await this.page.locator('.elementor-section[data-id="6b46402"] input[name="Wohnort"]').first().fill(wohnort);
        
        // Handle clinical indications checkboxes
        for (const angabe of klinischeAngaben) {
            await this.page.locator(`input[name="KlinischeAngaben[]"][value="${angabe}"]`).check();
        }
        
        await this.page.locator('.elementor-section[data-id="6b46402"] textarea[name="your-message"]').first().fill(message);
    }
} 