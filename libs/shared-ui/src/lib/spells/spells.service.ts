import { inject, Injectable } from '@angular/core';
import { CreateSpellDto, Spell, transform, transformAll } from '@dnd-mapp/shared';
import { map } from 'rxjs';
import { ResourcesServerService } from '../http';

@Injectable({ providedIn: 'root' })
export class SpellsService {
    private readonly resourcesServerService = inject(ResourcesServerService);

    private readonly basePath = '/spells';

    public getAll() {
        return this.resourcesServerService
            .get<Spell[]>(this.basePath)
            .pipe(map((response) => transformAll(response.body, Spell)));
    }

    public getById(spellId: string) {
        return this.resourcesServerService
            .get<Spell>(`${this.basePath}/${spellId}`)
            .pipe(map((response) => transform(response.body, Spell)));
    }

    public create(data: CreateSpellDto) {
        return this.resourcesServerService
            .post<Spell, CreateSpellDto>(`${this.basePath}`, data)
            .pipe(map((response) => transform(response.body, Spell)));
    }

    public update(data: Spell) {
        return this.resourcesServerService
            .put<Spell>(`${this.basePath}/${data.id}`, data)
            .pipe(map((response) => transform(response.body, Spell)));
    }

    public remove(spellId: string) {
        return this.resourcesServerService.delete(`${this.basePath}/${spellId}`);
    }
}
