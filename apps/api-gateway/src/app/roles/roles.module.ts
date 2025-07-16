import { withRolePackage } from '@dnd-mapp/shared-api';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { appPath } from '../constants';
import { RolesController } from './roles.controller';

@Module({
    imports: [ClientsModule.register([withRolePackage(appPath)])],
    controllers: [RolesController],
})
export class RolesModule {}
