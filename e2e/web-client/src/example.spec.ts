import { expect, test } from '@playwright/test';

test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect p to contain a string.
    expect(await page.locator('p').innerText()).toContain('WebClientApp works!');
});
