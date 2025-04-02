import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class BewegungsapparatPage extends BasePage {
    // Hero section selectors
    private readonly heroSection = '.elementor-element[data-id="8d0b772"]';
    private readonly heroTitle = '.elementor-element[data-id="be26101"] h1';
    private readonly heroSubTitle = '.elementor-element[data-id="1a6193b"] h2';
    private readonly heroText = '.elementor-element[data-id="1440e16"] p';
    private readonly appointmentButton = '.elementor-element[data-id="66cf5d6"] a';
    private readonly callNowButton = '.elementor-element[data-id="365021b"] a';
    private readonly heroImage = '.elementor-element[data-id="ebe59c5"] img';
    
    // Arthrose section selectors
    private readonly arthroseSection = '.elementor-element[data-id="078859e"]';
    private readonly arthroseTitle = '.elementor-element[data-id="8e42eff"] h2';
    private readonly arthroseText = [
        '.elementor-element[data-id="043c8ce"] p',
        '.elementor-element[data-id="4edd6b8"] p'
    ];
    private readonly arthroseImage = '.elementor-element[data-id="47cd43a"] img';
    private readonly arthroseTreatments = '.elementor-element[data-id="11798f0"] .elementor-icon-list-items';
    
    // Tendinopathie section selectors
    private readonly tendinopathieSection = '.elementor-element[data-id="9417037"]';
    private readonly tendinopathieTitle = '.elementor-element[data-id="b550f38"] h2';
    private readonly tendinopathieText = [
        '.elementor-element[data-id="f909811"] p',
        '.elementor-element[data-id="8d53918"] p'
    ];
    private readonly tendinopathieImage = '.elementor-element[data-id="10c560b"] img';
    private readonly tendinopathieTreatments = '.elementor-element[data-id="1fc019c"] .elementor-icon-list-items';
    
    // Fibromyalgie section selectors
    private readonly fibromyalgieSection = '.elementor-element[data-id="8a6d482"]';
    private readonly fibromyalgieTitle = '.elementor-element[data-id="64a7707"] h2';
    private readonly fibromyalgieText = [
        '.elementor-element[data-id="935bb22"] p',
        '.elementor-element[data-id="4b8883b"] p'
    ];
    private readonly fibromyalgieImage = '.elementor-element[data-id="1c62ef2"] img';
    private readonly fibromyalgieTreatments = '.elementor-element[data-id="7e6ba6a"] .elementor-icon-list-items';
    
    // Sportverletzungen section selectors
    private readonly sportverletzungenSection = '.elementor-element[data-id="09a3782"]';
    private readonly sportverletzungenTitle = '.elementor-element[data-id="2cfc81d"] h2';
    private readonly sportverletzungenText = [
        '.elementor-element[data-id="51ea66d"] p',
        '.elementor-element[data-id="9f9b914"] p',
        '.elementor-element[data-id="0907a50"] p'
    ];
    private readonly sportverletzungenImage = '.elementor-element[data-id="140d254"] img';
    private readonly sportverletzungenTreatments = '.elementor-element[data-id="1e66cba"] .elementor-icon-list-items';
    
    // Rheumatische section selectors
    private readonly rheumatischeSection = '.elementor-element[data-id="8d4823e"]';
    private readonly rheumatischeTitle = '.elementor-element[data-id="d385dcd"] h2';
    private readonly rheumatischeText = '.elementor-element[data-id="e6b3359"] p';
    private readonly rheumatischeImage = '.elementor-element[data-id="a6be8b8"] img';
    private readonly rheumatischeTreatments = '.elementor-element[data-id="e859788"] .elementor-icon-list-items';
    
    // Phantomschmerzen section selectors
    private readonly phantomschmerzenSection = '.elementor-element[data-id="06bca42"]';
    private readonly phantomschmerzenTitle = '.elementor-element[data-id="8bd2afd"] h2';
    private readonly phantomschmerzenText = [
        '.elementor-element[data-id="5dc9578"] p',
        '.elementor-element[data-id="439826e"] p'
    ];
    private readonly phantomschmerzenImage = '.elementor-element[data-id="635d9cc"] img';
    private readonly phantomschmerzenTreatments = '.elementor-element[data-id="a47f4de"] .elementor-icon-list-items';
    
    // Spastik section selectors
    private readonly spastikSection = '.elementor-element[data-id="70fea93"]';
    private readonly spastikTitle = '.elementor-element[data-id="d57aaeb"] h2';
    private readonly spastikText = '.elementor-element[data-id="e2a9e09"] p';
    private readonly spastikImage = '.elementor-element[data-id="1887674"] img';
    private readonly spastikTreatments = '.elementor-element[data-id="6412e7d"] .elementor-icon-list-items';
    
    // WieWeiter section selectors
    private readonly wieWeiterSection = '.elementor-element[data-id="9a0d8ff"]';
    private readonly wieWeiterTitle = '.elementor-element[data-id="c4445c2"] h2';
    private readonly wieWeiterText = '.elementor-element[data-id="7cd6fb3"]';
    private readonly wieWeiterAppointmentButton = '.elementor-element[data-id="0187584"] a';
    
    // FAQ section selectors
    private readonly faqSection = '.elementor-element[data-id="67ebb33"]';
    private readonly faqTitle = '.elementor-element[data-id="ce4966d"] h2';
    private readonly faqItems = '.elementor-accordion-item';
    
    // Contact form section selectors
    private readonly contactFormSection = '.elementor-section[data-id="a3d0327"]';
    
    // Making contact form selectors more specific with a specific parent container
    private readonly contactFormContainer = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7';
    private readonly contactFormName = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="Name"] input';
    private readonly contactFormVorname = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="Vorname"] input';
    private readonly contactFormTel = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="tel-873"] input';
    private readonly contactFormEmail = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="email-848"] input';
    private readonly contactFormStrasse = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="Strasse"] input';
    private readonly contactFormWohnort = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="Wohnort"] input';
    private readonly contactFormMessage = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="your-message"] textarea';
    private readonly contactFormSubmitButton = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-submit';

    constructor(page: Page) {
        super(page);
    }

    async goto(): Promise<boolean> {
        try {
            await this.navigate('https://dolomed.ch/bewegungsapparat/');
            await this.waitForPageLoad();
            return true;
        } catch (error) {
            console.error('Failed to navigate to Bewegungsapparat page:', error);
            return false;
        }
    }
    
    // Hero section methods
    async isHeroSectionVisible(): Promise<boolean> {
        const hero = this.page.locator(this.heroSection);
        return await hero.isVisible();
    }
    
    async getHeroTitle(): Promise<string> {
        return await this.page.locator(this.heroTitle).textContent() || '';
    }
    
    async getHeroSubTitle(): Promise<string> {
        return await this.page.locator(this.heroSubTitle).textContent() || '';
    }
    
    async clickAppointmentButton(): Promise<void> {
        await this.page.locator(this.appointmentButton).click();
    }
    
    async clickCallNowButton(): Promise<void> {
        await this.page.locator(this.callNowButton).click();
    }
    
    // Disease sections methods (for each condition)
    async isSectionVisible(section: string): Promise<boolean> {
        const sectionSelector = this[`${section}Section`];
        if (!sectionSelector) {
            throw new Error(`Section ${section} does not exist`);
        }
        return await this.page.locator(sectionSelector).isVisible();
    }
    
    async getSectionTitle(section: string): Promise<string> {
        const titleSelector = this[`${section}Title`];
        if (!titleSelector) {
            throw new Error(`Title for section ${section} does not exist`);
        }
        return await this.page.locator(titleSelector).textContent() || '';
    }
    
    async getSectionText(section: string, index = 0): Promise<string> {
        const textSelector = this[`${section}Text`];
        if (!textSelector) {
            throw new Error(`Text for section ${section} does not exist`);
        }
        
        if (Array.isArray(textSelector)) {
            if (index >= textSelector.length) {
                throw new Error(`Text index ${index} for section ${section} is out of bounds`);
            }
            return await this.page.locator(textSelector[index]).textContent() || '';
        } else {
            return await this.page.locator(textSelector).textContent() || '';
        }
    }
    
    async areTreatmentsVisible(section: string): Promise<boolean> {
        const treatmentsSelector = this[`${section}Treatments`];
        if (!treatmentsSelector) {
            throw new Error(`Treatments for section ${section} does not exist`);
        }
        return await this.page.locator(treatmentsSelector).isVisible();
    }
    
    // FAQ methods
    async isFAQSectionVisible(): Promise<boolean> {
        return await this.page.locator(this.faqSection).isVisible();
    }
    
    async getFAQCount(): Promise<number> {
        return await this.page.locator(this.faqItems).count();
    }
    
    async clickFAQItem(index: number): Promise<void> {
        const faqItems = this.page.locator(this.faqItems);
        const count = await faqItems.count();
        
        if (index >= count) {
            throw new Error(`FAQ index ${index} is out of bounds. Total FAQs: ${count}`);
        }
        
        const faqTitle = faqItems.nth(index).locator('.elementor-tab-title');
        await faqTitle.click();
    }
    
    async isFAQContentVisible(index: number): Promise<boolean> {
        const faqItems = this.page.locator(this.faqItems);
        const count = await faqItems.count();
        
        if (index >= count) {
            throw new Error(`FAQ index ${index} is out of bounds. Total FAQs: ${count}`);
        }
        
        const faqContent = faqItems.nth(index).locator('.elementor-tab-content');
        return await faqContent.isVisible();
    }
    
    // Contact form methods
    async isContactFormVisible(): Promise<boolean> {
        return await this.page.locator(this.contactFormContainer).isVisible();
    }
    
    async fillContactForm(
        name: string, 
        vorname: string, 
        tel: string, 
        email: string, 
        strasse: string, 
        wohnort: string, 
        message: string
    ): Promise<void> {
        // First scroll to make sure the form is visible
        await this.page.locator(this.contactFormContainer).scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300); // Wait for any animations to complete
        
        // Fill form with specific selectors to avoid strict mode violations
        await this.page.locator(this.contactFormName).fill(name);
        await this.page.locator(this.contactFormVorname).fill(vorname);
        await this.page.locator(this.contactFormTel).fill(tel);
        await this.page.locator(this.contactFormEmail).fill(email);
        await this.page.locator(this.contactFormStrasse).fill(strasse);
        await this.page.locator(this.contactFormWohnort).fill(wohnort);
        await this.page.locator(this.contactFormMessage).fill(message);
    }
    
    async submitContactForm(): Promise<void> {
        await this.page.locator(this.contactFormSubmitButton).click();
    }
    
    // WieWeiter section methods
    async isWieWeiterSectionVisible(): Promise<boolean> {
        return await this.page.locator(this.wieWeiterSection).isVisible();
    }
    
    async clickWieWeiterAppointmentButton(): Promise<void> {
        await this.page.locator(this.wieWeiterAppointmentButton).click();
    }
} 