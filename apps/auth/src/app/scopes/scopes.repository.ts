import { DatabaseService } from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from '../../../prisma/client';
import { CreateScopeData, Scope } from '../shared';

const selectedScopeAttributes = {
    select: {
        id: true,
        name: true,
        roles: {
            select: {
                role: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        },
    },
};

@Injectable()
export class ScopesRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public findAll = async () =>
        plainToInstance(
            Scope,
            this.transformAllRoleScopes(
                await this.databaseService.prisma.scope.findMany({ ...selectedScopeAttributes })
            )
        );

    public findOneById = async (scopeId: string) =>
        plainToInstance(
            Scope,
            this.transformRoleScopes(
                await this.databaseService.prisma.scope.findUnique({
                    ...selectedScopeAttributes,
                    where: { id: scopeId },
                })
            )
        );

    public findOneByName = async (scopeName: string) =>
        plainToInstance(
            Scope,
            this.transformRoleScopes(
                await this.databaseService.prisma.scope.findFirst({
                    ...selectedScopeAttributes,
                    where: { name: scopeName },
                })
            )
        );

    public create = async (data: CreateScopeData) =>
        plainToInstance(
            Scope,
            this.transformRoleScopes(
                await this.databaseService.prisma.scope.create({
                    ...selectedScopeAttributes,
                    data: {
                        name: data.name,
                        roles: {
                            createMany: {
                                data: [...data.roles].map((role) => ({
                                    roleId: role.id,
                                })),
                            },
                        },
                    },
                })
            )
        );

    public async update(data: Scope) {
        const currentRoles = (await this.findOneById(data.id)).roles;

        return plainToInstance(
            Scope,
            this.transformRoleScopes(
                await this.databaseService.prisma.scope.update({
                    ...selectedScopeAttributes,
                    where: { id: data.id },
                    data: {
                        id: data.id,
                        name: data.name,
                        roles: {
                            deleteMany: [...currentRoles]
                                .filter((role) => ![...data.roles].some((newRole) => newRole.id === role.id))
                                .map((role) => ({ roleId: role.id })),
                            createMany: {
                                data: [...data.roles]
                                    .filter((role) => ![...currentRoles].some((oldRole) => oldRole.id === role.id))
                                    .map((role) => ({ roleId: role.id })),
                            },
                        },
                    },
                })
            )
        );
    }

    public async removeById(scopeId: string) {
        await this.databaseService.prisma.scope.delete({ where: { id: scopeId } });
    }

    private transformAllRoleScopes<T = unknown>(data: T[]) {
        data = data.map((entry) => this.transformRoleScopes(entry));
        return data;
    }

    private transformRoleScopes<T = unknown>(data: T) {
        if (data === null || typeof data !== 'object' || !('roles' in data) || !Array.isArray(data.roles)) {
            return data;
        }
        data.roles = data.roles.map(({ role }) => role);
        return data;
    }
}
