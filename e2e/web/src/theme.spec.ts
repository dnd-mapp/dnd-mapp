import { expect, test } from '@playwright/test';

test.describe('theme', () => {
    test('applies a saved light theme before the app boots', async ({ page }) => {
        await page.emulateMedia({ colorScheme: 'dark' });
        await page.addInitScript(() => {
            localStorage.setItem('dma-theme', 'light');
        });
        // Blocks every script file, so only the inline boot script in index.html runs.
        await page.route(/\.m?js(\?.*)?$/, (route) => route.abort());

        await page.goto('/');

        const html = page.locator('html');
        await expect(html).toHaveAttribute('data-theme', 'light');
        await expect(html).toHaveCSS('color-scheme', 'light');
        // Angular sets ng-version on the root element once the app has bootstrapped.
        await expect(page.locator('dma-root')).not.toHaveAttribute('ng-version');
    });

    for (const colorScheme of ['dark', 'light'] as const) {
        test(`follows a ${colorScheme} device when the reader picked System`, async ({ page }) => {
            await page.emulateMedia({ colorScheme });

            await page.goto('/');

            const html = page.locator('html');
            await expect(page.locator('dma-root')).toHaveAttribute('ng-version');
            await expect(html).not.toHaveAttribute('data-theme');
            await expect(html).toHaveCSS('color-scheme', colorScheme);
        });
    }
});
