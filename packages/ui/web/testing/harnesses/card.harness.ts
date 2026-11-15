import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** A part of a card: the title or the text. */
export type CardPart = 'title' | 'text';

/** How a card draws its box. */
export interface CardLook {
    background: string;
    borderColor: string;
    borderWidth: string;
    borderRadius: string;
}

/** How a card draws the text of one of its parts. */
export interface CardPartLook {
    color: string;
    fontWeight: string;
    textTransform: string;
}

/** The place and size of a part of a card, relative to the card, in pixels. */
export interface CardPartBox {
    top: number;
    bottom: number;
    left: number;
    width: number;
}

/** The size of a card, in pixels. */
export interface CardSize {
    width: number;
    height: number;
}

export class CardHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-card';

    private readonly parts: Record<CardPart, () => Promise<TestElement | null>> = {
        title: this.locatorForOptional(':scope > :is(h1, h2, h3, h4, h5, h6)'),
        text: this.locatorForOptional(':scope > p'),
    };

    /** The text of a part, or `null` when the card projects no such part. */
    public async getText(part: CardPart): Promise<string | null> {
        return (await (await this.parts[part]())?.text()) ?? null;
    }

    /** How the card draws its box. */
    public async getLook(): Promise<CardLook> {
        const host = await this.host();
        const [background, borderColor, borderWidth, borderRadius] = await Promise.all([
            host.getCssValue('background-color'),
            host.getCssValue('border-top-color'),
            host.getCssValue('border-top-width'),
            host.getCssValue('border-top-left-radius'),
        ]);

        return { background, borderColor, borderWidth, borderRadius };
    }

    /** How the card draws the text of a part. */
    public async getPartLook(part: CardPart): Promise<CardPartLook> {
        const element = await this.getPart(part);
        const [color, fontWeight, textTransform] = await Promise.all([
            element.getCssValue('color'),
            element.getCssValue('font-weight'),
            element.getCssValue('text-transform'),
        ]);

        return { color, fontWeight, textTransform };
    }

    /** Where a part sits, measured from the top left of the card. */
    public async getBox(part: CardPart): Promise<CardPartBox> {
        const [host, element] = await Promise.all([(await this.host()).getDimensions(), this.getPart(part)]);
        const { top, left, width, height } = await element.getDimensions();

        return { top: top - host.top, bottom: top - host.top + height, left: left - host.left, width };
    }

    /** The width and height of the card. */
    public async getSize(): Promise<CardSize> {
        const { width, height } = await (await this.host()).getDimensions();

        return { width, height };
    }

    /** Whether the card has focus, which it never takes, since it is not a control. */
    public async isFocused(): Promise<boolean> {
        return await (await this.host()).isFocused();
    }

    private async getPart(part: CardPart): Promise<TestElement> {
        const element = await this.parts[part]();

        if (!element) {
            throw new Error(`The card projects no ${part}.`);
        }
        return element;
    }
}
