import { Component, ViewEncapsulation } from '@angular/core';

/**
 * A full-width band of a page, drawn on the `<section>` it is placed on. It projects its content, such as a Section
 * intro and what follows it, into a column at most the content width wide, centered in the band, and stacks it with
 * the section gap. Its padding and gap follow the Viewport tokens, so it needs no input for the viewport.
 *
 * The styles reach the projected children, which emulated encapsulation leaves out, so the component turns
 * encapsulation off and scopes every rule to its own selector instead.
 */
@Component({
    selector: 'section[dma-section]',
    templateUrl: './section.component.html',
    styleUrl: './section.component.scss',
    encapsulation: ViewEncapsulation.None,
})
export class SectionComponent {}
