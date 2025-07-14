import { DatabaseModule } from '@dnd-mapp/shared-api';
import { Module } from '@nestjs/common';
import { PrismaClient } from '../../prisma/client';
import { AppController } from './app.controller';
import { RolesModule } from './roles';

@Module({
    imports: [DatabaseModule.forRoot(PrismaClient), RolesModule],
    controllers: [AppController],
})
export class AppModule {}
