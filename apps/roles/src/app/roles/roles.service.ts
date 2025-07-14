import {
    AddScopeRequest,
    CreateRoleRequest,
    GetAllRolesRequest,
    RemoveScopeFromRoleRequest,
    RpcCodes,
    UpdateRoleRequest,
} from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import {
    addScopeToRoleFailedRoleNotFound,
    addScopeToRoleFailedScopeNotFound,
    createRoleFailedNameTaken,
    getScopesOfRoleFailedRoleNotFound,
    removeRoleFailedNotFound,
    removeScopeFromRoleFailedRoleNotFound,
    removeScopeFromRoleFailedScopeNotFound,
    updateRoleFailedNameTaken,
    updateRoleFailedNotFound,
} from '../models';
import { ScopesService } from '../scopes';
import { throwRpcException } from '../utils';
import { RolesRepository } from './roles.repository';

@Injectable()
export class RolesService {
    constructor(
        private readonly rolesRepository: RolesRepository,
        private readonly scopesService: ScopesService
    ) {}

    public async getAll(params: GetAllRolesRequest) {
        return await this.rolesRepository.findAll(params);
    }

    public async getAllScopesOfRole(roleId: string) {
        const query = await this.getById(roleId);

        if (!query) {
            throwRpcException(getScopesOfRoleFailedRoleNotFound(roleId), RpcCodes.NOT_FOUND);
        }
        return await this.scopesService.getAllOfRole(roleId);
    }

    public async getById(roleId: string) {
        return await this.rolesRepository.findOneById(roleId);
    }

    public async getByName(name: string) {
        return await this.rolesRepository.fineOneByName(name);
    }

    public async create(data: CreateRoleRequest) {
        if (await this.doesRoleWithNameExists(data.name)) {
            throwRpcException(createRoleFailedNameTaken(data.name), RpcCodes.INVALID_ARGUMENT);
        }
        return await this.rolesRepository.create(data);
    }

    public async addScopeToRole(data: AddScopeRequest) {
        const { roleId, scopeId } = data;
        const roleQuery = await this.getById(roleId);

        if (!roleQuery) {
            throwRpcException(addScopeToRoleFailedRoleNotFound(roleId), RpcCodes.NOT_FOUND);
        }
        const scopeQuery = await this.scopesService.getById(scopeId);

        if (!scopeQuery) {
            throwRpcException(addScopeToRoleFailedScopeNotFound(roleId, scopeId), RpcCodes.NOT_FOUND);
        }
        await this.rolesRepository.addScopeToRole(roleId, scopeId);
        return await this.getById(roleId);
    }

    public async update(data: UpdateRoleRequest) {
        const query = await this.getById(data.id);

        if (!query) {
            throwRpcException(updateRoleFailedNotFound(data.id), RpcCodes.NOT_FOUND);
        }
        if (await this.doesRoleWithNameExists(data.name, data.id)) {
            throwRpcException(updateRoleFailedNameTaken(data.id, data.name), RpcCodes.INVALID_ARGUMENT);
        }
        return await this.rolesRepository.update(data);
    }

    public async remove(roleId: string) {
        const query = await this.getById(roleId);

        if (!query) {
            throwRpcException(removeRoleFailedNotFound(roleId), RpcCodes.NOT_FOUND);
        }
        await this.rolesRepository.remove(roleId);
    }

    public async removeScopeFromRole(data: RemoveScopeFromRoleRequest) {
        const { roleId, scopeId } = data;
        const roleQuery = await this.getById(roleId);

        if (!roleQuery) {
            throwRpcException(removeScopeFromRoleFailedRoleNotFound(roleId), RpcCodes.NOT_FOUND);
        }
        const scopeQuery = await this.scopesService.getById(scopeId);

        if (!scopeQuery) {
            throwRpcException(removeScopeFromRoleFailedScopeNotFound(roleId, scopeId), RpcCodes.NOT_FOUND);
        }
        await this.rolesRepository.removeScopeFromRole(roleId, scopeId);
        return await this.getById(roleId);
    }

    private async doesRoleWithNameExists(name: string, roleId?: string) {
        const query = await this.getByName(name);
        return query && (!roleId || roleId !== query.id);
    }
}
