import { plainToInstance } from 'class-transformer';
import { validate as validateInstance } from 'class-validator';
import { EnvironmentVariables } from './definitions';

type PlainEnvironmentVariables = Record<string, unknown>;

export async function validate(environmentVariables: PlainEnvironmentVariables) {
    const parsedConfig = plainToInstance(EnvironmentVariables, environmentVariables, {
        enableImplicitConversion: true,
    });

    const validationErrors = await validateInstance(parsedConfig, {
        forbidUnknownValues: true,
        stopAtFirstError: true,
    });

    if (validationErrors) {
        const validationError = validationErrors[0];
        throw new Error(Object.values(validationError.constraints)[0]);
    }
    return parsedConfig;
}
