export const Locales = {
    EN_US: 'enUS',
    NL_NL: 'nlNL',
} as const;

export type Locale = (typeof Locales)[keyof typeof Locales];

export const DEFAULT_LOCALE = Locales.EN_US;

export interface Translations {
    APP_NAME: string;
    BUTTON_LABEL_SHOW_NOTIFICATION: string;
    CHECKBOX_LABEL_NOTIFICATION_SILENT: string;
    INPUT_LABEL_NOTIFICATION_BODY: string;
    INPUT_LABEL_NOTIFICATION_TITLE: string;
    NAV_LABEL_NOTIFICATIONS: string;
    TRAY_MENU_BUTTON_LABEL_CLOSE_DEVTOOLS: string;
    TRAY_MENU_BUTTON_LABEL_OPEN_DEVTOOLS: string;
    TRAY_MENU_BUTTON_LABEL_QUIT: string;
}

export type TranslationKey = keyof Translations;
