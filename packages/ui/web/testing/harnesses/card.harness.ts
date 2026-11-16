import { ComponentHarness, type TestElement } from '@angular/cdk/testing';
import { ChipHarness } from './chip.harness';
import { LinkHarness } from './link.harness';

/** A part of a card, in the order the card draws them: the title, the text, the row of chips, or the action. */
export type CardPart = 'title' | 'text' | 'chips' | 'action';

/** What each part matches among the children of a card. The row of chips counts only when it holds a chip. */
const PART_SELECTORS: Record<CardPart, string> = {
    title: ':is(h1, h2, h3, h4, h5, h6)',
    text: 'p',
    chips: '.chips:not(:empty)',
    action: 'a',
};

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

    /** The chips the card projects, in their order. */
    public readonly getChips = this.locatorForAll(ChipHarness);

    /** The link the card projects as its action, or `null` when it projects none. */
    public readonly getAction = this.locatorForOptional(LinkHarness);

    private readonly getChildren = this.locatorForAll(':scope > *');

    /** The text of a part, or `null` when the card projects no such part. */
    public async getText(part: CardPart): Promise<string | null> {
        return (await (await this.findPart(part))?.text()) ?? null;
    }

    /** The parts the card draws, in the order it draws them, leaving out the ones it does not project. */
    public async getParts(): Promise<CardPart[]> {
        const children = await this.getChildren();
        const parts = await Promise.all(children.map((child) => this.toPart(child)));

        return parts.filter((part) => part !== null);
    }

    /** Where each chip sits, measured from the top left of the card. */
    public async getChipBoxes(): Promise<CardPartBox[]> {
        const [host, chips] = await Promise.all([(await this.host()).getDimensions(), this.getChips()]);
        const boxes = await Promise.all(chips.map(async (chip) => (await chip.host()).getDimensions()));

        return boxes.map(({ top, left, width, height }) => ({
            top: top - host.top,
            bottom: top - host.top + height,
            left: left - host.left,
            width,
        }));
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

    private async toPart(child: TestElement): Promise<CardPart | null> {
        for (const [part, selector] of Object.entries(PART_SELECTORS) as [CardPart, string][]) {
            if (await child.matchesSelector(selector)) {
                return part;
            }
        }
        return null;
    }

    private async findPart(part: CardPart): Promise<TestElement | null> {
        return await this.locatorForOptional(`:scope > ${PART_SELECTORS[part]}`)();
    }

    private async getPart(part: CardPart): Promise<TestElement> {
        const element = await this.findPart(part);

        if (!element) {
            throw new Error(`The card projects no ${part}.`);
        }
        return element;
    }
}
