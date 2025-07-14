import { CreateScopeRequest, DatabaseService, Scope, UpdateScopeRequest } from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from '../../../prisma/client';

@Injectable()
export class ScopesRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public async findAll() {
        const query = await this.databaseService.prisma.scope.findMany();
        return plainToInstance(Scope, query);
    }

    public async findAllByRole(roleId: string) {
        const query = await this.databaseService.prisma.roleScopes.findMany({
            where: { roleId: roleId },
            select: {
                scope: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return plainToInstance(
            Scope,
            query.map(({ scope }) => scope)
        );
    }

    public async findOneById(scopeId: string) {
        const query = await this.databaseService.prisma.scope.findUnique({
            where: { id: scopeId },
        });
        return plainToInstance(Scope, query);
    }

    public async findOneByName(name: string) {
        const query = await this.databaseService.prisma.scope.findUnique({
            where: { name: name },
        });
        return plainToInstance(Scope, query);
    }

    public async create(data: CreateScopeRequest) {
        const result = await this.databaseService.prisma.scope.create({
            data: { name: data.name },
        });
        return plainToInstance(Scope, result);
    }

    public async update(data: UpdateScopeRequest) {
        const result = await this.databaseService.prisma.scope.update({
            where: { id: data.id },
            data: { name: data.name },
        });
        return plainToInstance(Scope, result);
    }

    public async remove(scopeId: string) {
        await this.databaseService.prisma.scope.delete({ where: { id: scopeId } });
    }
}
