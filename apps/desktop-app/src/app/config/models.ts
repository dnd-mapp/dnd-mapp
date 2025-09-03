import {
    DEFAULT_LOCALE,
    DEFAULT_LOG_LEVEL,
    DEFAULT_WEB_SOCKET_PORT,
    Locale,
    Locales,
    MAX_WEB_SOCKET_PORT,
    MIN_WEB_SOCKET_PORT,
    SeverityLevel,
    SeverityLevels,
} from '@dnd-mapp/shared-desktop-app';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export const APP_FOLDER_NAME = 'DnD Mapp' as const;

export const APP_CONFIG_FILE_NAME = 'config.json' as const;

export class AppConfig {
    @IsEnum(Locales, { message: ({ value }) => `"${value}" is not a valid supported locale.` })
    @IsNotEmpty({ message: 'Locale should not be an empty string.' })
    @IsString({ message: 'Locale should be a string with a valid supported Locale.' })
    public locale: Locale;

    @IsEnum(SeverityLevels, { message: ({ value }) => `"${value}" is not a valid supported LogLevel.` })
    @IsNotEmpty({ message: 'logLevel should not be an empty string.' })
    @IsString({ message: 'logLevel should be a string with a valid supported LogLevel.' })
    public logLevel: SeverityLevel;

    @Max(MAX_WEB_SOCKET_PORT)
    @Min(MIN_WEB_SOCKET_PORT)
    @IsInt()
    @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 0 })
    public webSocketPort: number;
}

export type AppSetting = keyof AppConfig;

export type AppSettingType<Setting extends AppSetting> = AppConfig[Setting];

export const DEFAULT_APP_CONFIG = plainToInstance(AppConfig, {
    locale: DEFAULT_LOCALE,
    logLevel: DEFAULT_LOG_LEVEL,
    webSocketPort: DEFAULT_WEB_SOCKET_PORT,
} satisfies AppConfig);
