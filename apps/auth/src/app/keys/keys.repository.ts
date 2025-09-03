import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DatabaseService } from '@dnd-mapp/shared-api';
import { KeyData } from './models';
import { PrismaClient } from '../../../prisma/client';

@Injectable()
export class KeysRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public findAllKeys = async () => plainToInstance(KeyData, await this.databaseService.prisma.key.findMany());

    public findAllByClientId = async (clientId: string) =>
        plainToInstance(KeyData, await this.databaseService.prisma.key.findMany({ where: { clientId: clientId } }));

    public store = async (data: KeyData) =>
        plainToInstance(
            KeyData,
            await this.databaseService.prisma.key.create({
                data: data,
            })
        );

    public async removeByKid(kid: string) {
        await this.databaseService.prisma.key.delete({ where: { kid: kid } });
    }

    public async removePrivateKeyByKid(kid: string) {
        await this.databaseService.prisma.key.update({
            where: { kid: kid },
            data: { privateKey: null },
        });
    }
}
