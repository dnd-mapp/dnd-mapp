import { ConsoleLogger } from './loggers';
import {
    createLogObject,
    LogData,
    Loggers,
    SeverityLevel,
    SeverityLevels,
    SeverityPriorityLevel,
    SeverityPriorityLevels,
} from './models';

const logContexts = new Map<string, LogService>();

export class LogService {
    public static withContext(context: string, root = false) {
        if (logContexts.has(context)) return logContexts.get(context);
        const logService = new LogService(context, root);

        logContexts.set(context, logService);
        return logService;
    }
    private static rootLogger: LogService;

    private readonly context: string;
    private readonly root: boolean;

    /** Only used by the rootLogger. */
    private loggers: Loggers = [];
    private bufferedLogs: LogData[] = [];
    private readonly logLevel: SeverityPriorityLevel = SeverityPriorityLevels[SeverityLevels.ERROR];

    private constructor(context: string, root: boolean) {
        this.context = context;
        this.root = root;

        if (root) LogService.rootLogger = this;
    }

    public async initialize() {
        if (!this.root) return;
        await this.info('Initializing LogService');

        this.loggers = [new ConsoleLogger()];
        await Promise.all(this.loggers.map((logger) => logger.initialize()));
    }

    public async destroy(): Promise<null> {
        await this.info(`Destroying LogService of context "${this.context}"`);
        if (!this.root) {
            logContexts.delete(this.context);
            return null;
        }
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
        if (this.severityLevelPriority(logData.severity) > this.rootLogger.logLevel) return;
        await Promise.all(this.rootLogger.loggers.map((logger) => logger.log(logData)));
    }

    private async processBufferedLogs() {
        await Promise.all(this.rootLogger.bufferedLogs.map((logData) => this.rootLogger.processLog(logData)));
        this.rootLogger.bufferedLogs = [];
    }

    private severityLevelPriority(severity: SeverityLevel) {
        return SeverityPriorityLevels[severity];
    }
}
