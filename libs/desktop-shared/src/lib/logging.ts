export const SeverityLevels = {
    INFO: 'info',
    DEBUG: 'debug',
    WARNING: 'warn',
    ERROR: 'error',
} as const;

export type SeverityLevel = (typeof SeverityLevels)[keyof typeof SeverityLevels];

export const DEFAULT_LOG_LEVEL = SeverityLevels.INFO;
