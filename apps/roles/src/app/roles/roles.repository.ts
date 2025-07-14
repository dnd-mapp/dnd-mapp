import { CreateRoleRequest, DatabaseService, GetAllRolesRequest, Role, UpdateRoleRequest } from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from '../../../prisma/client';
import { Role as DatabaseRole, selectScopes } from './models';

@Injectable()
export class RolesRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public async findAll(params: GetAllRolesRequest) {
        const query = await this.databaseService.prisma.role.findMany({
            select: { ...this.constructSelectedAttributes() },
            ...(!params.hasScopes
                ? {}
                : {
                      where: {
                          scopes: {
                              every: {
                                  scopeId: {
                                      in: params.hasScopes,
                                  },
                              },
                          },
                      },
                  }),
        });

        return this.transformDatabaseQueryResults(query);
    }

    public async findOneById(roleId: string) {
        const query = await this.databaseService.prisma.role.findUnique({
            where: { id: roleId },
            select: { ...this.constructSelectedAttributes() },
        });

        return this.transformDatabaseQueryResult(query);
    }

    public async fineOneByName(name: string) {
        const query = await this.databaseService.prisma.role.findUnique({
            where: { name: name },
            select: { ...this.constructSelectedAttributes() },
        });

        return this.transformDatabaseQueryResult(query);
    }

    public async create(data: CreateRoleRequest) {
        const result = await this.databaseService.prisma.role.create({
            data: { name: data.name },
            select: { ...this.constructSelectedAttributes() },
        });

        return this.transformDatabaseQueryResult(result);
    }

    public async addScopeToRole(roleId: string, scopeId: string) {
        await this.databaseService.prisma.roleScopes.create({
            data: {
                roleId: roleId,
                scopeId: scopeId,
            },
        });
    }

    public async update(data: UpdateRoleRequest) {
        const result = await this.databaseService.prisma.role.update({
            where: { id: data.id },
            data: { name: data.name },
            select: { ...this.constructSelectedAttributes() },
        });

        return this.transformDatabaseQueryResult(result);
    }

    public async remove(roleId: string) {
        await this.databaseService.prisma.role.delete({ where: { id: roleId } });
    }

    public async removeScopeFromRole(roleId: string, scopeId: string) {
        await this.databaseService.prisma.roleScopes.delete({
            where: {
                pk_role_scope: {
                    roleId: roleId,
                    scopeId: scopeId,
                },
            },
        });
    }

    private constructSelectedAttributes() {
        return {
            id: true,
            name: true,
            ...selectScopes,
        };
    }

    private transformDatabaseQueryResults(results: DatabaseRole[]) {
        return results.map((result) => this.transformDatabaseQueryResult(result));
    }

    private transformDatabaseQueryResult(result: DatabaseRole) {
        return plainToInstance(Role, {
            id: result.id,
            name: result.name,
            scopes: result.scopes.map((scope) => scope),
        });
    }
}
