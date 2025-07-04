import { join } from 'path';
import { ConfigService } from '../config';
import { FileService } from '../file-system';
import { Locale, TRANSLATION_FILES_FOLDER_PATH, Translations } from './models';

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

    private _translations: Translations;

    private constructor() {}

    private async initialize() {
        this.configService = await ConfigService.instance();

        this.locale = this.configService.getSetting('locale');
        await this.getTranslations();
    }

    public destroy(): null {
        TranslationService._instance = null;
        return null;
    }

    public get translations() {
        return this._translations;
    }

    private async getTranslations() {
        const translationFilePath = join(TRANSLATION_FILES_FOLDER_PATH, `${this.locale}.json`);

        this._translations = await this.fileService.readFile(translationFilePath);
    }
}
