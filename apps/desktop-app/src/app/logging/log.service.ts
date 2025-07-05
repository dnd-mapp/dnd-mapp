import { ConsoleLogger } from './loggers';
import { LogData, Loggers, SeverityLevel, SeverityLevels } from './models';

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
    private loggers: Loggers = [];

    private bufferedLogs: LogData[] = [];

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
        await Promise.all(this.rootLogger.loggers.map((logger) => logger.destroy()));
        this.rootLogger.loggers = [];

        logContexts.delete(this.context);
        return null;
    }

    public async info(message: string) {
        await this.log(SeverityLevels.INFO, message);
    }

    public async debug(message: string) {
        await this.log(SeverityLevels.DEBUG, message);
    }

    public async warn(message: string, data?: unknown) {
        await this.log(SeverityLevels.WARNING, message, data);
    }

    public async error(message: string, data?: unknown) {
        await this.log(SeverityLevels.ERROR, message, data);
    }

    private async log(severity: SeverityLevel, message: string, data?: unknown) {
        const logData: LogData = {
            timestamp: new Date(),
            severity: severity,
            context: this.context,
            message: message,
            ...(data ? { data: data } : {}),
        };
        if (!this.isInitialized) {
            this.rootLogger.bufferedLogs = [...this.rootLogger.bufferedLogs, logData];
            return;
        }
        if (this.hasBufferedLogs) await this.processBufferedLogs();
        await Promise.all(this.rootLogger.loggers.map((logger) => logger.log(logData)));
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

    private async processBufferedLogs() {
        for (const log of this.rootLogger.bufferedLogs) {
            await Promise.all(this.rootLogger.loggers.map((logger) => logger.log(log)));
        }
        this.rootLogger.bufferedLogs = [];
    }
}
