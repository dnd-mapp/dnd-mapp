import { ComponentHarness } from '@angular/cdk/testing';

export class FabHarness extends ComponentHarness {
    public static readonly hostSelector = 'button[dma-fab]';
}
