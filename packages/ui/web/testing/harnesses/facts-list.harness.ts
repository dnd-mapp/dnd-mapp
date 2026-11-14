import { ComponentHarness, type TestElement } from '@angular/cdk/testing';

/** A part of a fact: its term or its value. */
export type FactsListPart = 'term' | 'value';

/** The text of a fact in a facts list. */
export interface FactsListFact {
    term: string;
    value: string;
}

/** How a facts list draws the text of a part. */
export interface FactsListLook {
    color: string;
    fontWeight: string;
    textTransform: string;
}

/** The place and size of a part of a fact, relative to the facts list, in pixels. */
export interface FactsListPartBox {
    top: number;
    left: number;
    width: number;
    height: number;
}

const PART_TAGS: Record<FactsListPart, string> = { term: 'dt', value: 'dd' };

export class FactsListHarness extends ComponentHarness {
    public static readonly hostSelector = 'dl[dma-facts-list]';

    private readonly facts = this.locatorForAll(':scope > div');

    /** The term and value of each fact, in order. */
    public async getFacts(): Promise<FactsListFact[]> {
        return Promise.all(
            (await this.facts()).map(async (_, index) => {
                const [term, value] = await Promise.all([this.getPart(index, 'term'), this.getPart(index, 'value')]);

                return { term: await term.text(), value: await value.text() };
            }),
        );
    }

    /** How the facts list draws a part of the fact at `index`. */
    public async getLook(index: number, part: FactsListPart): Promise<FactsListLook> {
        const element = await this.getPart(index, part);
        const [color, fontWeight, textTransform] = await Promise.all([
            element.getCssValue('color'),
            element.getCssValue('font-weight'),
            element.getCssValue('text-transform'),
        ]);

        return { color, fontWeight, textTransform };
    }

    /** Where a part of the fact at `index` sits, measured from the top left of the facts list. */
    public async getBox(index: number, part: FactsListPart): Promise<FactsListPartBox> {
        const [host, element] = await Promise.all([(await this.host()).getDimensions(), this.getPart(index, part)]);
        const { top, left, width, height } = await element.getDimensions();

        return { top: top - host.top, left: left - host.left, width, height };
    }

    /** The width of the facts list, in pixels. */
    public async getWidth(): Promise<number> {
        return (await (await this.host()).getDimensions()).width;
    }

    private async getPart(index: number, part: FactsListPart): Promise<TestElement> {
        const element = await this.locatorForOptional(
            `:scope > div:nth-child(${String(index + 1)}) > ${PART_TAGS[part]}`,
        )();

        if (!element) {
            throw new Error(`The facts list holds no ${part} at index ${String(index)}.`);
        }
        return element;
    }
}
