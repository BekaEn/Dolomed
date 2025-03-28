import { test, expect } from '@playwright/test';
import { BewegungsapparatPage } from '../../pages/bewegungsapparatHelpers/BewegungsapparatPage';

test.describe('Dolomed Bewegungsapparat Page Tests', () => {
    let bewegungsapparatPage: BewegungsapparatPage;

    test.beforeEach(async ({ page }) => {
        bewegungsapparatPage = new BewegungsapparatPage(page);
        // Navigate to the Bewegungsapparat page
        const navigationSuccess = await bewegungsapparatPage.goto();
        expect(navigationSuccess).toBe(true);
    });

    // Test navigation to the Bewegungsapparat page
    test('should navigate to the Bewegungsapparat page successfully', async () => {
        // This is already tested in beforeEach, but added explicitly for clarity
        expect(await bewegungsapparatPage.page.title()).toContain('Dolomed');
    });

    // Test Hero Section
    test('should display hero section correctly', async () => {
        // Verify hero section is visible
        expect(await bewegungsapparatPage.isHeroSectionVisible()).toBe(true);
        
        // Verify title content
        const heroTitle = await bewegungsapparatPage.getHeroTitle();
        expect(heroTitle).toContain('Erkrankungen vom Bewegungsapparat');
        
        // Verify buttons are present
        const appointmentButton = bewegungsapparatPage.page.locator('.elementor-element[data-id="66cf5d6"] a');
        await expect(appointmentButton).toBeVisible();
        
        const callButton = bewegungsapparatPage.page.locator('.elementor-element[data-id="365021b"] a');
        await expect(callButton).toBeVisible();
    });

    // Test Arthrose Section
    test('should display Arthrose section correctly', async () => {
        // Verify Arthrose section is visible
        expect(await bewegungsapparatPage.isSectionVisible('arthrose')).toBe(true);
        
        // Verify section title
        const title = await bewegungsapparatPage.getSectionTitle('arthrose');
        expect(title).toBe('Arthrose');
        
        // Verify text content
        const text = await bewegungsapparatPage.getSectionText('arthrose', 0);
        expect(text).toContain('Arthrose ist eine degenerative Erkrankung');
        
        // Verify treatments are visible
        expect(await bewegungsapparatPage.areTreatmentsVisible('arthrose')).toBe(true);
    });

    // Test Tendinopathie Section
    test('should display Tendinopathie section correctly', async () => {
        // Scroll to section for visibility
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="9417037"]').scrollIntoViewIfNeeded();
        
        // Verify Tendinopathie section is visible
        expect(await bewegungsapparatPage.isSectionVisible('tendinopathie')).toBe(true);
        
        // Verify section title
        const title = await bewegungsapparatPage.getSectionTitle('tendinopathie');
        expect(title).toBe('Tendinopathie');
        
        // Verify text content
        const text = await bewegungsapparatPage.getSectionText('tendinopathie', 0);
        expect(text).toContain('Tendinopathie bezieht sich auf Entzündungen');
        
        // Verify treatments are visible
        expect(await bewegungsapparatPage.areTreatmentsVisible('tendinopathie')).toBe(true);
    });

    // Test Fibromyalgie Section
    test('should display Fibromyalgie section correctly', async () => {
        // Scroll to section for visibility
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="8a6d482"]').scrollIntoViewIfNeeded();
        
        // Verify Fibromyalgie section is visible
        expect(await bewegungsapparatPage.isSectionVisible('fibromyalgie')).toBe(true);
        
        // Verify section title
        const title = await bewegungsapparatPage.getSectionTitle('fibromyalgie');
        expect(title).toBe('Fibromyalgie');
        
        // Verify text content
        const text = await bewegungsapparatPage.getSectionText('fibromyalgie', 0);
        expect(text).toContain('Fibromyalgie ist eine chronische Erkrankung');
        
        // Verify treatments are visible
        expect(await bewegungsapparatPage.areTreatmentsVisible('fibromyalgie')).toBe(true);
    });

    // Test Sportverletzungen Section
    test('should display Sportverletzungen section correctly', async () => {
        // Scroll to section for visibility
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="09a3782"]').scrollIntoViewIfNeeded();
        
        // Verify Sportverletzungen section is visible
        expect(await bewegungsapparatPage.isSectionVisible('sportverletzungen')).toBe(true);
        
        // Verify section title
        const title = await bewegungsapparatPage.getSectionTitle('sportverletzungen');
        expect(title).toBe('Sportverletzungen');
        
        // Verify text content
        const text = await bewegungsapparatPage.getSectionText('sportverletzungen', 0);
        expect(text).toContain('Sportverletzungen betreffen oft Knochen');
        
        // Verify treatments are visible
        expect(await bewegungsapparatPage.areTreatmentsVisible('sportverletzungen')).toBe(true);
    });

    // Test Rheumatische Section
    test('should display Rheumatische section correctly', async () => {
        // Scroll to section for visibility
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="8d4823e"]').scrollIntoViewIfNeeded();
        
        // Verify Rheumatische section is visible
        expect(await bewegungsapparatPage.isSectionVisible('rheumatische')).toBe(true);
        
        // Verify section title
        const title = await bewegungsapparatPage.getSectionTitle('rheumatische');
        expect(title).toBe('Rheumatische Erkrankungen');
        
        // Verify text content
        const text = await bewegungsapparatPage.getSectionText('rheumatische');
        expect(text).toContain('Rheumatische Erkrankungen sind eine Gruppe von Krankheiten');
        
        // Verify treatments are visible
        expect(await bewegungsapparatPage.areTreatmentsVisible('rheumatische')).toBe(true);
    });

    // Test Phantomschmerzen Section
    test('should display Phantomschmerzen section correctly', async () => {
        // Scroll to section for visibility
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="06bca42"]').scrollIntoViewIfNeeded();
        
        // Verify Phantomschmerzen section is visible
        expect(await bewegungsapparatPage.isSectionVisible('phantomschmerzen')).toBe(true);
        
        // Verify section title
        const title = await bewegungsapparatPage.getSectionTitle('phantomschmerzen');
        expect(title).toBe('Phantomschmerzen');
        
        // Verify text content
        const text = await bewegungsapparatPage.getSectionText('phantomschmerzen', 1);
        expect(text).toContain('Phantomschmerzen treten nach der Amputation');
        
        // Verify treatments are visible
        expect(await bewegungsapparatPage.areTreatmentsVisible('phantomschmerzen')).toBe(true);
    });

    // Test Spastik Section
    test('should display Spastik section correctly', async () => {
        // Scroll to section for visibility
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="70fea93"]').scrollIntoViewIfNeeded();
        
        // Verify Spastik section is visible
        expect(await bewegungsapparatPage.isSectionVisible('spastik')).toBe(true);
        
        // Verify section title
        const title = await bewegungsapparatPage.getSectionTitle('spastik');
        expect(title).toBe('Spastik');
        
        // Verify text content
        const text = await bewegungsapparatPage.getSectionText('spastik');
        expect(text).toContain('Spastik ist eine Muskelsteifheit');
        
        // Verify treatments are visible
        expect(await bewegungsapparatPage.areTreatmentsVisible('spastik')).toBe(true);
    });

    // Test WieWeiter Section
    test('should display Wie Weiter section correctly', async () => {
        // Scroll to section for visibility
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="9a0d8ff"]').scrollIntoViewIfNeeded();
        
        // Verify WieWeiter section is visible
        expect(await bewegungsapparatPage.isWieWeiterSectionVisible()).toBe(true);
        
        // Verify appointment button is visible
        const appointmentButton = bewegungsapparatPage.page.locator('.elementor-element[data-id="0187584"] a');
        await expect(appointmentButton).toBeVisible();
    });

    // Test FAQ Section
    test('should display FAQ section with working accordion', async () => {
        // Scroll to FAQ section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="67ebb33"]').scrollIntoViewIfNeeded();
        
        // Verify FAQ section is visible
        expect(await bewegungsapparatPage.isFAQSectionVisible()).toBe(true);
        
        // Get FAQ count
        const faqCount = await bewegungsapparatPage.getFAQCount();
        expect(faqCount).toBeGreaterThan(0);
        
        // Test clicking on first accordion item (already open by default)
        const firstFaqVisible = await bewegungsapparatPage.isFAQContentVisible(0);
        expect(firstFaqVisible).toBe(true);
        
        // Test clicking on second accordion item
        await bewegungsapparatPage.clickFAQItem(1);
        await bewegungsapparatPage.page.waitForTimeout(300); // Wait for animation
        const secondFaqVisible = await bewegungsapparatPage.isFAQContentVisible(1);
        expect(secondFaqVisible).toBe(true);
    });

    // Test Contact Form
    test('should allow filling the contact form', async () => {
        // Use the specific contact form located in this section
        const contactFormContainer = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7';
        
        // Scroll to contact form section for visibility
        await bewegungsapparatPage.page.locator(contactFormContainer).scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(500); // Allow more time for any lazy loading
        
        // Verify contact form is visible
        expect(await bewegungsapparatPage.isContactFormVisible()).toBe(true);
        
        // Fill out the contact form
        await bewegungsapparatPage.fillContactForm(
            'Test Name',
            'Test Vorname',
            '123456789',
            'test@example.com',
            'Test Strasse',
            'Test Wohnort',
            'Test Message'
        );
        
        // Check that the form fields have been filled correctly with specific selectors
        const contactFormName = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="Name"] input';
        const contactFormVorname = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="Vorname"] input';
        const contactFormTel = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="tel-873"] input';
        const contactFormEmail = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="email-848"] input';
        const contactFormStrasse = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="Strasse"] input';
        const contactFormWohnort = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="Wohnort"] input';
        const contactFormMessage = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="your-message"] textarea';

        await expect(bewegungsapparatPage.page.locator(contactFormName)).toHaveValue('Test Name');
        await expect(bewegungsapparatPage.page.locator(contactFormVorname)).toHaveValue('Test Vorname');
        await expect(bewegungsapparatPage.page.locator(contactFormTel)).toHaveValue('123456789');
        await expect(bewegungsapparatPage.page.locator(contactFormEmail)).toHaveValue('test@example.com');
        await expect(bewegungsapparatPage.page.locator(contactFormStrasse)).toHaveValue('Test Strasse');
        await expect(bewegungsapparatPage.page.locator(contactFormWohnort)).toHaveValue('Test Wohnort');
        await expect(bewegungsapparatPage.page.locator(contactFormMessage)).toHaveValue('Test Message');
    });

    // Test call buttons
    test('should have working call buttons', async () => {
        // Verify the href attribute of the call button in hero section
        const callButton = bewegungsapparatPage.page.locator('.elementor-element[data-id="365021b"] a');
        const href = await callButton.getAttribute('href');
        expect(href).toBe('tel:032 324 39 90');
        
        // Verify call buttons in contact section
        const contactCallButton = bewegungsapparatPage.page.locator('a[href="tel:+41%2032%20324%2039%2090"]').first();
        const contactHref = await contactCallButton.getAttribute('href');
        // URL-encoded spaces (%20) are present in the actual href attribute
        expect(contactHref).toBe('tel:+41%2032%20324%2039%2090');
    });

    // Test email links
    test('should have working email links', async () => {
        // Scroll to the contact section to make email links visible
        await bewegungsapparatPage.page.locator('.elementor-section[data-id="a3d0327"]').scrollIntoViewIfNeeded();
        
        // Verify email links are present
        const emailLinks = bewegungsapparatPage.page.locator('a[href="mailto:info@dolomed.ch"]');
        expect(await emailLinks.count()).toBeGreaterThan(0);
        
        // Verify the first email link href attribute
        const href = await emailLinks.first().getAttribute('href');
        expect(href).toBe('mailto:info@dolomed.ch');
    });

    // Test images loading
    test('should load all important images', async () => {
        // Wait for all images to load
        await bewegungsapparatPage.page.waitForLoadState('load');
        
        // Check hero image
        const heroImage = bewegungsapparatPage.page.locator('.elementor-element[data-id="ebe59c5"] img');
        expect(await heroImage.isVisible()).toBe(true);
        
        // Check Arthrose image
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="078859e"]').scrollIntoViewIfNeeded();
        const arthroseImage = bewegungsapparatPage.page.locator('.elementor-element[data-id="47cd43a"] img');
        expect(await arthroseImage.isVisible()).toBe(true);
        
        // Check Tendinopathie image
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="9417037"]').scrollIntoViewIfNeeded();
        const tendinopathieImage = bewegungsapparatPage.page.locator('.elementor-element[data-id="10c560b"] img');
        expect(await tendinopathieImage.isVisible()).toBe(true);
    });

    // Test scroll functionality and interaction
    test('should properly render elements when scrolling through the page', async () => {
        // Test initial viewport - Hero section should be visible
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="8d0b772"]')).toBeVisible();
        
        // Scroll to Arthrose section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="078859e"]').scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300); // Allow time for any animations
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="078859e"]')).toBeVisible();
        
        // Scroll to Tendinopathie section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="9417037"]').scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300);
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="9417037"]')).toBeVisible();
        
        // Scroll to Fibromyalgie section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="8a6d482"]').scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300);
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="8a6d482"]')).toBeVisible();
        
        // Scroll to Sportverletzungen section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="09a3782"]').scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300);
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="09a3782"]')).toBeVisible();
        
        // Scroll to Rheumatische section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="8d4823e"]').scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300);
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="8d4823e"]')).toBeVisible();
        
        // Scroll to Phantomschmerzen section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="06bca42"]').scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300);
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="06bca42"]')).toBeVisible();
        
        // Scroll to Spastik section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="70fea93"]').scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300);
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="70fea93"]')).toBeVisible();
        
        // Scroll to WieWeiter section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="9a0d8ff"]').scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300);
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="9a0d8ff"]')).toBeVisible();
        
        // Scroll to FAQ section
        await bewegungsapparatPage.page.locator('.elementor-element[data-id="67ebb33"]').scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300);
        await expect(bewegungsapparatPage.page.locator('.elementor-element[data-id="67ebb33"]')).toBeVisible();
        
        // Interact with FAQ accordion
        await bewegungsapparatPage.clickFAQItem(2); // Click the third FAQ item
        await bewegungsapparatPage.page.waitForTimeout(300);
        const thirdFaqVisible = await bewegungsapparatPage.isFAQContentVisible(2);
        expect(thirdFaqVisible).toBe(true);
        
        // Scroll to Contact Form section - use specific container
        const contactFormContainer = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7';
        await bewegungsapparatPage.page.locator(contactFormContainer).scrollIntoViewIfNeeded();
        await bewegungsapparatPage.page.waitForTimeout(300);
        await expect(bewegungsapparatPage.page.locator(contactFormContainer)).toBeVisible();
        
        // Interact with contact form - use specific selector
        const nameInput = '.elementor-section[data-id="a3d0327"] .elementor-element[data-id="1b75947"] .wpcf7-form-control-wrap[data-name="Name"] input';
        await bewegungsapparatPage.page.locator(nameInput).fill('Scroll Test');
        await expect(bewegungsapparatPage.page.locator(nameInput)).toHaveValue('Scroll Test');
    });
}); 