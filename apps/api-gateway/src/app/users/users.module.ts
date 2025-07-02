import { withUserPackage } from '@dnd-mapp/dma-api-shared';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { UsersController } from './users.controller';

const basePath = process.env['NODE_ENV'] === 'production' ? '' : '../../dist/apps/users';

@Module({
    imports: [ClientsModule.register([withUserPackage(basePath)])],
    controllers: [UsersController],
})
export class UsersModule {}
