import { withScopePackage } from '@dnd-mapp/shared-api';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { appPath } from '../constants';
import { ScopesController } from './scopes.controller';

@Module({
    imports: [ClientsModule.register([withScopePackage(appPath)])],
    controllers: [ScopesController],
})
export class ScopesModule {}
