import { Locale, Locales, SeverityLevel, SeverityLevels } from '@dnd-mapp/shared-desktop-app';

interface SettingOption<T> {
    label: string;
    value: T;
}

type LocaleOptions = SettingOption<Locale>;

export const localeOptions: LocaleOptions[] = [
    { label: 'English', value: Locales.EN_US },
    { label: 'Nederlands', value: Locales.NL_NL },
] as const;

type LogLevelOption = SettingOption<SeverityLevel>;

export const logLevelOptions: LogLevelOption[] = [
    { label: 'INFO', value: SeverityLevels.INFO },
    { label: 'DEBUG', value: SeverityLevels.DEBUG },
    { label: 'WARN', value: SeverityLevels.WARNING },
    { label: 'ERROR', value: SeverityLevels.ERROR },
];
