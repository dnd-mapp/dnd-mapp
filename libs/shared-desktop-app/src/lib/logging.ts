export const SeverityLevels = {
    INFO: 'info',
    DEBUG: 'debug',
    WARNING: 'warn',
    ERROR: 'error',
} as const;

export type SeverityLevel = (typeof SeverityLevels)[keyof typeof SeverityLevels];

export const DEFAULT_LOG_LEVEL = SeverityLevels.INFO;

export const SeverityPriorityLevels = {
    [SeverityLevels.INFO]: 3,
    [SeverityLevels.DEBUG]: 4,
    [SeverityLevels.WARNING]: 2,
    [SeverityLevels.ERROR]: 1,
} as const;

export type SeverityPriorityLevel = (typeof SeverityPriorityLevels)[keyof typeof SeverityPriorityLevels];

export function fromPriorityToLevel(priority: SeverityPriorityLevel): SeverityLevel {
    return Object.entries(SeverityPriorityLevels).find(
        ([_, severityPriority]) => severityPriority === priority
    )[0] as SeverityLevel;
}

export function fromLevelToPriority(level: SeverityLevel) {
    return SeverityPriorityLevels[level];
}
