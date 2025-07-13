import { DynamicModule, Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Constructable, withPrismaClient } from './models';

@Global()
@Module({})
export class DatabaseModule {
    public static forRoot = <T = unknown>(ctor: Constructable<T>) =>
        ({
            module: DatabaseModule,
            providers: [DatabaseService, withPrismaClient<T>(ctor)],
            exports: [DatabaseService],
        }) satisfies DynamicModule;
}
