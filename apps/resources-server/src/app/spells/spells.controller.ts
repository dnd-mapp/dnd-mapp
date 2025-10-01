import { Controller, Get } from '@nestjs/common';
import { SpellsService } from './spells.service';

@Controller('/spells')
export class SpellsController {
    private readonly spellsService: SpellsService;

    constructor(spellsService: SpellsService) {
        this.spellsService = spellsService;
    }

    @Get()
    public async getAll() {
        return await this.spellsService.getAll();
    }
}
