import { expect, test } from '@playwright/test';

test('has text contents', async ({ page }) => {
    await page.goto('/');

    // Expect p to contain a string.
    expect(await page.locator('p').innerText()).toContain('WebClientApp works!');
});
