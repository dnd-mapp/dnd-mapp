import { DmaDesktopAppEvents, Locale, TranslationKey, Translations } from '@dnd-mapp/desktop-shared';
import { ipcMain } from 'electron';
import { join } from 'path';
import { Subject } from 'rxjs';
import { ConfigService } from '../config';
import { FileService } from '../file-system';
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
    private configService: ConfigService;
    private controllerManager: ControllerManager;

    private locale: Locale;

    private translations: Translations;

    private readonly translationsUpdatedSubject = new Subject<void>();
    public readonly translationsUpdated$ = this.translationsUpdatedSubject.asObservable();

    private constructor() {
        this.setupIpcHandlers();
    }

    private async initialize() {
        this.configService = await ConfigService.instance();
        this.controllerManager = ControllerManager.instance();

        await this.loadInitialLocale();
        await this.loadTranslations();
    }

    public destroy(): null {
        this.removeIpcHandlers();

        TranslationService._instance = null;
        return null;
    }

    public getTranslations() {
        return this.translations;
    }

    public getTranslation(key: TranslationKey) {
        return this.translations[key];
    }

    private setupIpcHandlers() {
        ipcMain.handle(DmaDesktopAppEvents.LOCALE, () => this.locale);
        ipcMain.handle(DmaDesktopAppEvents.TRANSLATIONS, () => this.translations);

        ipcMain.handle(
            DmaDesktopAppEvents.UPDATE_LOCALE,
            async (_event, locale: Locale) => await this.onLocaleUpdate(locale)
        );
    }

    private removeIpcHandlers() {
        ipcMain.removeHandler(DmaDesktopAppEvents.LOCALE);
        ipcMain.removeHandler(DmaDesktopAppEvents.TRANSLATIONS);
        ipcMain.removeHandler(DmaDesktopAppEvents.UPDATE_LOCALE);
    }

    private async loadInitialLocale() {
        this.locale = await this.configService.getSetting('locale');
    }

    private async loadTranslations() {
        const translationFilePath = join(TRANSLATION_FILES_FOLDER_PATH, `${this.locale}.json`);

        this.translations = await this.fileService.readFile(translationFilePath);

        this.controllerManager.sendIpcMessages(DmaDesktopAppEvents.TRANSLATIONS_UPDATED, this.translations);
    }

    private async onLocaleUpdate(locale: Locale) {
        this.locale = locale;

        await this.configService.updateSetting('locale', locale);
        await this.loadTranslations();
        this.translationsUpdatedSubject.next();
    }
}
