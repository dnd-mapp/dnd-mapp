import { ChangeDetectionStrategy, Component, computed, ElementRef, input, viewChild } from '@angular/core';

@Component({
    selector: 'dma-option',
    templateUrl: './option.component.html',
    styleUrl: './option.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class OptionComponent<T = unknown> {
    public readonly value = input.required<T>();

    public readonly label = computed(() => this.labelElementRef().nativeElement.textContent);

    private readonly labelElementRef = viewChild.required<ElementRef<HTMLElement>>('label');
}
