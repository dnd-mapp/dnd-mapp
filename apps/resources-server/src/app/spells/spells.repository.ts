import { Spell, transformAll } from '@dnd-mapp/shared';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../shared';

@Injectable()
export class SpellsRepository {
    private readonly databaseService: DatabaseService;

    constructor(databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async findAll() {
        const results = await this.databaseService.spells.findMany({
            orderBy: { name: 'asc' },
        });

        return transformAll(results, Spell);
    }
}
