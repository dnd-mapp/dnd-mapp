import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { appConfigOptions } from './core';
import { SpellsModule } from './spells';

@Module({
    imports: [SpellsModule, ConfigModule.forRoot(appConfigOptions)],
    controllers: [AppController],
})
export class AppModule {}
