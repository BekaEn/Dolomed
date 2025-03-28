import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class SchmerzenInnererOrganePage extends BasePage {
    // Hero section selectors
    private readonly heroSection = '.elementor-element[data-id="4a814d00"]';
    private readonly heroTitle = '.elementor-element[data-id="3613e960"] h1';
    private readonly heroSubTitle = '.elementor-element[data-id="2bf0269a"] h2';
    private readonly heroText = '.elementor-element[data-id="6174c8b0"] p';
    private readonly appointmentButton = '.elementor-element[data-id="1287f22c"] a';
    private readonly callNowButton = '.elementor-element[data-id="4a7016b"] a';
    private readonly heroImage = '.elementor-element[data-id="7301e908"] img';
    
    // What are Schmerzen innerer Organe section selectors
    private readonly whatAreSection = '.elementor-element[data-id="5fe61570"]';
    private readonly whatAreTitle = '.elementor-element[data-id="19195c69"] h2';
    private readonly whatAreText = '.elementor-element[data-id="35ab8327"] p';
    private readonly whatAreImage = '.elementor-element[data-id="250d3950"] img';
    
    // Chronische Pankreatitis section selectors
    private readonly pankreatitisSection = '.elementor-element[data-id="37f0389"]';
    private readonly pankreatitisTitle = '.elementor-element[data-id="15893449"] h2';
    private readonly pankreatitisText = '.elementor-element[data-id="28362c5"] p';
    private readonly pankreatitisImage = '.elementor-element[data-id="23e84613"] img';
    private readonly pankreatitisTreatments = '.elementor-element[data-id="51a530b6"] .elementor-icon-list-items';
    
    // Endometriose section selectors
    private readonly endometrioseSection = '.elementor-element[data-id="1d695aaf"]';
    private readonly endometrioseTitle = '.elementor-element[data-id="397eff28"] h2';
    private readonly endometrioseText = '.elementor-element[data-id="217296d7"] p';
    private readonly endometrioseImage = '.elementor-element[data-id="5e35f65c"] img';
    private readonly endometrioseTreatments = '.elementor-element[data-id="196ab6c9"] .elementor-icon-list-items';
    
    // Pelvic Pain section selectors
    private readonly pelvicPainSection = '.elementor-element[data-id="2892ea96"]';
    private readonly pelvicPainTitle = '.elementor-element[data-id="4832bafa"] h2';
    private readonly pelvicPainText = '.elementor-element[data-id="6c94592c"] p';
    private readonly pelvicPainImage = '.elementor-element[data-id="1515da75"] img';
    private readonly pelvicPainTreatments = '.elementor-element[data-id="f789bef"] .elementor-icon-list-items';
    
    // Angina Pectoris section selectors
    private readonly anginaPectorisSection = '.elementor-element[data-id="41f81d5"]';
    private readonly anginaPectorisTitle = '.elementor-element[data-id="e8ee73b"] h2';
    private readonly anginaPectorisText = '.elementor-element[data-id="95e8358"] p';
    private readonly anginaPectorisImage = '.elementor-element[data-id="6adcdd4"] img';
    private readonly anginaPectorisTreatments = '.elementor-element[data-id="447d7fa"] .elementor-icon-list-items';
    
    // WieWeiter section selectors
    private readonly wieWeiterSection = '.e-con-inner:has(.elementor-element[data-id="a10eaeb"])';
    private readonly wieWeiterTitle = '.elementor-element[data-id="a10eaeb"] h2';
    private readonly wieWeiterText = '.elementor-element[data-id="f394ed5"] p';
    private readonly wieWeiterAppointmentButton = '.elementor-element[data-id="60dd449"] a';
    
    // FAQ section selectors
    private readonly faqSection = '.elementor-element[data-id="fe5401c"]';
    private readonly faqTitle = '.elementor-element[data-id="5dac773"] h2';
    private readonly faqItems = '.elementor-accordion-item';
    
    // Contact form section selectors
    private readonly contactFormSection = '.elementor-section[data-id="fb3726c"]';
    
    // Making contact form selectors more specific with a specific parent container
    private readonly contactFormContainer = '.elementor-section[data-id="fb3726c"] .wpcf7';
    private readonly contactFormName = '.elementor-section[data-id="fb3726c"] .wpcf7-form-control-wrap[data-name="Name"] input';
    private readonly contactFormVorname = '.elementor-section[data-id="fb3726c"] .wpcf7-form-control-wrap[data-name="Vorname"] input';
    private readonly contactFormTel = '.elementor-section[data-id="fb3726c"] .wpcf7-form-control-wrap[data-name="tel-873"] input';
    private readonly contactFormEmail = '.elementor-section[data-id="fb3726c"] .wpcf7-form-control-wrap[data-name="email-848"] input';
    private readonly contactFormStrasse = '.elementor-section[data-id="fb3726c"] .wpcf7-form-control-wrap[data-name="Strasse"] input';
    private readonly contactFormWohnort = '.elementor-section[data-id="fb3726c"] .wpcf7-form-control-wrap[data-name="Wohnort"] input';
    private readonly contactFormMessage = '.elementor-section[data-id="fb3726c"] .wpcf7-form-control-wrap[data-name="your-message"] textarea';
    private readonly contactFormSubmitButton = '.elementor-section[data-id="fb3726c"] .wpcf7-submit';

    constructor(page: Page) {
        super(page);
    }

    async goto(): Promise<boolean> {
        try {
            await this.navigate('https://dolomed.ch/schmerzen-innerer-organe/');
            await this.waitForPageLoad();
            return true;
        } catch (error) {
            console.error('Failed to navigate to Schmerzen Innerer Organe page:', error);
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
    
    async getSectionText(section: string): Promise<string> {
        const textSelector = this[`${section}Text`];
        if (!textSelector) {
            throw new Error(`Text for section ${section} does not exist`);
        }
        return await this.page.locator(textSelector).textContent() || '';
    }
    
    async areTreatmentsVisible(section: string): Promise<boolean> {
        const treatmentsSelector = this[`${section}Treatments`];
        if (!treatmentsSelector) {
            throw new Error(`Treatments for section ${section} does not exist`);
        }
        return await this.page.locator(treatmentsSelector).isVisible();
    }
    
    async getTreatmentsCount(section: string): Promise<number> {
        const treatmentsSelector = this[`${section}Treatments`];
        if (!treatmentsSelector) {
            throw new Error(`Treatments for section ${section} does not exist`);
        }
        const treatments = this.page.locator(`${treatmentsSelector} .elementor-icon-list-item`);
        return await treatments.count();
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