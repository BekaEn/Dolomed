import { Page } from '@playwright/test';

export class StammzellentherapiePage {
    public page: Page;

    // Selectors
    public readonly heroTitle = 'h1.heading-text';
    public readonly heroSubtitle = 'h2.heading-text';
    public readonly heroDescription = '.text-18.resp-option';
    public readonly appointmentButton = 'a.btn-secondary:has-text("Termin vereinbaren"):not(:has-text("Einen"))';
    public readonly callButton = 'a.btn-primary:has-text("Jetzt anrufen"):not(:has-text("Einen"))';
    public readonly faqSection = '.faqcss';
    public readonly faqItems = '.elementor-accordion-item';
    public readonly contactForm = '#wpcf7-f15505-p16275-o1';
    public readonly contactFormName = '#wpcf7-f15505-p16275-o1 input[name="Name"]';
    public readonly contactFormVorname = '#wpcf7-f15505-p16275-o1 input[name="Vorname"]';
    public readonly contactFormPhone = '#wpcf7-f15505-p16275-o1 input[name="tel-873"]';
    public readonly contactFormEmail = '#wpcf7-f15505-p16275-o1 input[name="email-848"]';
    public readonly contactFormStreet = '#wpcf7-f15505-p16275-o1 input[name="Strasse"]';
    public readonly contactFormCity = '#wpcf7-f15505-p16275-o1 input[name="Wohnort"]';
    public readonly contactFormSubmit = '#wpcf7-f15505-p16275-o1 input[type="submit"]';

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(lang: string = 'de') {
        const url = lang === 'de' ? '/stammzellentherapie/' : `/${lang}/stammzellentherapie/`;
        await this.page.goto(url);
    }

    async getHeroTitle() {
        return await this.page.textContent(this.heroTitle);
    }

    async getHeroSubtitle() {
        return await this.page.textContent(this.heroSubtitle);
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

    async getFAQCount() {
        return await this.page.locator(this.faqItems).count();
    }

    async expandFAQItem(index: number) {
        await this.page.locator(this.faqItems).nth(index).click();
    }

    async fillContactForm(data: {
        name: string;
        vorname: string;
        phone: string;
        email: string;
        street: string;
        city: string;
    }) {
        // Wait for the form to be visible
        await this.page.waitForSelector(this.contactForm);
        
        // Fill out each field with more specific selectors
        await this.page.locator(this.contactFormName).fill(data.name);
        await this.page.locator(this.contactFormVorname).fill(data.vorname);
        await this.page.locator(this.contactFormPhone).fill(data.phone);
        await this.page.locator(this.contactFormEmail).fill(data.email);
        await this.page.locator(this.contactFormStreet).fill(data.street);
        await this.page.locator(this.contactFormCity).fill(data.city);
    }

    async submitContactForm() {
        await this.page.click(this.contactFormSubmit);
    }

    async isContactFormVisible() {
        return await this.page.isVisible(this.contactForm);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector(this.heroTitle);
    }
} 