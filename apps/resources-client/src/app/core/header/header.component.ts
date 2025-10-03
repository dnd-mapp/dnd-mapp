import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
    AppBarComponent,
    BarsSoIconComponent,
    ButtonComponent,
    IndentSoIconComponent,
    NavBrandComponent,
    SideSheetService,
    ToggleSideSheetButtonDirective,
} from '@dnd-mapp/shared-ui';
import { NavSidePanelComponent } from '../nav-side-panel';

@Component({
    selector: 'dma-header',
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        AppBarComponent,
        BarsSoIconComponent,
        ButtonComponent,
        IndentSoIconComponent,
        ToggleSideSheetButtonDirective,
        NavBrandComponent,
    ],
})
export class HeaderComponent implements OnInit, OnDestroy {
    private readonly sideSheetService = inject(SideSheetService);

    public ngOnInit() {
        this.sideSheetService.setComponent(NavSidePanelComponent);
    }

    public ngOnDestroy() {
        this.sideSheetService.destroy();
    }
}
