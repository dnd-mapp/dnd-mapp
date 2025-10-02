import { CreateSpellDto, Spell } from '@dnd-mapp/shared';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SpellsRepository } from './spells.repository';

@Injectable()
export class SpellsService {
    private readonly spellsRepository: SpellsRepository;

    constructor(spellsRepository: SpellsRepository) {
        this.spellsRepository = spellsRepository;
    }

    public async getAll() {
        return await this.spellsRepository.findAll();
    }

    public async getById(spellId: string) {
        return await this.spellsRepository.findOneById(spellId);
    }

    public async create(data: CreateSpellDto) {
        if (await this.isNameTaken(data.name)) {
            throw new BadRequestException();
        }
        return await this.spellsRepository.create(data);
    }

    public async update(data: Spell) {
        if (!(await this.spellExists(data.id))) {
            throw new NotFoundException();
        }
        if (await this.isNameTaken(data.name, data.id)) {
            throw new BadRequestException();
        }
        return await this.spellsRepository.update(data);
    }

    public async remove(spellId: string) {
        if (!(await this.spellExists(spellId))) {
            throw new NotFoundException();
        }
        await this.spellsRepository.remove(spellId);
    }

    private async getByName(name: string) {
        return await this.spellsRepository.findOneByName(name);
    }

    private async spellExists(spellId: string) {
        return Boolean(await this.getById(spellId));
    }

    private async isNameTaken(name: string, spellId: string = null) {
        const queryResult = await this.getByName(name);
        return queryResult !== null && (spellId === null || spellId !== queryResult.id);
    }
}
