import { ConfigModuleOptions } from '@nestjs/config';
import { appConfiguration } from './app.configuration';
import { validate } from './environment-validation';

export const appConfigOptions: ConfigModuleOptions = {
    cache: true,
    envFilePath: ['.env', '../../.env'],
    expandVariables: true,
    isGlobal: true,
    load: [appConfiguration],
    validate: validate,
};
