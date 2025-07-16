import { tryCatch } from '@dnd-mapp/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app/app.module';

async function bootstrap() {
    const port = process.env['PORT'] || 7200;

    const app = await NestFactory.createMicroservice(AppModule, {
        transport: Transport.TCP,
        options: {
            host: '0.0.0.0',
            port: port,
        },
    });

    await app.listen();

    Logger.log(`🚀 Application is running on: tcp://localhost:${port}`);
}

(async () => {
    const { error } = await tryCatch(bootstrap());

    if (error) {
        console.error(error);
    }
})();
