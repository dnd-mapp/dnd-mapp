import { Locale, Translations } from '@dnd-mapp/desktop-shared';
import { join } from 'path';
import { ConfigService } from '../config';
import { FileService } from '../file-system';
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

    private locale: Locale;

    private translations: Translations;

    private constructor() {}

    private async initialize() {
        this.configService = await ConfigService.instance();

        this.locale = this.configService.getSetting('locale');
        await this.loadTranslations();
    }

    public destroy(): null {
        TranslationService._instance = null;
        return null;
    }

    public getTranslations() {
        return this.translations;
    }

    private async loadTranslations() {
        const translationFilePath = join(TRANSLATION_FILES_FOLDER_PATH, `${this.locale}.json`);

        this.translations = await this.fileService.readFile(translationFilePath);
    }
}
