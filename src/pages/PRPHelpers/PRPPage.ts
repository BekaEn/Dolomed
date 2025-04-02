import { Page } from '@playwright/test';

export class PRPPage {
    private page: Page;

    // Selectors
    private readonly heroSection = '.elementor-element[data-id="63a1376d"]';
    private readonly heroTitle = '.elementor-element[data-id="9dd6059"] h1';
    private readonly heroDescription = '.elementor-element[data-id="5f38121d"] p';
    private readonly appointmentButton = '.elementor-element[data-id="6525211c"] a';
    private readonly callButton = '.elementor-element[data-id="679caa23"] a';
    
    private readonly whatIsPRPSection = '.elementor-element[data-id="2b69dda5"]';
    private readonly whatIsPRPTitle = '.elementor-element[data-id="36ad250c"] h2';
    private readonly whatIsPRPDescription = '.elementor-element[data-id="7bcc0bc6"] p';
    
    private readonly applicationsSection = '.elementor-element[data-id="c8df14"]';
    private readonly applicationsTitle = '.elementor-element[data-id="6acf6264"] h2';
    private readonly applicationsList = '.elementor-element[data-id="143d0bd7"] .elementor-icon-list-items';
    
    private readonly processSection = '.elementor-element[data-id="1deb4efb"]';
    private readonly processTitle = '.elementor-element[data-id="71c88e58"] h2';
    private readonly processList = '.elementor-element[data-id="1e4764b8"] .elementor-icon-list-items';
    
    private readonly benefitsSection = '.elementor-element[data-id="3b6f73e3"]';
    private readonly benefitsTitle = '.elementor-element[data-id="1f9ce5ce"] h2';
    private readonly benefitsList = '.elementor-element[data-id="69695985"] .elementor-icon-list-items';
    
    private readonly nextStepsSection = '.elementor-element[data-id="79dbc4b"]';
    private readonly nextStepsTitle = '.elementor-element[data-id="922ed68"] h2';
    private readonly nextStepsDescription = '.elementor-element[data-id="52c340fa"] p';
    private readonly nextStepsButton = '.elementor-element[data-id="177f8680"] a';
    
    private readonly faqSection = '.elementor-element[data-id="6f60f0cd"]';
    private readonly faqTitle = '.elementor-element[data-id="eb1445d"] h2';
    private readonly faqItems = '.elementor-element[data-id="64d5a5bf"] .elementor-accordion-item';
    
    private readonly contactSection = '.elementor-element[data-id="4bd2d4be"]';
    private readonly contactTitle = '.elementor-element[data-id="2af62e3f"] h2';
    private readonly contactForm = '#wpcf7-f15505-p16239-o1';

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(lang: 'de' | 'fr' = 'de') {
        const url = lang === 'de' ? '/plasma-prp/' : `/${lang}/plasma-prp/`;
        await this.page.goto(url);
    }

    // Hero Section
    async isHeroSectionVisible() {
        return await this.page.isVisible(this.heroSection);
    }

    async getHeroTitle() {
        return await this.page.textContent(this.heroTitle);
    }

    async getHeroDescription() {
        return await this.page.textContent(this.heroDescription);
    }

    async clickAppointmentButton() {
        await this.page.click(this.appointmentButton);
    }

    async clickCallButton() {
        await this.page.click(this.callButton);
    }

    // What is PRP Section
    async isWhatIsPRPSectionVisible() {
        return await this.page.isVisible(this.whatIsPRPSection);
    }

    async getWhatIsPRPTitle() {
        return await this.page.textContent(this.whatIsPRPTitle);
    }

    async getWhatIsPRPDescription() {
        return await this.page.textContent(this.whatIsPRPDescription);
    }

    // Applications Section
    async isApplicationsSectionVisible() {
        return await this.page.isVisible(this.applicationsSection);
    }

    async getApplicationsTitle() {
        return await this.page.textContent(this.applicationsTitle);
    }

    async getApplicationsListItems() {
        return await this.page.$$eval(this.applicationsList + ' li', items => 
            items.map(item => item.textContent?.trim())
        );
    }

    // Process Section
    async isProcessSectionVisible() {
        return await this.page.isVisible(this.processSection);
    }

    async getProcessTitle() {
        return await this.page.textContent(this.processTitle);
    }

    async getProcessListItems() {
        return await this.page.$$eval(this.processList + ' li', items => 
            items.map(item => item.textContent?.trim())
        );
    }

    // Benefits Section
    async isBenefitsSectionVisible() {
        return await this.page.isVisible(this.benefitsSection);
    }

    async getBenefitsTitle() {
        return await this.page.textContent(this.benefitsTitle);
    }

    async getBenefitsListItems() {
        return await this.page.$$eval(this.benefitsList + ' li', items => 
            items.map(item => item.textContent?.trim())
        );
    }

    // Next Steps Section
    async isNextStepsSectionVisible() {
        return await this.page.isVisible(this.nextStepsSection);
    }

    async getNextStepsTitle() {
        return await this.page.textContent(this.nextStepsTitle);
    }

    async getNextStepsDescription() {
        return await this.page.textContent(this.nextStepsDescription);
    }

    async clickNextStepsButton() {
        await this.page.click(this.nextStepsButton);
    }

    async getNextStepsButtonHref(): Promise<string | null> {
        const nextStepsButton = this.page.locator('.elementor-element[data-id="177f8680"] a');
        return await nextStepsButton.getAttribute('href');
    }

    // FAQ Section
    async isFAQSectionVisible() {
        return await this.page.isVisible(this.faqSection);
    }

    async getFAQTitle() {
        return await this.page.textContent(this.faqTitle);
    }

    async getFAQItems() {
        return await this.page.$$eval(this.faqItems, items => 
            items.map(item => ({
                question: item.querySelector('.elementor-accordion-title')?.textContent?.trim(),
                answer: item.querySelector('.elementor-tab-content')?.textContent?.trim()
            }))
        );
    }

    async toggleFAQItem(index: number) {
        const items = await this.page.$$(this.faqItems);
        if (items[index]) {
            await items[index].click();
        }
    }

    // Contact Section
    async isContactSectionVisible() {
        return await this.page.isVisible(this.contactSection);
    }

    async getContactTitle() {
        return await this.page.textContent(this.contactTitle);
    }

    async isContactFormVisible() {
        return await this.page.isVisible(this.contactForm);
    }

    async fillContactForm(data: {
        name: string;
        firstName: string;
        phone: string;
        email: string;
        street: string;
        city: string;
        clinicalNotes: string[];
        referrer: string;
    }) {
        await this.page.fill('input[name="Name"]', data.name);
        await this.page.fill('input[name="Vorname"]', data.firstName);
        await this.page.fill('input[name="tel-873"]', data.phone);
        await this.page.fill('input[name="email-848"]', data.email);
        await this.page.fill('input[name="Strasse"]', data.street);
        await this.page.fill('input[name="Wohnort"]', data.city);
        
        for (const note of data.clinicalNotes) {
            await this.page.check(`input[value="${note}"]`);
        }
        
        await this.page.fill('textarea[name="your-message"]', data.referrer);
    }

    async submitContactForm() {
        await this.page.click('input[type="submit"]');
    }

    async getCallButtonHref(): Promise<string | null> {
        const callButton = this.page.locator('.elementor-element[data-id="679caa23"] a');
        return await callButton.getAttribute('href');
    }
} 