import { Page } from '@playwright/test';

export class Header {
    // Main header selectors
    private readonly logoSelector = '.elementor-element-69d9a46 img';
    private readonly logoLinkSelector = '.elementor-element-69d9a46 a';
    
    private readonly megaMenuSelectors = {
        mainContainer: '.jet-menu-container',
        krankheitenMenuLink: '#jet-menu-item-20848 > a',
        therapieMenuLink: '#jet-menu-item-20849 > a',
        ueberUnsLink: '#jet-menu-item-20851 > a',
        patientenLink: '#jet-menu-item-20850 > a',
        krankheitenDropdown: '#jet-menu-item-20848 .jet-sub-mega-menu',
        therapieDropdown: '#jet-menu-item-20849 .jet-sub-mega-menu'
    };
    
    private readonly languageSelectors = {
        languageButton: '.dropbtn_lang',
        languageDropdown: '.dropdown-contentlang',
        germanOption: '.wpml-ls-item-de a',
        frenchOption: '.wpml-ls-item-fr a'
    };
    
    private readonly mobileSelectors = {
        mobileMenuButton: '.jet-mobile-menu__toggle',
        mobileMenu: '.jet-mobile-menu__instance',
        mobileMenuItemsContainer: '.jet-mobile-menu-cover',
        mobileKrankheitenLink: '#jet-menu-mobile-item-18727',
        mobileTherapieLink: '#jet-menu-mobile-item-18734'
    };
    
    private readonly callButtonSelector = '.elementor-element-b539a03 a';

    constructor(private page: Page) {}
    
    async waitForHeaderToLoad() {
        // Wait for the logo as an indicator the header has loaded
        await this.page.waitForSelector(this.logoSelector, { state: 'visible', timeout: 10000 });
    }
    
    async isLogoVisible() {
        const logo = this.page.locator(this.logoSelector);
        return await logo.isVisible();
    }
    
    async clickLogo() {
        await this.page.click(this.logoLinkSelector);
        await this.page.waitForLoadState('networkidle');
    }
    
    async verifyMainNavigation() {
        // Check if main navigation menu is visible
        const mainMenu = this.page.locator(this.megaMenuSelectors.mainContainer);
        const isMainMenuVisible = await mainMenu.isVisible();
        
        // Check individual menu items
        const menuItems = {
            krankheiten: await this.page.locator(this.megaMenuSelectors.krankheitenMenuLink).isVisible(),
            therapie: await this.page.locator(this.megaMenuSelectors.therapieMenuLink).isVisible(),
            ueberUns: await this.page.locator(this.megaMenuSelectors.ueberUnsLink).isVisible(),
            patienten: await this.page.locator(this.megaMenuSelectors.patientenLink).isVisible()
        };
        
        return {
            isMainMenuVisible,
            menuItems
        };
    }
    
    async openKrankheitenDropdown() {
        // Hover over the Krankheiten menu item to open its dropdown
        await this.page.hover(this.megaMenuSelectors.krankheitenMenuLink);
        
        // Wait for dropdown to appear
        await this.page.waitForSelector(this.megaMenuSelectors.krankheitenDropdown, { 
            state: 'visible', 
            timeout: 5000 
        });
        
        // Check if dropdown content is visible and contains expected sections
        const dropdownVisible = await this.page.locator(this.megaMenuSelectors.krankheitenDropdown).isVisible();
        
        // Check for some expected content in the dropdown - use more specific selector
        const hasExpectedContent = await this.page.locator(this.megaMenuSelectors.krankheitenDropdown + ' .megamainmn').isVisible();
        
        // Check specific links like "Bewegungsapparat" - use more specific selector
        const hasMovementLink = await this.page.locator(this.megaMenuSelectors.krankheitenDropdown + ' a[href="/bewegungsapparat"]').first().isVisible();
        
        return {
            dropdownVisible,
            hasExpectedContent,
            hasMovementLink
        };
    }
    
    async openTherapieDropdown() {
        // Hover over the Therapie menu item to open its dropdown
        await this.page.hover(this.megaMenuSelectors.therapieMenuLink);
        
        // Wait for dropdown to appear
        await this.page.waitForSelector(this.megaMenuSelectors.therapieDropdown, { 
            state: 'visible', 
            timeout: 5000 
        });
        
        // Check if dropdown content is visible
        const dropdownVisible = await this.page.locator(this.megaMenuSelectors.therapieDropdown).isVisible();
        
        // Check for some expected links in Therapie section - use more specific selectors with .first()
        const hasNervenstimulationLink = await this.page.locator(this.megaMenuSelectors.therapieDropdown + ' a[href="/nervenstimulation"]').first().isVisible();
        const hasAkupunkturLink = await this.page.locator(this.megaMenuSelectors.therapieDropdown + ' a[href="/natuerliche-linderung-durch-akupunktur"]').first().isVisible();
        
        return {
            dropdownVisible,
            hasNervenstimulationLink,
            hasAkupunkturLink
        };
    }
    
    async verifyLanguageSelector() {
        // Check if language button is visible
        const languageButton = this.page.locator(this.languageSelectors.languageButton);
        const isLanguageButtonVisible = await languageButton.isVisible();
        
        // Check language options
        await this.page.click(this.languageSelectors.languageButton);
        await this.page.waitForTimeout(500); // Allow dropdown to open
        
        const isGermanOptionVisible = await this.page.locator(this.languageSelectors.germanOption).isVisible();
        const isFrenchOptionVisible = await this.page.locator(this.languageSelectors.frenchOption).isVisible();
        
        return {
            isLanguageButtonVisible,
            isGermanOptionVisible,
            isFrenchOptionVisible
        };
    }
    
    async switchLanguage(targetLanguage: 'de' | 'fr') {
        // Open language dropdown
        await this.page.click(this.languageSelectors.languageButton);
        await this.page.waitForTimeout(500); // Allow dropdown to open
        
        // Click on the target language option
        if (targetLanguage === 'de') {
            await this.page.click(this.languageSelectors.germanOption);
        } else {
            await this.page.click(this.languageSelectors.frenchOption);
        }
        
        // Wait for page to load after language switch
        await this.page.waitForLoadState('networkidle');
        
        // Return current URL to verify language change
        return this.page.url();
    }
    
    async verifyCallButton() {
        const callButton = this.page.locator(this.callButtonSelector);
        const isCallButtonVisible = await callButton.isVisible();
        
        // Check if the href contains the phone number
        let phoneHref = '';
        if (isCallButtonVisible) {
            phoneHref = await callButton.getAttribute('href') || '';
        }
        
        const hasCorrectPhoneNumber = phoneHref.includes('tel:0323243990');
        
        return {
            isCallButtonVisible,
            hasCorrectPhoneNumber
        };
    }
    
    async verifyMobileMenuButton(isMobileView = false) {
        // If we need to test in mobile view but aren't already there
        if (isMobileView) {
            // Set viewport to mobile size
            await this.page.setViewportSize({ width: 390, height: 844 });
            await this.page.waitForTimeout(1000); // Allow layout to adjust
        }
        
        // Check if mobile menu button is visible
        const mobileButton = this.page.locator(this.mobileSelectors.mobileMenuButton);
        const isMobileButtonVisible = await mobileButton.isVisible();
        
        return {
            isMobileButtonVisible
        };
    }
    
    async openMobileMenu(isMobileView = false) {
        // Ensure we're in mobile view if requested
        if (isMobileView) {
            await this.verifyMobileMenuButton(true);
        }
        
        // Click the mobile menu button to open it
        await this.page.click(this.mobileSelectors.mobileMenuButton);
        
        // Wait for the mobile menu to appear
        await this.page.waitForSelector(this.mobileSelectors.mobileMenu, { 
            state: 'visible', 
            timeout: 5000 
        });
        
        // Check if mobile menu is now visible
        const isMobileMenuVisible = await this.page.locator(this.mobileSelectors.mobileMenu).isVisible();
        
        return {
            isMobileMenuVisible
        };
    }
} 