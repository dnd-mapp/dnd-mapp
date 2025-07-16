import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RolesModule } from './roles';
import { ScopesModule } from './scopes';
import { UsersModule } from './users';

@Module({
    imports: [UsersModule, RolesModule, ScopesModule],
    controllers: [AppController],
})
export class AppModule {}
