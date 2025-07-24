import { tryCatch } from '@dnd-mapp/shared';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule, transportOptionsProvider } from './app';

async function bootstrap() {
    const microservice = await NestFactory.createMicroservice(AppModule, transportOptionsProvider);

    await microservice.listen();

    Logger.log(`🚀 Microservice is running`);
}

(async () => {
    const { error } = await tryCatch(bootstrap());

    if (error) {
        console.error(error);
    }
})();
