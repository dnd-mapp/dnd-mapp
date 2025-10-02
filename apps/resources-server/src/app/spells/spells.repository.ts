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
        const queryResult = await this.databaseService.spells.findMany({
            orderBy: { name: 'asc' },
        });
        return transformAll(queryResult, Spell);
    }

    public async findOneById(spellId: string) {
        const queryResult = await this.databaseService.spells.findUnique({
            where: { id: spellId },
        });
        return transform(queryResult, Spell);
    }

    public async findOneByName(name: string) {
        const queryResult = await this.databaseService.spells.findUnique({
            where: { name: name },
        });
        return transform(queryResult, Spell);
    }

    public async create(data: CreateSpellDto) {
        const created = await this.databaseService.spells.create({
            data: {
                name: data.name,
            },
        });
        return transform(created, Spell);
    }

    public async update(data: Spell) {
        const updated = await this.databaseService.spells.update({
            where: { id: data.id },
            data: { name: data.name },
        });
        return transform(updated, Spell);
    }
}
