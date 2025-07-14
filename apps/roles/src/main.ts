import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule, transportOptionsProvider } from './app';

async function bootstrap() {
    const microservice = await NestFactory.createMicroservice(AppModule, transportOptionsProvider);

    await microservice.listen();

    Logger.log(`🚀 Microservice is running`);
}

(async () => {
    try {
        await bootstrap();
    } catch (error) {
        console.error(error);
    }
})();
