export type Success<T> = { data: T; error: null };

export type Failure<E = Error> = { data: null; error: E };

export type Result<T, E = Error> = Success<T> | Failure<E>;

export async function tryCatch<T, E = Error>(promiseLike: T | Promise<T>): Promise<Result<T, E>> {
    try {
        if (promiseLike instanceof Promise) {
            return { data: await promiseLike, error: null };
        }
        return { data: promiseLike, error: null };
    } catch (error) {
        return { data: null, error: error as E };
    }
}
