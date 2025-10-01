import { ConfigService } from '@nestjs/config';
import { ServeStaticModuleAsyncOptions } from '@nestjs/serve-static';
import { resolve } from 'path';

export const serveStaticConfig: ServeStaticModuleAsyncOptions = {
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => [
        {
            rootPath: resolve(configService.get<string>('clientStaticFilesPath')),
            renderPath: '*',
            serveRoot: '/app',
            useGlobalPrefix: false,
            serveStaticOptions: {
                fallthrough: true,
            },
        },
    ],
} as const;
