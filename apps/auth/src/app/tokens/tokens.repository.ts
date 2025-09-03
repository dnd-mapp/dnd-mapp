import { DatabaseService } from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from '../../../prisma/client';
import { TokenMetadata, transformUserRoles } from '../shared';

const selectedTokenAttributes = {
    select: {
        jti: true,
        pti: true,
        sub: true,
        tpe: true,
        iss: true,
        aud: true,
        iat: true,
        nbf: true,
        exp: true,
        rvk: true,
        user: {
            select: {
                id: true,
                username: true,
                roles: {
                    select: {
                        role: {
                            select: {
                                id: true,
                                name: true,
                                scopes: {
                                    select: {
                                        scope: {
                                            select: {
                                                id: true,
                                                name: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
} as const;

@Injectable()
export class TokensRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public findByJti = async (jti: string) =>
        plainToInstance(
            TokenMetadata,
            this.transformTokenUser(
                await this.databaseService.prisma.token.findFirst({
                    ...selectedTokenAttributes,
                    where: { jti: jti },
                })
            )
        );

    public findAllByPti = async (pti: string) =>
        plainToInstance(
            TokenMetadata,
            this.transformAllTokenUsers(
                await this.databaseService.prisma.token.findMany({ ...selectedTokenAttributes, where: { pti: pti } })
            )
        );

    public findAllByUserIdAndNotRevoked = async (userId: string) =>
        plainToInstance(
            TokenMetadata,
            this.transformAllTokenUsers(
                await this.databaseService.prisma.token.findMany({
                    ...selectedTokenAttributes,
                    where: { AND: [{ sub: userId }, { rvk: false }] },
                })
            )
        );

    public create = async (metadata: TokenMetadata) =>
        plainToInstance(
            TokenMetadata,
            this.transformTokenUser(
                await this.databaseService.prisma.token.create({
                    ...selectedTokenAttributes,
                    data: {
                        tpe: metadata.tpe,
                        rvk: metadata.rvk,
                        sub: metadata.sub,
                        iss: metadata.iss,
                        aud: metadata.aud,
                        iat: metadata.iat,
                        exp: metadata.exp,
                        nbf: metadata.nbf,
                        pti: metadata.pti ?? null,
                    },
                })
            )
        );

    public update = async (token: TokenMetadata) =>
        plainToInstance(
            TokenMetadata,
            this.transformTokenUser(
                await this.databaseService.prisma.token.update({
                    ...selectedTokenAttributes,
                    where: { jti: token.jti },
                    data: {
                        tpe: token.tpe,
                        rvk: token.rvk,
                        sub: token.sub,
                        iss: token.iss,
                        aud: token.aud,
                        iat: token.iat,
                        exp: token.exp,
                        nbf: token.nbf,
                    },
                })
            )
        );

    public async removeByJti(jti: string) {
        await this.databaseService.prisma.token.delete({ where: { jti: jti } });
    }

    public async revokeAllBySub(userId: string) {
        await this.databaseService.prisma.token.updateMany({ where: { sub: userId }, data: { rvk: true } });
    }

    public async revokeByJti(jti: string) {
        await this.databaseService.prisma.token.update({ where: { jti: jti }, data: { rvk: true } });
    }

    public async removeAllByAud(aud: string) {
        await this.databaseService.prisma.token.deleteMany({ where: { aud: aud } });
    }

    public async removeAllExpired() {
        await this.databaseService.prisma.token.deleteMany({ where: { exp: { lt: new Date() } } });
    }

    private transformAllTokenUsers<T = unknown>(data: T[]) {
        return data.map((token) => this.transformTokenUser(token));
    }

    private transformTokenUser<T = unknown>(data: T) {
        if (data === null || typeof data !== 'object' || !('user' in data)) return data;
        data.user = transformUserRoles(data.user);

        return data;
    }
}
