import { ComponentHarness } from '@angular/cdk/testing';

export class RootHarness extends ComponentHarness {
    public static readonly hostSelector = 'dma-root';

    private readonly paragraphLocator = this.locatorFor('p');

    public async paragraphContents(): Promise<string> {
        return await (await this.paragraphLocator()).text();
    }
}
