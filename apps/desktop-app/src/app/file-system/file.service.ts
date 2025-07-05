import { tryCatch } from '@dnd-mapp/shared';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';
import { LogService } from '../logging';

const JSON_STRINGIFY_SPACER = 4;

export class FileService {
    public static instance() {
        if (this._instance) return this._instance;
        this._instance = new FileService();

        return this._instance;
    }
    private static _instance: FileService;

    private logService = LogService.withContext(FileService.name);

    public async doesPathExists(path: string) {
        await this.logService.debug(`Validating existence of path "${path}"`);
        const { error: statError } = await tryCatch(stat(path));

        if (statError) {
            if ('code' in statError && statError.code === 'ENOENT') {
                await this.logService.warn(`Path does not exist`);
                return false;
            }
            await this.logService.error(`Something unexpected went wrong while get path stats`, statError);
        }
        return true;
    }

    public async createFolder(folderPath: string) {
        await this.logService.debug(`Creating folder "${folderPath}"`);
        if (await this.doesPathExists(folderPath)) {
            await this.logService.debug(`Folder already exists`);
            return;
        }
        const { error: createFolderError } = await tryCatch(mkdir(folderPath, { recursive: true }));

        if (createFolderError) {
            await this.logService.warn(`Something went wrong while creating folder "${folderPath}"`, createFolderError);
        }
    }

    public async readFile<T>(filePath: string) {
        await this.logService.debug(`Reading file on path "${filePath}"`);
        if (!(await this.doesPathExists(filePath))) return null;
        const { data: fileContents, error: readError } = await tryCatch(readFile(filePath, { encoding: 'utf8' }));

        if (readError) {
            await this.logService.warn(`Something went wrong while reading file on path "${filePath}"`, readError);
        }
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
}
