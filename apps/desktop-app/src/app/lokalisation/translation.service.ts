import { DmaDesktopAppEvents, Locale, TranslationKey, Translations } from '@dnd-mapp/desktop-shared';
import { ipcMain } from 'electron';
import { join } from 'path';
import { Subject } from 'rxjs';
import { ConfigService } from '../config';
import { FileService } from '../file-system';
import { LogService } from '../logging';
import { ControllerManager } from '../ui';
import { TRANSLATION_FILES_FOLDER_PATH } from './models';

export class TranslationService {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new TranslationService();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: TranslationService;

    private readonly fileService = FileService.instance();
    private logService = LogService.withContext(TranslationService.name);
    private configService: ConfigService;
    private controllerManager: ControllerManager;

    private locale: Locale;

    private translations: Translations;

    private readonly translationsUpdatedSubject = new Subject<void>();
    public readonly translationsUpdated$ = this.translationsUpdatedSubject.asObservable();

    private constructor() {}

    private async initialize() {
        await this.logService.info('Initializing TranslationService');

        this.configService = await ConfigService.instance();
        this.controllerManager = await ControllerManager.instance();

        await this.setupIpcHandlers();
        await this.loadInitialLocale();
        await this.loadTranslations();
    }

    public async destroy(): Promise<null> {
        await this.logService.info('Destroying TranslationService');
        await this.removeIpcHandlers();

        this.logService = await this.logService.destroy();
        TranslationService._instance = null;
        return null;
    }

    public getTranslations() {
        return this.translations;
    }

    public async getTranslation(key: TranslationKey) {
        const translation = this.translations[key];

        if (!translation) {
            await this.logService.warn(`Missing translations for key "${key}"`);
            return key;
        }
        return translation;
    }

    private async setupIpcHandlers() {
        await this.logService.debug('Setting up IPC message handlers for translations and locale');

        ipcMain.handle(DmaDesktopAppEvents.LOCALE, () => this.locale);
        ipcMain.handle(DmaDesktopAppEvents.TRANSLATIONS, () => this.translations);

        ipcMain.handle(
            DmaDesktopAppEvents.UPDATE_LOCALE,
            async (_event, locale: Locale) => await this.onLocaleUpdate(locale)
        );
    }

    private async removeIpcHandlers() {
        await this.logService.debug('Removing IPC message handlers for translations and locale');

        ipcMain.removeHandler(DmaDesktopAppEvents.LOCALE);
        ipcMain.removeHandler(DmaDesktopAppEvents.TRANSLATIONS);
        ipcMain.removeHandler(DmaDesktopAppEvents.UPDATE_LOCALE);
    }

    private async loadInitialLocale() {
        await this.logService.debug('Retrieving initial locale');

        this.locale = await this.configService.getSetting('locale');
    }

    private async loadTranslations() {
        await this.logService.debug(`Retrieving translations for locale "${this.locale}"`);

        const translationFilePath = join(TRANSLATION_FILES_FOLDER_PATH, `${this.locale}.json`);

        this.translations = await this.fileService.readFile(translationFilePath);
        await this.controllerManager.sendIpcMessages(DmaDesktopAppEvents.TRANSLATIONS_UPDATED, this.translations);
    }

    private async onLocaleUpdate(locale: Locale) {
        this.locale = locale;

        await this.configService.updateSetting('locale', locale);
        await this.loadTranslations();
        this.translationsUpdatedSubject.next();

        await this.logService.info(`Locale has been updated to "${locale}"`);
    }
}
