import { Component, ViewEncapsulation } from '@angular/core';

/**
 * The opening of a content section, drawn on the `<hgroup>` it is placed on: an eyebrow, a heading, and intro text,
 * all projected. The `<p>` before the heading is the eyebrow and the `<p>` after it the intro text, so whoever places
 * it picks the heading level.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'hgroup[dma-section-intro]',
    templateUrl: './section-intro.component.html',
    styleUrl: './section-intro.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class SectionIntroComponent {}
