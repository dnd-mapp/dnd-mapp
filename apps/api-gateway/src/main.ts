import { tryCatch } from '@dnd-mapp/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { AppModule, RpcExceptionFilter } from './app';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, new FastifyAdapter());
    const port = process.env.PORT || 3000;

    app.useGlobalFilters(new RpcExceptionFilter());

    app.enableShutdownHooks();

    await app.listen(port);

    Logger.log(`🚀 Application is running on: http://localhost:${port}`);
}

(async () => {
    const { error } = await tryCatch(bootstrap());

    if (error) {
        console.error(error);
    }
})();
