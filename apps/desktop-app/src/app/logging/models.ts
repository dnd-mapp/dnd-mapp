import chalk from 'chalk';

export const SeverityLevels = {
    INFO: 'info',
    DEBUG: 'debug',
    WARNING: 'warn',
    ERROR: 'error',
} as const;

export type SeverityLevel = (typeof SeverityLevels)[keyof typeof SeverityLevels];

export const ConsoleFunctionPerSeverityLevel = {
    [SeverityLevels.INFO]: 'info',
    [SeverityLevels.DEBUG]: 'debug',
    [SeverityLevels.WARNING]: 'log',
    [SeverityLevels.ERROR]: 'error',
} as const;

export const SeverityPriorityLevels = {
    [SeverityLevels.INFO]: 3,
    [SeverityLevels.DEBUG]: 4,
    [SeverityLevels.WARNING]: 2,
    [SeverityLevels.ERROR]: 1,
} as const;

export type SeverityPriorityLevel = (typeof SeverityPriorityLevels)[keyof typeof SeverityPriorityLevels];

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

export function createLogObject(severity: SeverityLevel, context: string, message: string, data?: unknown): LogData {
    return {
        timestamp: new Date(),
        severity: severity,
        context: context,
        message: message,
        ...(data ? { data: data } : {}),
    };
}

export interface Logger {
    initialized: boolean;

    log(data: LogData): Promise<void> | void;
    initialize(): Promise<void> | void;
    destroy(): Promise<void> | void;
}

export type Loggers = Logger[];
