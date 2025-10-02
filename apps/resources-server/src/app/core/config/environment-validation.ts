import { transform } from '@dnd-mapp/shared';
import { validate as validateInstance } from 'class-validator';
import { EnvironmentVariables } from './definitions';

type PlainEnvironmentVariables = Record<string, unknown>;

export async function validate(environmentVariables: PlainEnvironmentVariables) {
    const parsedConfig = transform(environmentVariables, EnvironmentVariables);

    const validationErrors = await validateInstance(parsedConfig, {
        forbidUnknownValues: true,
        stopAtFirstError: true,
    });

    if (validationErrors.length > 0) {
        const validationError = validationErrors[0];
        throw new Error(Object.values(validationError.constraints)[0]);
    }
    return parsedConfig;
}
