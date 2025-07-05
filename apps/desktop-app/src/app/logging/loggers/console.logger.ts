import { ConsoleFunctionPerSeverityLevel, LogData, Logger, SeverityColors, SeverityLevels } from '../models';

export class ConsoleLogger implements Logger {
    public initialized = false;

    public initialize() {
        this.initialized = true;
    }

    public destroy() {
        // No need for destruction.
    }

    public log(data: LogData) {
        const { severity } = data;
        const log = this.constructLog(data);

        console[ConsoleFunctionPerSeverityLevel[severity]](SeverityColors[severity](log));

        if (data.data && (severity === SeverityLevels.WARNING || severity === SeverityLevels.ERROR)) {
            console.error(data.data);
        }
    }

    private constructLog(data: LogData) {
        const { timestamp, context, severity, message } = data;
        return `${timestamp.toLocaleString()} - ${severity.toUpperCase()}\t[${context}]: ${message}`;
    }
}
