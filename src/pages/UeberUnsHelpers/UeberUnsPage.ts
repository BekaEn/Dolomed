import { Page, expect } from '@playwright/test';

export class UeberUnsPage {
    protected page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('/ueber-uns/');
    }

    async verifyPageTitle() {
        const title = await this.page.locator('h1').first();
        await expect(title).toHaveText('Über uns');
    }

    async verifyMainContent() {
        const mainContent = await this.page.locator('.pix-el-text p').first();
        await expect(mainContent).toContainText('Willkommen bei Dolomed, Ihrem Kompetenzzentrum für moderne Schmerzmedizin');
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

    async verifyMissionSection() {
        const missionTitle = await this.page.locator('h2:has-text("Unsere Mission")').first();
        await expect(missionTitle).toBeVisible();
        
        const missionContent = await this.page.locator('.pix-el-text p').nth(1);
        await expect(missionContent).toContainText('Bei Dolomed haben wir uns der ganzheitlichen Schmerzmedizin verschrieben');
    }

    async verifyLocations() {
        const bielLocation = await this.page.locator('h3:has-text("Standort Biel")').first();
        await expect(bielLocation).toBeVisible();
        
        const bernLocation = await this.page.locator('h3:has-text("Standort Bern")').first();
        await expect(bernLocation).toBeVisible();
    }

    async verifyTeamSection() {
        const teamTitle = await this.page.locator('h2:has-text("Unser Team")').first();
        await expect(teamTitle).toBeVisible();

        const doctorsTab = await this.page.locator('button:has-text("Ärzte")').first();
        await expect(doctorsTab).toBeVisible();

        const mpaTab = await this.page.locator('button:has-text("MPA")').first();
        await expect(mpaTab).toBeVisible();
    }

    async verifyCareerSection() {
        const careerTitle = await this.page.locator('h2:has-text("Karriere bei Dolomed")').first();
        await expect(careerTitle).toBeVisible();

        const careerContent = await this.page.locator('.pix-el-text p:has-text("Als Teil der Dolomed AG")').first();
        await expect(careerContent).toContainText('Als Teil der Dolomed AG arbeiten Sie in einem Umfeld');
    }

    async clickAppointmentButton() {
        const appointmentButton = await this.page.locator('a:has-text("Termin vereinbaren")').first();
        await appointmentButton.click();
        await this.page.waitForSelector('#medicosearchWidget');
    }

    async verifyMedicosearchWidget() {
        const widget = await this.page.locator('#medicosearchWidget');
        await expect(widget).toBeVisible();
        
        // Check for the main widget iframe
        const mainIframe = await this.page.frameLocator('iframe[title="Medicosearch Booking Widget"]').first();
        await expect(mainIframe.locator('body')).toBeVisible();
    }
} 