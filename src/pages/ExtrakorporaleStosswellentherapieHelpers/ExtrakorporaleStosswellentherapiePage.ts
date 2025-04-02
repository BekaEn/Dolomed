import { Page } from '@playwright/test';

export class ExtrakorporaleStosswellentherapiePage {
    private page: Page;

    // Selectors
    private heroTitle = '.elementor-element[data-id="44d6cf8b"] h1';
    private heroDescription = '.elementor-element[data-id="29b49502"] p';
    private appointmentButton = '.elementor-element[data-id="cf4c915"] a';
    private callButton = '.elementor-element[data-id="34bbbd4"] a';
    private whatIsSection = '.elementor-element[data-id="417f270"] h2';
    private whatIsContent = '.elementor-element[data-id="2565503"] p';
    private applicationsSection = '.elementor-element[data-id="173bef8e"] h2';
    private applicationsContent = '.elementor-element[data-id="638d5218"] p';
    private theoreticalSection = '.elementor-element[data-id="43be8085"] h2';
    private theoreticalContent = '.elementor-element[data-id="897a7a4"] p';
    private processSection = '.elementor-element[data-id="27b5e546"] h2';
    private processContent = '.elementor-element[data-id="4d6424d"] p';
    private benefitsSection = '.elementor-element[data-id="bae504b"] h2';
    private benefitsContent = '.elementor-element[data-id="2dc1960"] p';
    private faqSection = '.elementor-element[data-id="c32856c"] h2';
    private faqItems = '.elementor-element[data-id="a3e0abd"] .elementor-accordion-item';
    private faqTitles = '.elementor-element[data-id="a3e0abd"] .elementor-accordion-title';
    private faqContents = '.elementor-element[data-id="a3e0abd"] .elementor-tab-content';
    private navigationLinks = '.elementor-element[data-id="1ef96654"] a';
    
    // Modal selectors
    private modalBackdrop = '.modal-backdrop';
    private modalDialog = '.modal';
    private closeButton = '.btn-close';

    constructor(page: Page) {
        this.page = page;
    }

    async navigateToPage() {
        await this.page.goto('/extrakorporale-stosswellentherapie/');
        await this.page.waitForLoadState('networkidle');
    }

    async closeModals() {
        // Wait for any modal to appear
        const modalVisible = await this.page.locator(this.modalDialog).isVisible();
        if (modalVisible) {
            // Click the close button if it exists
            const closeButtonVisible = await this.page.locator(this.closeButton).isVisible();
            if (closeButtonVisible) {
                await this.page.click(this.closeButton);
                // Wait for modal to disappear
                await this.page.waitForSelector(this.modalDialog, { state: 'hidden' });
                await this.page.waitForSelector(this.modalBackdrop, { state: 'hidden' });
            }
        }
    }

    async verifyAllSections() {
        // Wait for hero section
        await this.page.waitForSelector('.elementor-element[data-id="5fa80875"]', { state: 'visible' });
        
        // Verify all sections are visible
        await this.page.waitForSelector(this.whatIsSection, { state: 'visible' });
        await this.page.waitForSelector(this.applicationsSection, { state: 'visible' });
        await this.page.waitForSelector(this.theoreticalSection, { state: 'visible' });
        await this.page.waitForSelector(this.processSection, { state: 'visible' });
        await this.page.waitForSelector(this.benefitsSection, { state: 'visible' });
        await this.page.waitForSelector(this.faqSection, { state: 'visible' });
    }

    async getHeroTitle() {
        return await this.page.textContent(this.heroTitle);
    }

    async getHeroDescription() {
        return await this.page.textContent(this.heroDescription);
    }

    async clickAppointmentButton() {
        await this.page.click(this.appointmentButton);
        // Wait for modal to appear
        await this.page.waitForSelector(this.modalDialog, { state: 'visible' });
    }

    async clickCallButton() {
        // Close any open modals first
        await this.closeModals();
        // Wait a bit for any animations to complete
        await this.page.waitForTimeout(500);
        // Now click the call button
        await this.page.click(this.callButton);
    }

    async getSectionContent(sectionSelector: string) {
        return await this.page.textContent(sectionSelector);
    }

    async getFAQItems() {
        return await this.page.$$(this.faqItems);
    }

    async toggleFAQItem(index: number) {
        const titles = await this.page.$$(this.faqTitles);
        await titles[index].click();
    }

    async isFAQItemExpanded(index: number) {
        const items = await this.page.$$(this.faqItems);
        const item = items[index];
        return await item.evaluate(el => el.classList.contains('active'));
    }

    async getNavigationLinks() {
        return await this.page.$$(this.navigationLinks);
    }

    async getPageTitle() {
        return await this.page.title();
    }

    async getMetaDescription() {
        return await this.page.$eval('meta[name="description"]', (el) => el.getAttribute('content'));
    }
} 