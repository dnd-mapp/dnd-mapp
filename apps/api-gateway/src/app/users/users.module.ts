import { withUserPackage } from '@dnd-mapp/shared-api';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UsersController } from './users.controller';

@Module({
    imports: [ClientsModule.register([withUserPackage()])],
    controllers: [UsersController],
})
export class UsersModule {}
