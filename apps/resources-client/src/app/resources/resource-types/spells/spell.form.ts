import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SpellsService } from '@dnd-mapp/shared-ui';
import { ResourcesService } from '../../resources.service';

@Component({
    selector: 'dma-spell-form',
    templateUrl: './spell.form.html',
    styleUrl: './spell.form.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [],
})
export class SpellForm implements OnInit {
    protected readonly resourcesService = inject(ResourcesService);
    private readonly destroyRef = inject(DestroyRef);
    private readonly spellsService = inject(SpellsService);

    public ngOnInit() {
        this.spellsService
            .getAll()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (spells) => this.resourcesService.resources.set(spells),
            });
    }
}
