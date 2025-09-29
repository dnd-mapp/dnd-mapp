import { Injectable } from '@nestjs/common';
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
}
