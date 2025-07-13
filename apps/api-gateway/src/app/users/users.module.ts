import { withUserPackage } from '@dnd-mapp/shared-api';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { appPath } from '../constants';
import { UsersController } from './users.controller';

@Module({
    imports: [ClientsModule.register([withUserPackage(appPath)])],
    controllers: [UsersController],
})
export class UsersModule {}
