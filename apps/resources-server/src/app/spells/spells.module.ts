import { Module } from '@nestjs/common';
import { DatabaseModule } from '../shared';
import { SpellsController } from './spells.controller';
import { SpellsRepository } from './spells.repository';
import { SpellsService } from './spells.service';

@Module({
    imports: [DatabaseModule],
    controllers: [SpellsController],
    providers: [SpellsRepository, SpellsService],
    exports: [SpellsService],
})
export class SpellsModule {}
