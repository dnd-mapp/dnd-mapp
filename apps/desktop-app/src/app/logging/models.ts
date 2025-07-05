import chalk from 'chalk';

export const SeverityLevels = {
    INFO: 'info',
    DEBUG: 'debug',
    WARNING: 'warn',
    ERROR: 'error',
} as const;

export type SeverityLevel = (typeof SeverityLevels)[keyof typeof SeverityLevels];

export const SeverityColors = {
    [SeverityLevels.INFO]: chalk.green,
    [SeverityLevels.DEBUG]: chalk.white,
    [SeverityLevels.WARNING]: chalk.yellow,
    [SeverityLevels.ERROR]: chalk.red,
} as const;

export interface LogData {
    timestamp: Date;
    context: string;
    severity: SeverityLevel;
    message: string;
    data?: unknown;
}

export interface Logger {
    initialized: boolean;

    log(data: LogData): Promise<void> | void;
    initialize(): Promise<void> | void;
    destroy(): Promise<void> | void;
}

export type Loggers = Logger[];
