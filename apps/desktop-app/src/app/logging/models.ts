import { SeverityLevel, SeverityLevels } from '@dnd-mapp/shared-desktop-app';
import chalk from 'chalk';

export const ConsoleFunctionPerSeverityLevel = {
    [SeverityLevels.INFO]: 'info',
    [SeverityLevels.DEBUG]: 'debug',
    [SeverityLevels.WARNING]: 'log',
    [SeverityLevels.ERROR]: 'error',
} as const;

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
