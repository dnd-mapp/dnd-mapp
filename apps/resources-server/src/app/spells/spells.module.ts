import { Module } from '@nestjs/common';
import { SpellsController } from './spells.controller';
import { SpellsRepository } from './spells.repository';
import { SpellsService } from './spells.service';

@Module({
    imports: [],
    controllers: [SpellsController],
    providers: [SpellsRepository, SpellsService],
    exports: [SpellsService],
})
export class SpellsModule {}
