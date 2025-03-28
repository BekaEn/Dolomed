import { Page, expect } from '@playwright/test';

export async function compareScreenshot(page: Page, name: string) {
    await expect(page).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0.1,
        threshold: 0.1
    });
}

export async function compareElementScreenshot(page: Page, selector: string, name: string) {
    const element = page.locator(selector);
    await expect(element).toHaveScreenshot(`${name}.png`, {
        maxDiffPixelRatio: 0.1,
        threshold: 0.1
    });
} 