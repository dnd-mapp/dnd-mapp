import { Component, input, ViewEncapsulation } from '@angular/core';
import { DEFAULT_SECTION_INTRO_ALIGN, sectionIntroAlignAttr } from './section-intro.types';

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
    host: {
        '[class.center]': "align() === 'center'",
    },
})
export class SectionIntroComponent {
    public readonly align = input(DEFAULT_SECTION_INTRO_ALIGN, { transform: sectionIntroAlignAttr });
}
