import { DatabaseModule } from '@dnd-mapp/shared-api';
import { Module } from '@nestjs/common';
import { PrismaClient } from '../../prisma/client';
import { AppController } from './app.controller';
import { UsersModule } from './users';

@Module({
    imports: [DatabaseModule.forRoot(PrismaClient), UsersModule],
    controllers: [AppController],
})
export class AppModule {}
