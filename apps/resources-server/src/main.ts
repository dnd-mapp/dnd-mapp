import { tryCatchAsync } from '@dnd-mapp/shared';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { readFile } from 'fs/promises';
import { AppModule, configureCors, SslConfiguration } from './app';

async function bootstrapApp() {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    let configService = appContext.get(ConfigService);

    const ssl = configService.get<SslConfiguration>('ssl');

    const sslEnabled = Boolean(ssl);
    let sslKey: string = null;
    let sslCert: string = null;

    if (sslEnabled) {
        sslKey = await readFile(ssl.keyPath, { encoding: 'utf8' });
        sslCert = await readFile(ssl.certPath, { encoding: 'utf8' });
    }
    await appContext.close();

    const app = await NestFactory.create(
        AppModule,
        new FastifyAdapter({
            ...(sslEnabled
                ? {
                      https: {
                          key: sslKey,
                          cert: sslCert,
                      },
                  }
                : null),
        }),
    );
    configService = app.get(ConfigService);

    const origins = configService.get<string[]>('cors.origins');

    app.enableCors(configureCors(origins));
    app.enableShutdownHooks();

    const port = configService.get<number>('port');
    const host = configService.get<string>('host');

    await app.listen(port, host, async () => {
        Logger.log(`🚀 Application is running on: http${sslEnabled ? 's' : ''}://${host}:${port}/server`);
    });
}

async function bootstrap() {
    const { error } = await tryCatchAsync(bootstrapApp());

    if (error) {
        console.error(error);
    }
}

(async () => await bootstrap())();
