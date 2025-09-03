import { DatabaseService } from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from '../../../prisma/client';
import { Authorization, AuthorizeRequest, MAX_AUTHORIZATION_CODE_LIFETIME } from '../shared';

@Injectable()
export class AuthorizationRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public getAuthorizationByState = async (state: string) =>
        plainToInstance(
            Authorization,
            await this.databaseService.prisma.authorization.findFirst({ where: { state: state } })
        );

    public getAuthorizationByAuthorizationCode = async (authorizationCode: string) =>
        plainToInstance(
            Authorization,
            await this.databaseService.prisma.authorization.findFirst({
                where: { authorizationCode: authorizationCode },
            })
        );

    public storeCodeChallenge = async (data: AuthorizeRequest) =>
        plainToInstance(
            Authorization,
            await this.databaseService.prisma.authorization.create({
                data: { codeChallenge: data.codeChallenge, state: data.state, redirectUrl: data.redirectUrl },
            })
        );

    public update = async (authorization: Authorization) =>
        plainToInstance(
            Authorization,
            await this.databaseService.prisma.authorization.update({
                where: { authorizationCode: authorization.authorizationCode },
                data: authorization,
            })
        );

    public async removeByAuthorizationCode(authorizationCode: string) {
        await this.databaseService.prisma.authorization.delete({ where: { authorizationCode: authorizationCode } });
    }

    public async removeExpiredAuthorizationCodes() {
        const tokens = await this.findAll();
        const now = Date.now();

        await Promise.all(
            tokens.map(({ createdAt, authorizationCode }) => {
                if (new Date(createdAt.getTime() + MAX_AUTHORIZATION_CODE_LIFETIME).getTime() < now) return;
                this.removeByAuthorizationCode(authorizationCode);
            })
        );
    }

    private findAll = async () =>
        plainToInstance(Authorization, await this.databaseService.prisma.authorization.findMany());
}
