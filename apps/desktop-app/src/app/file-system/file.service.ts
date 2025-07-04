import { tryCatch } from '@dnd-mapp/shared';
import { mkdir, readFile, stat, writeFile } from 'fs/promises';

const JSON_STRINGIFY_SPACER = 4;

export class FileService {
    public static instance() {
        if (this._instance) return this._instance;
        this._instance = new FileService();

        return this._instance;
    }
    private static _instance: FileService;

    public async doesPathExists(path: string) {
        const { error: statError } = await tryCatch(stat(path));

        if (statError) {
            if ('code' in statError && statError.code === 'ENOENT') return false;
            console.error(statError);
        }
        return true;
    }

    public async createFolder(folderPath: string) {
        if (await this.doesPathExists(folderPath)) return;

        const { error: createFolderError } = await tryCatch(mkdir(folderPath, { recursive: true }));

        if (createFolderError) {
            console.error(createFolderError);
        }
    }

    public async readFile<T>(filePath: string) {
        if (!(await this.doesPathExists(filePath))) return null;
        const { data: fileContents, error: readError } = await tryCatch(readFile(filePath, { encoding: 'utf8' }));

        if (readError) {
            console.error(readError);
        }
        return JSON.parse(fileContents) as T;
    }

    public async writeFile<T>(filePath: string, data: T) {
        const fileContents = JSON.stringify(data, null, JSON_STRINGIFY_SPACER);

        const { error: writeError } = await tryCatch(writeFile(filePath, `${fileContents}\n`));

        if (writeError) {
            console.error(writeError);
        }
    }
}
