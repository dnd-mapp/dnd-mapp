import { ChangeDetectionStrategy, Component, HostBinding, Input, numberAttribute, signal } from '@angular/core';

@Component({
    selector: 'dma-table-column',
    templateUrl: './table-column.component.html',
    styleUrl: './table-column.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableColumnComponent {
    @HostBinding('style.flex-basis.%')
    @Input({ transform: numberAttribute })
    public set width(percentage: number) {
        this._width.set(percentage);
    }

    public get width() {
        return this._width();
    }

    private _width = signal(100);
}
