import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    AppBarComponent,
    BarsSoIconComponent,
    ButtonComponent,
    IndentSoIconComponent,
    ThemeDirective,
    ToggleSideSheetButtonDirective,
} from '../../shared';

@Component({
    selector: 'dma-root',
    templateUrl: './root.component.html',
    styleUrl: './root.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [
        AppBarComponent,
        BarsSoIconComponent,
        ButtonComponent,
        ToggleSideSheetButtonDirective,
        IndentSoIconComponent,
    ],
})
export class RootComponent {}
