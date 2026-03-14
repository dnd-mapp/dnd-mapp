import { ComponentHarness } from '@angular/cdk/testing';

export class ButtonHarness extends ComponentHarness {
    public static readonly hostSelector = 'button[dma-button]';

    public async click() {
        await (await this.host()).click();
    }

    public async isIconOnly() {
        return await (await this.host()).hasClass('icon-only');
    }

    public async label() {
        return await (await this.host()).text();
    }

    public async color() {
        return await (await this.host()).getAttribute('dma-button');
    }

    public async size() {
        return await (await this.host()).getAttribute('size');
    }
}
