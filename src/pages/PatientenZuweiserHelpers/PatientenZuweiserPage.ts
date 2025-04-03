import { Page, expect } from '@playwright/test';

export class PatientenZuweiserPage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('/patienten-zuweiser/');
    }

    async verifyPageTitle() {
        const title = await this.page.locator('h1').first();
        await expect(title).toHaveText('Patienten & Zuweiser');
    }

    async verifyMainContent() {
        const mainContent = await this.page.locator('.pix-el-text p').first();
        await expect(mainContent).toContainText('Bei Dolomed möchten wir Ihnen den Zugang zu unserer spezialisierten Schmerzmedizin so einfach und unkompliziert wie möglich gestalten');
    }

    async verifyAppointmentButton() {
        const appointmentButton = await this.page.locator('a:has-text("Termin vereinbaren")').first();
        await expect(appointmentButton).toBeVisible();
        await expect(appointmentButton).toHaveClass(/btn-secondary/);
    }

    async verifyPhoneButton() {
        const phoneButton = await this.page.locator('a:has-text("Jetzt anrufen")').first();
        await expect(phoneButton).toBeVisible();
        await expect(phoneButton).toHaveClass(/elementor-button/);
        await expect(phoneButton).toHaveAttribute('href', 'tel:0323243990');
    }

    async verifyInfoSection() {
        const infoTitle = await this.page.locator('h2:has-text("Infos")').first();
        await expect(infoTitle).toBeVisible();
        
        const infoContent = await this.page.locator('.pix-el-text p').nth(1);
        await expect(infoContent).toContainText('In der Regel benötigen unsere Patienten eine Zuweisung durch Ihren Hausarzt oder einen Facharzt');
    }

    async verifyReferralFormSection() {
        const referralTitle = await this.page.locator('h2:has-text("Zuweisungsformular für Hausärzte")').first();
        await expect(referralTitle).toBeVisible();
        
        const referralContent = await this.page.locator('.pix-el-text p:has-text("Wir möchten Ihnen die Zuweisung so einfach wie möglich machen")').first();
        await expect(referralContent).toContainText('Wir möchten Ihnen die Zuweisung so einfach wie möglich machen');
    }

    async verifyBookingSection() {
        const bookingTitle = await this.page.locator('h2:has-text("Termin buchen für Patienten")').first();
        await expect(bookingTitle).toBeVisible();
        
        const bookingContent = await this.page.locator('p:has-text("Hier können Sie selbst einen Termin zum Gespräch vereinbaren")').first();
        await expect(bookingContent).toBeVisible();
    }

    async verifyContactSection() {
        const contactTitle = await this.page.locator('h2:has-text("Kontaktdaten")').first();
        await expect(contactTitle).toBeVisible();
        
        const address = await this.page.locator('.elementor-icon-list-text:has-text("Dolomed, Bahnhofplatz 2c")').first();
        await expect(address).toBeVisible();
        
        const phone = await this.page.locator('.elementor-icon-list-text:has-text("032 324 3990")').first();
        await expect(phone).toBeVisible();
        
        const email = await this.page.locator('.elementor-icon-list-text:has-text("info@dolomed.ch")').first();
        await expect(email).toBeVisible();
    }

    async clickAppointmentButton() {
        const appointmentButton = await this.page.locator('a:has-text("Termin vereinbaren")').first();
        await appointmentButton.click();
        await this.page.waitForSelector('#terminbuchen #medicosearchWidget');
    }

    async verifyMedicosearchWidget() {
        // Check for the specific widget in the booking section
        const widget = await this.page.locator('#terminbuchen #medicosearchWidget');
        await expect(widget).toBeVisible();
        
        // Check for the main widget iframe
        const mainIframe = await this.page.frameLocator('iframe[title="Medicosearch Booking Widget"]').first();
        await expect(mainIframe.locator('body')).toBeVisible();
    }
} 