import { BeforeApplicationShutdown, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import type { PrismaClient } from './models';
import { PRISMA_CLIENT } from './models';

@Injectable()
export class DatabaseService<T extends PrismaClient> implements OnModuleInit, BeforeApplicationShutdown {
    constructor(@Inject(PRISMA_CLIENT) private readonly prismaClient: T) {}

    public async onModuleInit() {
        await this.prismaClient.$connect();
    }

    public async beforeApplicationShutdown() {
        await this.prismaClient.$disconnect();
    }

    public get prisma() {
        return this.prismaClient;
    }
}
