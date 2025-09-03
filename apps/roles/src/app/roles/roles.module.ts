import { Module } from '@nestjs/common';
import { ScopesModule } from '../scopes';
import { RolesController } from './roles.controller';
import { RolesRepository } from './roles.repository';
import { RolesService } from './roles.service';

@Module({
    imports: [ScopesModule],
    controllers: [RolesController],
    providers: [RolesRepository, RolesService],
    exports: [RolesService],
})
export class RolesModule {}
