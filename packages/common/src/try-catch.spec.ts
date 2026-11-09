import { describe, expect, expectTypeOf, it } from 'vitest';
import { type Result, tryCatch, tryCatchSync } from './try-catch.ts';

describe('tryCatch', () => {
    it('resolves to the value of a promise that fulfills', async () => {
        const result = await tryCatch(Promise.resolve(42));

        expectTypeOf(result).toEqualTypeOf<Result<number>>();
        expect(result).toEqual({ ok: true, value: 42 });
    });

    it('resolves to the reason of a promise that rejects', async () => {
        const error = new Error('failed');

        expect(await tryCatch(Promise.reject(error))).toEqual({ ok: false, error });
    });

    it('resolves to a thrown value that is no Error', async () => {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- The test rejects with a non-Error on purpose.
        expect(await tryCatch(Promise.reject('failed'))).toEqual({ ok: false, error: 'failed' });
    });

    it('tells an undefined error from a value', async () => {
        // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors -- The test rejects with a non-Error on purpose.
        expect(await tryCatch(Promise.reject(undefined))).toEqual({ ok: false, error: undefined });
    });
});

describe('tryCatchSync', () => {
    it('returns the value of a function that returns', () => {
        const result = tryCatchSync(() => 'value');

        expectTypeOf(result).toEqualTypeOf<Result<string>>();
        expect(result).toEqual({ ok: true, value: 'value' });
    });

    it('returns the error of a function that throws', () => {
        const error = new RangeError('out of range');

        expect(
            tryCatchSync(() => {
                throw error;
            }),
        ).toEqual({ ok: false, error });
    });

    it('returns a thrown value that is no Error', () => {
        expect(
            tryCatchSync(() => {
                // eslint-disable-next-line @typescript-eslint/only-throw-error -- The test throws a non-Error on purpose.
                throw 42;
            }),
        ).toEqual({ ok: false, error: 42 });
    });
});

describe('Result', () => {
    it('narrows to the value or the error by ok', () => {
        const result = tryCatchSync((): number => 1);

        if (result.ok) {
            expectTypeOf(result.value).toEqualTypeOf<number>();
        } else {
            expectTypeOf(result.error).toEqualTypeOf<unknown>();
        }
    });
});
