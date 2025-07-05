import { DEFAULT_LOCALE, Locale, Locales } from '@dnd-mapp/desktop-shared';
import { plainToInstance } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export const APP_FOLDER_NAME = 'DnD Mapp' as const;

export const APP_CONFIG_FILE_NAME = 'config.json' as const;

export class AppConfig {
    @IsEnum(Locales, { message: ({ value }) => `"${value}" is not a valid supported locale.` })
    @IsNotEmpty({ message: 'Locale should not be an empty string.' })
    @IsString({ message: 'Locale should be a string with a valid supported Locale.' })
    public locale: Locale;
}

export type AppSetting = keyof AppConfig;

export type AppSettingType<Setting extends AppSetting> = AppConfig[Setting];

export const DEFAULT_APP_CONFIG = plainToInstance(AppConfig, {
    locale: DEFAULT_LOCALE,
});
