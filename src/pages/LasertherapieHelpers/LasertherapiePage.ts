import { Page } from '@playwright/test';

export class LasertherapiePage {
    public page: Page;

    // Selectors
    public readonly heroTitle = 'h1.heading-text';
    public readonly heroSubtitle = 'h2.heading-text';
    public readonly heroDescription = '.text-18.resp-option';
    public readonly appointmentButton = 'a.btn-secondary:has-text("Termin vereinbaren"):not(:has-text("Einen"))';
    public readonly callButton = 'a.btn-primary:has-text("Jetzt anrufen"):not(:has-text("Einen"))';
    public readonly phoneNumber = 'a.btn-primary:has-text("Jetzt anrufen")[href^="tel:"]';
    public readonly faqSection = '.faqcss';
    public readonly faqItems = '.elementor-accordion-item';
    public readonly contactForm = '#wpcf7-f15505-p22209-o1';
    public readonly contactFormName = '#wpcf7-f15505-p22209-o1 input[name="Name"]';
    public readonly contactFormVorname = '#wpcf7-f15505-p22209-o1 input[name="Vorname"]';
    public readonly contactFormPhone = '#wpcf7-f15505-p22209-o1 input[name="tel-873"]';
    public readonly contactFormEmail = '#wpcf7-f15505-p22209-o1 input[name="email-848"]';
    public readonly contactFormStreet = '#wpcf7-f15505-p22209-o1 input[name="Strasse"]';
    public readonly contactFormCity = '#wpcf7-f15505-p22209-o1 input[name="Wohnort"]';
    public readonly contactFormSubmit = '#wpcf7-f15505-p22209-o1 input[type="submit"]';

    // Modal selectors
    public readonly modalContent = '.modal-content';
    public readonly modalBody = '.modal-body';
    public readonly modalCloseButton = '.close[data-dismiss="modal"]';
    public readonly medicosearchWidget = '#medicosearchWidget';
    public readonly medicosearchIframe = '#medicosearchWidget iframe';

    constructor(page: Page) {
        this.page = page;
    }

    async navigate(lang: string = 'de') {
        const url = lang === 'de' ? '/lasertherapie/' : `/${lang}/lasertherapie/`;
        await this.page.goto(url);
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForSelector(this.heroTitle);
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
        // Wait for the modal to be visible
        await this.page.waitForSelector(this.modalContent);
    }

    async clickCallButton() {
        await this.page.click(this.callButton);
    }

    async getFAQCount() {
        return await this.page.locator(this.faqItems).count();
    }

    async isFAQItemExpanded(index: number) {
        const item = await this.page.locator(this.faqItems).nth(index);
        const title = await item.locator('.elementor-tab-title');
        const content = await item.locator('.elementor-tab-content');
        
        // Check both the title's aria-expanded attribute and content's display style
        const ariaExpanded = await title.getAttribute('aria-expanded');
        const displayStyle = await content.evaluate(el => window.getComputedStyle(el).display);
        
        return ariaExpanded === 'true' && displayStyle !== 'none';
    }

    async expandFAQItem(index: number) {
        const item = await this.page.locator(this.faqItems).nth(index);
        const isExpanded = await this.isFAQItemExpanded(index);
        
        if (!isExpanded) {
            // Scroll the item into view
            await item.scrollIntoViewIfNeeded();
            
            // Wait for any overlays to be stable
            await this.page.waitForTimeout(1000);
            
            // Click using JavaScript to avoid overlay issues
            await this.page.evaluate((selector) => {
                const element = document.querySelector(selector) as HTMLElement;
                if (element) {
                    element.click();
                }
            }, `.elementor-accordion-item:nth-child(${index + 1}) .elementor-tab-title`);
            
            // Wait for the state to update
            await this.page.waitForTimeout(1000);
        }
    }

    async collapseFAQItem(index: number) {
        const item = await this.page.locator(this.faqItems).nth(index);
        const isExpanded = await this.isFAQItemExpanded(index);
        
        if (isExpanded) {
            // Scroll the item into view
            await item.scrollIntoViewIfNeeded();
            
            // Wait for any overlays to be stable
            await this.page.waitForTimeout(1000);
            
            // Click using JavaScript to avoid overlay issues
            await this.page.evaluate((selector) => {
                const element = document.querySelector(selector) as HTMLElement;
                if (element) {
                    element.click();
                }
            }, `.elementor-accordion-item:nth-child(${index + 1}) .elementor-tab-title`);
            
            // Wait for the state to update
            await this.page.waitForTimeout(1000);
        }
    }

    async fillContactForm(data: {
        name: string;
        vorname: string;
        phone: string;
        email: string;
        street: string;
        city: string;
    }) {
        await this.page.waitForSelector(this.contactForm);
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

    async closeModal() {
        // Click the close button
        await this.page.click(this.modalCloseButton);
        
        // Wait for the modal to be hidden using multiple checks
        try {
            await this.page.waitForSelector(this.modalContent, { state: 'hidden', timeout: 10000 });
        } catch (error) {
            // If the modal is still visible, try to force close it
            await this.page.evaluate(() => {
                const modal = document.querySelector('.modal') as HTMLElement;
                if (modal) {
                    modal.classList.remove('show');
                    modal.style.display = 'none';
                }
            });
        }
    }

    async isModalVisible() {
        try {
            const modal = await this.page.locator(this.modalContent);
            const isVisible = await modal.isVisible({ timeout: 5000 });
            if (!isVisible) return false;
            
            // Check if the modal is actually displayed (not hidden by CSS)
            const displayStyle = await modal.evaluate(el => window.getComputedStyle(el).display);
            return displayStyle !== 'none';
        } catch (error) {
            return false;
        }
    }

    async getMedicosearchIframe() {
        return this.page.frameLocator(this.medicosearchIframe);
    }

    async getPhoneNumber() {
        const phoneLink = await this.page.locator(this.phoneNumber);
        const href = await phoneLink.getAttribute('href');
        // Clean up the phone number by removing 'tel:' and any URL encoding
        return href?.replace('tel:', '').replace(/%20/g, ' ').trim();
    }
} 