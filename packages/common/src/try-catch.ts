/** The value of a call that returned. */
export interface Success<T> {
    ok: true;
    value: T;
}

/** The error of a call that threw. JavaScript can throw any value, so the error is `unknown`, not an `Error`. */
export interface Failure {
    ok: false;
    error: unknown;
}

/** The outcome of a call that can throw. Check `ok` to tell a value from an error. */
export type Result<T> = Success<T> | Failure;

/** Awaits `promise`, and resolves to its value, or to the reason it rejected with. Never rejects. */
export async function tryCatch<T>(promise: PromiseLike<T>): Promise<Result<T>> {
    try {
        return { ok: true, value: await promise };
    } catch (error) {
        return { ok: false, error };
    }
}

/**
 * Calls `fn`, and returns its value, or the error it threw. Never throws. Pass a promise to `tryCatch` instead, since
 * this returns the promise as the value and leaves its rejection uncaught.
 */
export function tryCatchSync<T>(fn: () => T): Result<T> {
    try {
        return { ok: true, value: fn() };
    } catch (error) {
        return { ok: false, error };
    }
}
