import { tryCatchAsync } from '@dnd-mapp/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule } from './app';

async function bootstrapApp() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());

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
