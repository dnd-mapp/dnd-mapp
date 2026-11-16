import { Component, input, ViewEncapsulation } from '@angular/core';
import { cardBackgroundAttr, DEFAULT_CARD_BACKGROUND } from './card.types';

/**
 * A block of related content, alone or in a grid: a title and text, both projected. The heading is the title and the
 * `<p>` the text, so whoever places it picks the heading level. A card is not a control, so it takes no focus and
 * emits nothing.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'dma-card',
    templateUrl: './card.component.html',
    styleUrl: './card.component.scss',
    encapsulation: ViewEncapsulation.None,
    host: {
        '[class.raised]': "background() === 'raised'",
    },
})
export class CardComponent {
    public readonly background = input(DEFAULT_CARD_BACKGROUND, { transform: cardBackgroundAttr });
}
