import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LoginButtonComponent, SignupButtonComponent } from '../../auth';

@Component({
    selector: 'dma-side-panel-footer',
    templateUrl: './side-panel-footer.component.html',
    styleUrl: './side-panel-footer.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [LoginButtonComponent, SignupButtonComponent],
})
export class SidePanelFooterComponent {}
