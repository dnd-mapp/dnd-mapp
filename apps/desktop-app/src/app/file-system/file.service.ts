import { tryCatch } from '@dnd-mapp/shared';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { LogService } from '../logging';

const JSON_STRINGIFY_SPACER = 4;

export class FileService {
    public static instance() {
        if (this._instance) return this._instance;
        this._instance = new FileService();

        return this._instance;
    }
    private static _instance: FileService;

    private logService = LogService.withContext('FileService');

    private constructor() {}

    public async createFolder(folderPath: string) {
        await this.logService.debug(`Creating folder "${folderPath}"`);
        const { error: createFolderError } = await tryCatch(mkdir(folderPath, { recursive: true }));

        if (createFolderError) {
            await this.logService.warn(`Something went wrong while creating folder "${folderPath}"`, createFolderError);
        }
    }

    public async readFileText(filePath: string) {
        return await this.readFile(filePath);
    }

    public async readFileJSON<T>(filePath: string) {
        const fileContents = await this.readFile(filePath);
        return JSON.parse(fileContents) as T;
    }

    public async writeFile<T>(filePath: string, data: T) {
        await this.logService.debug(`Writing file on path "${filePath}"`);
        const fileContents = JSON.stringify(data, null, JSON_STRINGIFY_SPACER);

        const { error: writeError } = await tryCatch(writeFile(filePath, `${fileContents}\n`));

        if (writeError) {
            await this.logService.warn(`Something went wrong while writing file on path "${filePath}"`, writeError);
        }
    }

    private async readFile(filePath: string) {
        await this.logService.debug(`Reading file on path "${filePath}"`);
        const { data: fileContents, error: readError } = await tryCatch(readFile(filePath, { encoding: 'utf8' }));

        if (readError) {
            if ('code' in readError && readError.code === 'ENOENT') {
                await this.logService.warn(`File does not exist on Path "${filePath}"`);
                return null;
            }
            await this.logService.warn(`Something went wrong while reading file on path "${filePath}"`, readError);
            return null;
        }
        return fileContents;
    }
}
