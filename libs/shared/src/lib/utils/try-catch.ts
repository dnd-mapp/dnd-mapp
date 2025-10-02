interface Success<T> {
    data: T;
    error: null;
}

interface Failure<E = Error> {
    data: null;
    error: E;
}

type Result<T, E = Error> = Success<T> | Failure<E>;

export function tryCatch<T, E = Error>(procedure: () => T): Result<T, E> {
    try {
        return { data: procedure(), error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}

export async function tryCatchAsync<T, E = Error>(promise: Promise<T>): Promise<Result<T, E>> {
    try {
        return { data: await promise, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}
