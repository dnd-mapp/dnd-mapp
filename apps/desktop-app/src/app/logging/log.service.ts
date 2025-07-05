import {
    DmaDesktopAppEvents,
    fromLevelToPriority,
    fromPriorityToLevel,
    SeverityLevel,
    SeverityLevels,
    SeverityPriorityLevel,
} from '@dnd-mapp/desktop-shared';
import { ipcMain } from 'electron';
import { ConfigService } from '../config';
import { ConsoleLogger } from './loggers';
import { createLogObject, LogData, Loggers } from './models';

const logContexts = new Map<string, LogService>();

export class LogService {
    public static withContext(context: string, root = false) {
        if (logContexts.has(context)) return logContexts.get(context);
        const logService = new LogService(context, root);

        logContexts.set(context, logService);
        return logService;
    }
    private static rootLogger: LogService;

    private configService: ConfigService;

    private readonly context: string;
    private readonly root: boolean;

    /** Only used by the rootLogger. */
    private loggers: Loggers = [];
    private bufferedLogs: LogData[] = [];
    private logLevel: SeverityPriorityLevel;

    private constructor(context: string, root: boolean) {
        this.context = context;
        this.root = root;

        if (root) LogService.rootLogger = this;
    }

    public async initialize() {
        if (!this.root) return;
        await this.info('Initializing LogService');

        this.configService = await ConfigService.instance();
        await this.setupIpcHandlers();

        this.logLevel = fromLevelToPriority(await this.configService.getSetting('logLevel'));

        this.loggers = [new ConsoleLogger()];
        await Promise.all(this.loggers.map((logger) => logger.initialize()));
    }

    public async destroy(): Promise<null> {
        await this.info(`Destroying LogService of context "${this.context}"`);
        if (!this.root) {
            logContexts.delete(this.context);
            return null;
        }
        await this.removeIpcHandlers();

        const remainingLogServices = [...logContexts.values()].filter(({ root }) => !root);

        for (const logService of remainingLogServices) {
            await logService.destroy();
        }
        await Promise.all(this.rootLogger.loggers.map((logger) => logger.destroy()));
        this.rootLogger.loggers = [];

        logContexts.delete(this.context);
        return null;
    }

    public async info(message: string) {
        await this.log(createLogObject(SeverityLevels.INFO, this.context, message));
    }

    public async debug(message: string) {
        await this.log(createLogObject(SeverityLevels.DEBUG, this.context, message));
    }

    public async warn(message: string, data?: unknown) {
        await this.log(createLogObject(SeverityLevels.WARNING, this.context, message, data));
    }

    public async error(message: string, data?: unknown) {
        await this.log(createLogObject(SeverityLevels.ERROR, this.context, message, data));
    }

    private async log(logData: LogData) {
        if (!this.isInitialized) {
            this.rootLogger.bufferedLogs = [...this.rootLogger.bufferedLogs, logData];
            return;
        }
        if (this.hasBufferedLogs) await this.processBufferedLogs();
        await this.processLog(logData);
    }

    private async setupIpcHandlers() {
        await this.rootLogger.debug('Setting up IPC message handlers for log level requests');

        ipcMain.handle(DmaDesktopAppEvents.LOG_LEVEL, () => fromPriorityToLevel(this.logLevel));
        ipcMain.handle(
            DmaDesktopAppEvents.UPDATE_LOG_LEVEL,
            async (_event, logLevel: SeverityLevel) => await this.onLogLevelUpdate(logLevel)
        );
    }

    private async removeIpcHandlers() {
        await this.rootLogger.debug('Removing IPC message handlers for log level requests');

        ipcMain.removeHandler(DmaDesktopAppEvents.LOG_LEVEL);
        ipcMain.removeHandler(DmaDesktopAppEvents.UPDATE_LOG_LEVEL);
    }

    private async onLogLevelUpdate(logLevel: SeverityLevel) {
        this.logLevel = fromLevelToPriority(logLevel);

        await this.configService.updateSetting('logLevel', logLevel);
        await this.rootLogger.info(`Log level has been updated to "${logLevel}"`);
    }

    private get isInitialized() {
        return this.rootLogger.loggers.length > 0 && this.rootLogger.loggers.every(({ initialized }) => initialized);
    }

    private get rootLogger() {
        return LogService.rootLogger;
    }

    private get hasBufferedLogs() {
        return this.rootLogger.bufferedLogs.length > 0;
    }

    private async processLog(logData: LogData) {
        if (fromLevelToPriority(logData.severity) > this.rootLogger.logLevel) return;
        await Promise.all(this.rootLogger.loggers.map((logger) => logger.log(logData)));
    }

    private async processBufferedLogs() {
        await Promise.all(this.rootLogger.bufferedLogs.map((logData) => this.rootLogger.processLog(logData)));
        this.rootLogger.bufferedLogs = [];
    }
}
