import { CreateSpellDto, Spell, transform, transformAll } from '@dnd-mapp/shared';
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

    public async findOneByName(name: string) {
        const result = await this.databaseService.spells.findUnique({
            where: { name: name },
        });
        return transform(result, Spell);
    }

    public async create(data: CreateSpellDto) {
        const created = await this.databaseService.spells.create({
            data: {
                name: data.name,
            },
        });
        return transform(created, Spell);
    }
}
