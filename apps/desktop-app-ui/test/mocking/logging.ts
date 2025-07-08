import { SeverityLevel, SeverityLevels } from '@dnd-mapp/desktop-shared';

let mockedLogLevel: SeverityLevel = SeverityLevels.INFO;

export function getLoggingLevel() {
    return mockedLogLevel;
}

export function setLogLevel(logLevel: SeverityLevel) {
    mockedLogLevel = logLevel;
}

export function resetLogLevel() {
    mockedLogLevel = SeverityLevels.INFO;
}
