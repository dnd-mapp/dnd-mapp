import { expect, test } from '@playwright/test';

test('loads the app', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle('D&D Mapp');
    // Angular sets ng-version on the root element once the app has bootstrapped.
    await expect(page.locator('dma-root')).toHaveAttribute('ng-version');
});
