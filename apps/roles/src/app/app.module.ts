import { DatabaseModule } from '@dnd-mapp/shared-api';
import { Module } from '@nestjs/common';
import { PrismaClient } from '../../prisma/client';
import { AppController } from './app.controller';
import { RolesModule } from './roles';
import { ScopesModule } from './scopes';

@Module({
    imports: [DatabaseModule.forRoot(PrismaClient), RolesModule, ScopesModule],
    controllers: [AppController],
})
export class AppModule {}
