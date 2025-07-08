import { tryCatch } from './try-catch';

describe('tryCatch', () => {
    async function myAsyncFunction(fail = false) {
        return await new Promise<string>((resolve, reject) => {
            setTimeout(() => {
                if (fail) reject(new Error('Unknown error'));
                else resolve('Hello World!');
            }, 1000);
        });
    }

    it('should resolve the result', async () => {
        const { data, error } = await tryCatch(myAsyncFunction());

        expect(data).toEqual('Hello World!');
        expect(error).toBeNull();
    });

    it('should reject with the error', async () => {
        const { data, error } = await tryCatch(myAsyncFunction(true));

        expect(data).toBeNull();
        expect(error).toEqual(new Error('Unknown error'));
    });
});
