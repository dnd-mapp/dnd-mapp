import { Transform } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { PORT_RANGE_MAX, PORT_RANGE_MIN } from './constants';

export const EnvironmentVariableNames = {
    SERVER_HOST: 'SERVER_HOST',
    SERVER_PORT: 'SERVER_PORT',
    SSL_CERT_PATH: 'SSL_CERT_PATH',
    SSL_KEY_PATH: 'SSL_KEY_PATH',
    CORS_ALLOWED_ORIGINS: 'CORS_ALLOWED_ORIGINS',
    DATABASE_HOST: 'DATABASE_HOST',
    DATABASE_PORT: 'DATABASE_PORT',
    DATABASE_SCHEMA: 'DATABASE_SCHEMA',
    DATABASE_USER: 'DATABASE_USER',
    DATABASE_PASSWORD: 'DATABASE_PASSWORD',
} as const;

export type EnvironmentVariableName = (typeof EnvironmentVariableNames)[keyof typeof EnvironmentVariableNames];

export type EnvironmentVariableType = string | number | string[];

export class EnvironmentVariables {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    [EnvironmentVariableNames.SERVER_HOST]?: string;

    @Min(PORT_RANGE_MIN)
    @Max(PORT_RANGE_MAX)
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @IsOptional()
    [EnvironmentVariableNames.SERVER_PORT]?: number;

    @IsString({ each: true })
    @ArrayNotEmpty()
    @IsArray()
    @IsOptional()
    @Transform(({ value }) => ((value as string) || '').split(','))
    [EnvironmentVariableNames.CORS_ALLOWED_ORIGINS]?: string[];

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    [EnvironmentVariableNames.SSL_CERT_PATH]?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    [EnvironmentVariableNames.SSL_KEY_PATH]?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    [EnvironmentVariableNames.DATABASE_HOST]?: string;

    @Min(PORT_RANGE_MIN)
    @Max(PORT_RANGE_MAX)
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    @IsOptional()
    [EnvironmentVariableNames.DATABASE_PORT]?: number;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    [EnvironmentVariableNames.DATABASE_SCHEMA]?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    [EnvironmentVariableNames.DATABASE_USER]?: string;

    @IsNotEmpty()
    @IsString()
    [EnvironmentVariableNames.DATABASE_PASSWORD]: string;
}

export interface DatabaseConfiguration {
    host: string;
    port: number;
    schema: string;
    user: string;
    password: string;
}

export interface CorsConfiguration {
    origins: string[];
}

export interface SslConfiguration {
    certPath: string;
    keyPath: string;
}

export interface AppConfiguration {
    host: string;
    port: number;
    cors: CorsConfiguration;
    database: DatabaseConfiguration;
    ssl?: SslConfiguration;
}
