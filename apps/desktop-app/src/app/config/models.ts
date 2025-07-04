import { DEFAULT_LOCALE, Locale, Locales } from '@dnd-mapp/desktop-shared';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export const APP_FOLDER_NAME = 'DnD Mapp' as const;

export const APP_CONFIG_FILE_NAME = 'config.json' as const;

export class AppConfig {
    @IsEnum(Locales)
    @IsNotEmpty()
    @IsString()
    public locale: Locale;
}

export type AppSetting = keyof AppConfig;

export const DEFAULT_APP_CONFIG = plainToInstance(AppConfig, {
    locale: DEFAULT_LOCALE,
});
