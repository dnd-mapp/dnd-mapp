import { instanceToInstance, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { app } from 'electron';
import { join } from 'path';
import { FileService } from '../file-system';
import { LogService } from '../logging';
import {
    APP_CONFIG_FILE_NAME,
    APP_FOLDER_NAME,
    AppConfig,
    AppSetting,
    AppSettingType,
    DEFAULT_APP_CONFIG,
} from './models';

export class ConfigService {
    public static async instance() {
        if (this._instance) return this._instance;
        this._instance = new ConfigService();
        await this._instance.initialize();

        return this._instance;
    }
    private static _instance: ConfigService;

    private readonly fileService = FileService.instance();
    private logService = LogService.withContext(ConfigService.name);

    private appFolderPath: string;
    private configFilePath: string;

    private config: AppConfig;

    private constructor() {}

    private async initialize() {
        await this.logService.info('Initializing ConfigService');
        await this.verifyAppFolderExists();
        await this.retrieveStoredConfig();
    }

    public async destroy(): Promise<null> {
        await this.logService.info('Destroying ConfigService');

        this.logService = await this.logService.destroy();
        ConfigService._instance = null;
        return null;
    }

    public async getSetting<Setting extends AppSetting>(setting: Setting) {
        await this.logService.debug(`Retrieving application setting "${setting}"`);
        return this.config[setting];
    }

    public async updateSetting<Setting extends AppSetting, SettingValue extends AppSettingType<Setting>>(
        setting: Setting,
        value: SettingValue
    ) {
        await this.logService.debug(`Updating application setting "${setting}" to value "${value}"`);
        this.config[setting] = value;

        await this.writeConfig();
    }

    private async verifyAppFolderExists() {
        await this.logService.debug('Verifying if application data folder exists');

        const appDataFolderPath = app.getPath('appData');
        app.setName(APP_FOLDER_NAME);

        this.appFolderPath = join(appDataFolderPath, app.getName());
        await this.fileService.createFolder(this.appFolderPath);
    }

    private async retrieveStoredConfig() {
        await this.logService.debug('Reading stored config from disk');

        this.configFilePath = join(this.appFolderPath, APP_CONFIG_FILE_NAME);
        const configContents = await this.fileService.readFile(this.configFilePath);

        if (!configContents) {
            await this.logService.debug('Config not found on disk. Creating config with default values');
            await this.createConfig();
            return;
        }
        this.config = await this.validateConfig(configContents);
    }

    private async createConfig() {
        this.config = instanceToInstance(DEFAULT_APP_CONFIG);

        await this.writeConfig();
    }

    private async writeConfig() {
        await this.logService.debug('Writing config to disk');
        await this.fileService.writeFile(this.configFilePath, this.config);
    }

    private async validateConfig(data: unknown) {
        await this.logService.debug('Validating retrieved config');
        const parsedConfig = plainToInstance(AppConfig, data);

        const validationErrors = await validate(parsedConfig, {
            forbidNonWhitelisted: true,
            dismissDefaultMessages: true,
            forbidUnknownValues: true,
            stopAtFirstError: true,
        });

        if (validationErrors.length > 0) {
            const error = validationErrors[0];

            await this.logService.error(
                `Config Validation failed. - Reason: ${Object.values(error.constraints)[0]}`,
                error
            );
            return null;
        }
        await this.logService.debug('Retrieved config validated successfully');
        return parsedConfig;
    }
}
