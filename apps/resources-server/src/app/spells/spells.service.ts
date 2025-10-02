import { CreateSpellDto } from '@dnd-mapp/shared';
import { BadRequestException, Injectable } from '@nestjs/common';
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

    private async getByName(name: string) {
        return await this.spellsRepository.findOneByName(name);
    }

    private async isNameTaken(name: string) {
        return Boolean(await this.getByName(name));
    }
}
