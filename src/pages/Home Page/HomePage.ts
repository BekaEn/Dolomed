import { Page } from '@playwright/test';
import { BasePage } from '../BasePage';

export class HomePage extends BasePage {
    // Hero section selectors
    private readonly heroSection = '.elementor-element[data-id="108fecab"]';
    private readonly heroTitle = '.elementor-element[data-id="5507bc88"] h1';
    private readonly heroText = '.elementor-element[data-id="6cce20a6"] p';
    private readonly callNowButton = '.elementor-element[data-id="108fecab"] a[href="tel:032 324 39 90"]';
    private readonly applyButton = '.elementor-element[data-id="108fecab"] a[href="#karriere"]';
    
    // Treatment methods section selectors
    private readonly treatmentSection = '.elementor-element[data-id="30a5e292"]';
    private readonly treatmentTitle = '.elementor-element[data-id="ad1bb21"] h2';
    private readonly treatmentMethods = {
        tens: '.elementor-element[data-id="3d718dd0"]',
        acupuncture: '.elementor-element[data-id="22f39285"]',
        infiltration: '.elementor-element[data-id="86ba71e"]',
        ketamine: '.elementor-element[data-id="7e4b5249"]',
        neuromodulation: '.elementor-element[data-id="19bbe4b8"]',
        shockwave: '.elementor-element[data-id="57e622f"]',
        prp: '.elementor-element[data-id="59ba650a"]',
        stemCell: '.elementor-element[data-id="46f8b3c5"]'
    };
    
    // Visitor information section selectors
    private readonly visitorInfoSection = '.elementor-element[data-id="28947c2e"]';
    private readonly visitorInfoTitle = '.elementor-element[data-id="42952f9"] h2';
    private readonly forPatientsSection = '.elementor-element[data-id="742edb52"]';
    private readonly forReferringDoctorsSection = '.elementor-element[data-id="7a585b5c"]';
    
    // Team section selectors
    private readonly teamSection = '.elementor-element[data-id="e0115ac"]';
    private readonly teamTitle = '.elementor-element[data-id="6342a5e"] h2';
    private readonly teamTabs = {
        doctors: '#e-n-tab-title-2101261531',
        mpa: '#e-n-tab-title-2101261532',
        doctorsContent: '#e-n-tab-content-2101261531',
        mpaContent: '#e-n-tab-content-2101261532'
    };
    
    // Career section selectors
    private readonly careerSection = '.elementor-element[data-id="5e5cc2a8"]';
    private readonly careerTitle = '.elementor-element[data-id="e3ca8f0"] h2';
    private readonly careerText = '.elementor-element[data-id="246fbe89"] p';
    private readonly careerPositions = {
        assistant: '.elementor-element[data-id="26fe84b0"]',
        specialist: '.elementor-element[data-id="7c012395"]',
        trainee: '.elementor-element[data-id="6690320d"]'
    };
    
    // Contact section selectors
    private readonly contactSection = '.elementor-section[data-id="486d22bb"]';
    private readonly contactTitle = '.elementor-element[data-id="106684c5"] h2';
    private readonly contactLocations = {
        bienne: '.elementor-element[data-id="3dbbb2be"]',
        bern: '.elementor-element[data-id="15e9f5ea"]'
    };
    private readonly contactForm = {
        formContainer: '.elementor-section[data-id="486d22bb"] .wpcf7',
        nameInput: '.elementor-section[data-id="486d22bb"] input[name="your-name"]',
        emailInput: '.elementor-section[data-id="486d22bb"] input[name="your-email"]',
        messageInput: '.elementor-section[data-id="486d22bb"] textarea[name="your-message"]',
        submitButton: '.elementor-section[data-id="486d22bb"] input.wpcf7-submit'
    };

    constructor(page: Page) {
        super(page);
    }

    async goto(): Promise<boolean> {
        try {
            await this.navigate('https://dolomed.ch/');
            await this.waitForPageLoad();
            return true;
        } catch (error) {
            console.error('Failed to navigate to home page:', error);
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
    
    async clickCallNowButton(): Promise<void> {
        await this.page.click(this.callNowButton);
    }
    
    async clickApplyButton(): Promise<void> {
        await this.page.click(this.applyButton);
    }
    
    // Treatment methods section methods
    async isTreatmentSectionVisible(): Promise<boolean> {
        const section = this.page.locator(this.treatmentSection);
        return await section.isVisible();
    }
    
    async getTreatmentTitle(): Promise<string> {
        return await this.page.locator(this.treatmentTitle).textContent() || '';
    }
    
    async areTreatmentMethodsVisible(): Promise<{ [key: string]: boolean }> {
        const result: { [key: string]: boolean } = {};
        for (const [key, selector] of Object.entries(this.treatmentMethods)) {
            result[key] = await this.page.locator(selector).isVisible();
        }
        return result;
    }
    
    // Visitor information section methods
    async isVisitorInfoSectionVisible(): Promise<boolean> {
        const section = this.page.locator(this.visitorInfoSection);
        return await section.isVisible();
    }
    
    async arePatientAndDoctorSectionsVisible(): Promise<{ patients: boolean, doctors: boolean }> {
        return {
            patients: await this.page.locator(this.forPatientsSection).isVisible(),
            doctors: await this.page.locator(this.forReferringDoctorsSection).isVisible()
        };
    }
    
    // Team section methods
    async isTeamSectionVisible(): Promise<boolean> {
        const section = this.page.locator(this.teamSection);
        return await section.isVisible();
    }
    
    async clickTeamTab(tab: 'doctors' | 'mpa'): Promise<void> {
        await this.page.click(this.teamTabs[tab]);
        // Wait for the tab content to become visible
        await this.page.waitForSelector(this.teamTabs[`${tab}Content`], { state: 'visible' });
    }
    
    async isTeamContentVisible(tab: 'doctors' | 'mpa'): Promise<boolean> {
        return await this.page.locator(this.teamTabs[`${tab}Content`]).isVisible();
    }
    
    // Career section methods
    async isCareerSectionVisible(): Promise<boolean> {
        const section = this.page.locator(this.careerSection);
        return await section.isVisible();
    }
    
    async areCareerPositionsVisible(): Promise<{ [key: string]: boolean }> {
        const result: { [key: string]: boolean } = {};
        for (const [key, selector] of Object.entries(this.careerPositions)) {
            result[key] = await this.page.locator(selector).isVisible();
        }
        return result;
    }
    
    async clickCareerPosition(position: 'assistant' | 'specialist' | 'trainee'): Promise<void> {
        await this.page.click(this.careerPositions[position]);
    }
    
    // Contact section methods
    async isContactSectionVisible(): Promise<boolean> {
        const section = this.page.locator(this.contactSection);
        return await section.isVisible();
    }
    
    async areLocationContactsVisible(): Promise<{ bienne: boolean, bern: boolean }> {
        return {
            bienne: await this.page.locator(this.contactLocations.bienne).isVisible(),
            bern: await this.page.locator(this.contactLocations.bern).isVisible()
        };
    }
    
    async fillContactForm(name: string, email: string, message: string): Promise<void> {
        await this.page.fill(this.contactForm.nameInput, name);
        await this.page.fill(this.contactForm.emailInput, email);
        await this.page.fill(this.contactForm.messageInput, message);
    }
    
    async submitContactForm(): Promise<void> {
        await this.page.click(this.contactForm.submitButton);
    }
}