import { DatabaseService } from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from '../../../prisma/client';
import { CreateRoleData, Role, transformAllRoleScopes, transformRoleScopes } from '../shared';

const selectedRoleAttributes = {
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
} as const;

@Injectable()
export class RolesRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public findAll = async () =>
        plainToInstance(
            Role,
            transformAllRoleScopes(
                await this.databaseService.prisma.role.findMany({
                    ...selectedRoleAttributes,
                })
            )
        );

    public findOneById = async (roleId: string) =>
        plainToInstance(
            Role,
            transformRoleScopes(
                await this.databaseService.prisma.role.findUnique({ ...selectedRoleAttributes, where: { id: roleId } })
            )
        );

    public findOneByName = async (roleName: string) =>
        plainToInstance(
            Role,
            transformRoleScopes(
                await this.databaseService.prisma.role.findFirst({
                    ...selectedRoleAttributes,
                    where: { name: roleName },
                })
            )
        );

    public create = async (data: CreateRoleData) =>
        plainToInstance(
            Role,
            transformRoleScopes(
                await this.databaseService.prisma.role.create({
                    ...selectedRoleAttributes,
                    data: {
                        name: data.name,
                    },
                })
            )
        );

    public update = async (data: Role) =>
        plainToInstance(
            Role,
            transformRoleScopes(
                await this.databaseService.prisma.role.update({
                    ...selectedRoleAttributes,
                    where: { id: data.id },
                    data: {
                        id: data.id,
                        name: data.name,
                    },
                })
            )
        );

    public async removeById(roleId: string) {
        await this.databaseService.prisma.role.delete({ where: { id: roleId } });
    }
}
