import { Component, input } from '@angular/core';

/** What the logo shows: the mark with the wordmark, or the mark alone where space is short. */
export type LogoKind = 'full' | 'mark';

/** How large the logo draws: large for headers, small for menus and footers. */
export type LogoSize = 'large' | 'small';

/**
 * The D&D Mapp logo. It names itself "D&D Mapp" to assistive technology in every variant, so a link around it takes
 * that name. The link home stays with whoever places the logo.
 */
@Component({
    selector: 'dma-logo',
    templateUrl: './logo.component.html',
    styleUrl: './logo.component.scss',
    host: {
        'role': 'img',
        'aria-label': 'D&D Mapp',
        '[class.small]': "size() === 'small'",
    },
})
export class LogoComponent {
    public readonly kind = input<LogoKind>('full');
    public readonly size = input<LogoSize>('large');
}
