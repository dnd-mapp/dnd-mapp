import { PrismaClient } from '@dnd-mapp/resources-server/prisma';
import { Injectable, OnApplicationShutdown, OnModuleInit } from '@nestjs/common';

@Injectable()
export class DatabaseService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
    public async onModuleInit() {
        await this.$connect();
    }

    public async onApplicationShutdown() {
        await this.$disconnect();
    }
}
