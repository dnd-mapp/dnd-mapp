import { tryCatchAsync } from '@dnd-mapp/shared';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app';
import { AppModule, configureCors } from './app';

async function bootstrapApp() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());

    configService = app.get(ConfigService);

    const origins = configService.get<string[]>('cors.origins');

    app.enableCors(configureCors(origins));
    app.enableShutdownHooks();

    const port = process.env['PORT'] || 4300;
    await app.listen(port);

    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

async function bootstrap() {
    const { error } = await tryCatchAsync(bootstrapApp());

    if (error) {
        console.error(error);
    }
}

(async () => await bootstrap())();
