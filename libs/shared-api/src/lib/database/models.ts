import { FactoryProvider } from '@nestjs/common';

export const PRISMA_CLIENT = 'PRISMA_CLIENT';

export type Constructable<T = unknown> = new (...args: unknown[]) => T;

export interface PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
}

export const withPrismaClient = <T = unknown>(Ctor: Constructable<T>) =>
    ({
        provide: PRISMA_CLIENT,
        useFactory: () => new Ctor(),
    }) satisfies FactoryProvider<T>;
