import {
    DEFAULT_CLIENT_STATIC_FILES_PATH,
    DEFAULT_CORS_ORIGINS,
    DEFAULT_DATABASE_HOST,
    DEFAULT_DATABASE_PORT,
    DEFAULT_DATABASE_SCHEMA,
    DEFAULT_DATABASE_USERNAME,
    DEFAULT_SERVER_HOST,
    DEFAULT_SERVER_PORT,
} from './constants';
import {
    AppConfiguration,
    EnvironmentVariableName,
    EnvironmentVariableNames,
    EnvironmentVariableType,
    SslConfiguration,
} from './definitions';

function parseNumber(value: string, fallback: number) {
    const parsed = Number.isInteger(fallback) ? Number.parseInt(value) : Number.parseFloat(value);

    if (Number.isNaN(parsed)) return fallback;
    return parsed;
}

function getValueFromEnv<T extends EnvironmentVariableType>(key: EnvironmentVariableName, fallback?: T) {
    const value = process.env[key];

    if (value === undefined && fallback !== undefined) return fallback;
    if (fallback) {
        if (typeof fallback === 'number') return parseNumber(value, fallback) as T;
        if (Array.isArray(fallback)) return value.split(',') as T;
    }
    return value as T;
}

function sslEnabled() {
    return process.env[EnvironmentVariableNames.SSL_KEY_PATH] && process.env[EnvironmentVariableNames.SSL_CERT_PATH];
}

export function appConfiguration() {
    return {
        host: getValueFromEnv(EnvironmentVariableNames.SERVER_HOST, DEFAULT_SERVER_HOST),
        port: getValueFromEnv(EnvironmentVariableNames.SERVER_PORT, DEFAULT_SERVER_PORT),
        clientStaticFilesPath: getValueFromEnv(
            EnvironmentVariableNames.CLIENT_STATIC_FILES_PATH,
            DEFAULT_CLIENT_STATIC_FILES_PATH,
        ),
        cors: {
            origins: getValueFromEnv(EnvironmentVariableNames.CORS_ALLOWED_ORIGINS, DEFAULT_CORS_ORIGINS),
        },
        ...(sslEnabled()
            ? {
                  ssl: {
                      certPath: getValueFromEnv(EnvironmentVariableNames.SSL_CERT_PATH),
                      keyPath: getValueFromEnv(EnvironmentVariableNames.SSL_KEY_PATH),
                  } satisfies SslConfiguration,
              }
            : null),
        database: {
            host: getValueFromEnv(EnvironmentVariableNames.DATABASE_HOST, DEFAULT_DATABASE_HOST),
            port: getValueFromEnv(EnvironmentVariableNames.DATABASE_PORT, DEFAULT_DATABASE_PORT),
            schema: getValueFromEnv(EnvironmentVariableNames.DATABASE_SCHEMA, DEFAULT_DATABASE_SCHEMA),
            user: getValueFromEnv(EnvironmentVariableNames.DATABASE_USER, DEFAULT_DATABASE_USERNAME),
            password: getValueFromEnv(EnvironmentVariableNames.DATABASE_PASSWORD),
        },
    } satisfies AppConfiguration;
}
