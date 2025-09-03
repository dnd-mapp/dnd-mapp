import { ComponentHarness, HarnessQuery } from '@angular/cdk/testing';

export class TableColumnHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-table-column';

    public async text() {
        return await (await this.host()).text();
    }

    public async width() {
        return await (await this.host()).getCssValue('flex-basis');
    }

    public async underlyingHarness<C extends ComponentHarness, T extends string | HarnessQuery<C>>(harness: T) {
        return await this.locatorForOptional(harness)();
    }
}
