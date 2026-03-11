import { ComponentHarness } from '@angular/cdk/testing';
import { ButtonHarness } from '../shared/ui';

export class SignupButtonHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-signup-button';

    private readonly buttonLocator = this.locatorFor(ButtonHarness);

    public async signUp() {
        await (await this.buttonLocator()).click();
    }

    public async isIconVisible() {
        return await (await this.buttonLocator()).isIconOnly();
    }

    public async isLabelVisible() {
        return Boolean(await (await this.buttonLocator()).label());
    }
}
