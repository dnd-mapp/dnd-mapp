import { Module } from '@nestjs/common';
import { ScopesController } from './scopes.controller';
import { ScopesRepository } from './scopes.repository';
import { ScopesService } from './scopes.service';

@Module({
    controllers: [ScopesController],
    providers: [ScopesRepository, ScopesService],
    exports: [ScopesService],
})
export class ScopesModule {}
