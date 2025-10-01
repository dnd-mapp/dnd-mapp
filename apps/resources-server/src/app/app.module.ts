import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { AppController } from './app.controller';
import { appConfigOptions, serveStaticConfig } from './core';
import { SpellsModule } from './spells';

@Module({
    imports: [ConfigModule.forRoot(appConfigOptions), ServeStaticModule.forRootAsync(serveStaticConfig), SpellsModule],
    controllers: [AppController],
})
export class AppModule {}
