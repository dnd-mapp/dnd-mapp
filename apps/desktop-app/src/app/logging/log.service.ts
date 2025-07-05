import { ConsoleLogger } from './loggers';
import { LogData, Loggers, SeverityLevel, SeverityLevels } from './models';

const logContexts = new Map<string, LogService>();

export class LogService {
    public static async withContext(context: string, root = false) {
        if (logContexts.has(context)) return logContexts.get(context);
        const logService = new LogService(context, root);
        await logService.initialize();

        logContexts.set(context, logService);
        return logService;
    }

    private readonly context: string;
    private readonly root: boolean;
    private loggers: Loggers = [new ConsoleLogger()];

    private bufferedLogs: LogData[] = [];

    constructor(context: string, root: boolean) {
        this.context = context;
        this.root = root;
    }

    private async initialize() {
        if (!this.root) return;
        await Promise.all(this.loggers.map((logger) => logger.initialize()));
    }

    public async destroy(): Promise<null> {
        if (!this.root) {
            logContexts.delete(this.context);
            return null;
        }
        await Promise.all(this.loggers.map((logger) => logger.destroy()));
        this.loggers = [];

        logContexts.delete(this.context);
        return null;
    }

    public async info(message: string) {
        await this.log(SeverityLevels.INFO, message);
    }

    public async debug(message: string) {
        await this.log(SeverityLevels.DEBUG, message);
    }

    public async warn(message: string) {
        await this.log(SeverityLevels.WARNING, message);
    }

    public async error(message: string) {
        await this.log(SeverityLevels.ERROR, message);
    }

    private async log(severity: SeverityLevel, message: string) {
        const logData: LogData = {
            timestamp: new Date(),
            severity: severity,
            context: this.context,
            message: message,
        };
        if (!this.isInitialized) {
            this.bufferedLogs = [...this.bufferedLogs, logData];
            return;
        }
        if (this.hasBufferedLogs) await this.processBufferedLogs();
        await Promise.all(this.loggers.map((logger) => logger.log(logData)));
    }

    private get isInitialized() {
        return this.loggers.every(({ initialized }) => initialized);
    }

    private get hasBufferedLogs() {
        return this.bufferedLogs.length > 0;
    }

    private async processBufferedLogs() {
        for (const log of this.bufferedLogs) {
            await Promise.all(this.loggers.map((logger) => logger.log(log)));
        }
        this.bufferedLogs = [];
    }
}
