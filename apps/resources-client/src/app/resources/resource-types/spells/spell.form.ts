import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ResourcesService } from '../../resources.service';

@Component({
    selector: 'dma-spell-form',
    templateUrl: './spell.form.html',
    styleUrl: './spell.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class SpellForm {
    protected readonly resourcesService = inject(ResourcesService);
}
