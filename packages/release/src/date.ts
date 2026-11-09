import { tryCatchSync } from '@dnd-mapp/common';
import { ReleaseError } from './errors.ts';

/** Formats the day of `now` in an IANA time zone as YYYY-MM-DD. */
export function dayIn(now: Date, timeZone: string): string {
    const unknown = new ReleaseError(`unknown time zone ${timeZone}, expected an IANA zone such as Europe/Amsterdam`);

    // Intl also accepts offsets such as +05:00, which are no IANA zones.
    if (/^[+-]/.test(timeZone)) {
        throw unknown;
    }
    const format = tryCatchSync(
        () => new Intl.DateTimeFormat('en-US', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }),
    );

    if (!format.ok) {
        if (format.error instanceof RangeError) {
            throw unknown;
        }
        throw format.error;
    }
    const parts = Object.fromEntries(format.value.formatToParts(now).map((part) => [part.type, part.value]));

    return `${parts['year'] ?? ''}-${parts['month'] ?? ''}-${parts['day'] ?? ''}`;
}
