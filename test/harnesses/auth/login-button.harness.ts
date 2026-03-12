import { ComponentHarness } from '@angular/cdk/testing';
import { ButtonHarness } from '../shared';

export class LoginButtonHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-login-button';

    private readonly buttonLocator = this.locatorFor(ButtonHarness);

    public async login() {
        await (await this.buttonLocator()).click();
    }

    public async isIconVisible() {
        return await (await this.buttonLocator()).isIconOnly();
    }

    public async isLabelVisible() {
        return Boolean(await (await this.buttonLocator()).label());
    }
}
