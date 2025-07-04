import { instanceToInstance, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { app } from 'electron';
import { join } from 'path';
import { FileService } from '../file-system';
import { APP_CONFIG_FILE_NAME, APP_FOLDER_NAME, AppConfig, AppSetting, DEFAULT_APP_CONFIG } from './models';

export class ConfigService {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new ConfigService();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: ConfigService;

    private readonly fileService = FileService.instance();

    private appFolderPath: string;
    private configFilePath: string;

    private config: AppConfig;

    private constructor() {}

    private async initialize() {
        await this.verifyAppFolderExists();
        await this.retrieveStoredConfig();
    }

    public destroy(): null {
        ConfigService._instance = null;
        return null;
    }

    public getSetting<Setting extends AppSetting>(setting: Setting): AppConfig[Setting] {
        return this.config[setting];
    }

    private async verifyAppFolderExists() {
        const appDataFolderPath = app.getPath('appData');
        app.setName(APP_FOLDER_NAME);

        this.appFolderPath = join(appDataFolderPath, app.getName());
        await this.fileService.createFolder(this.appFolderPath);
    }

    private async retrieveStoredConfig() {
        this.configFilePath = join(this.appFolderPath, APP_CONFIG_FILE_NAME);
        const configContents = await this.fileService.readFile(this.configFilePath);

        if (!configContents) {
            await this.createConfig();
            return;
        }
        this.config = await this.validateConfig(configContents);
    }

    private async createConfig() {
        this.config = instanceToInstance(DEFAULT_APP_CONFIG);

        await this.fileService.writeFile(this.configFilePath, this.config);
    }

    private async validateConfig(data: unknown) {
        const parsedConfig = plainToInstance(AppConfig, data);

        const validationErrors = await validate(parsedConfig, {
            forbidNonWhitelisted: true,
            dismissDefaultMessages: true,
            forbidUnknownValues: true,
            stopAtFirstError: true,
        });

        if (validationErrors.length > 0) throw validationErrors[0];
        return parsedConfig;
    }
}
