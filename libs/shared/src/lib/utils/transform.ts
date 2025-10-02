import { ClassTransformOptions, plainToInstance } from 'class-transformer';

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
interface Type<T> extends Function {
    new (...args: unknown[]): T;
}

export const transformOptions: ClassTransformOptions = {
    enableCircularCheck: true,
    enableImplicitConversion: true,
};

export function transform<T>(data: unknown, type: Type<T>): T {
    return plainToInstance(type, data, transformOptions);
}

export function transformAll<T>(data: unknown[], type: Type<T>): T[] {
    return plainToInstance(type, data, transformOptions);
}
