import { ComponentHarness } from '@angular/cdk/testing';

export class LogoHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-logo';

    private readonly markLocator = this.locatorFor('svg');
    private readonly wordmarkLocator = this.locatorForOptional('.wordmark');

    /** The name the logo gives assistive technology. */
    public async getName(): Promise<string | null> {
        return await (await this.host()).getAttribute('aria-label');
    }

    /** The text of the wordmark, or null when the logo shows the mark alone. */
    public async getWordmarkText(): Promise<string | null> {
        const wordmark = await this.wordmarkLocator();

        return wordmark ? await wordmark.text() : null;
    }

    /** Whether the mark is hidden from assistive technology, so the logo announces its name only once. */
    public async isMarkHidden(): Promise<boolean> {
        return (await (await this.markLocator()).getAttribute('aria-hidden')) === 'true';
    }

    /** The width and height of the mark in pixels. */
    public async getMarkSize(): Promise<{ width: number; height: number }> {
        const { width, height } = await (await this.markLocator()).getDimensions();

        return { width, height };
    }
}
