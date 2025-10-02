import { CreateSpellDto, Spell } from '@dnd-mapp/shared';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
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

    @Post()
    public async create(@Body() data: CreateSpellDto, @Res({ passthrough: true }) response: FastifyReply) {
        const created = await this.spellsService.create(data);
        const url = response.request.url;

        response.code(HttpStatus.CREATED).headers({ location: `${url}/${created.id}` });
        return created;
    }

    @Get('/:spellId')
    public async getById(@Param('spellId') spellId: string) {
        const queryResult = await this.spellsService.getById(spellId);

        if (!queryResult) {
            throw new NotFoundException();
        }
        return queryResult;
    }

    @Put('/:spellId')
    public async update(@Param('spellId') spellId: string, @Body() data: Spell) {
        if (spellId !== data.id) {
            throw new BadRequestException();
        }
        return await this.spellsService.update(data);
    }

    @Delete('/:spellId')
    public async remove(@Param('spellId') spellId: string, @Res({ passthrough: true }) response: FastifyReply) {
        await this.spellsService.remove(spellId);

        response.status(HttpStatus.NO_CONTENT);
    }
}
