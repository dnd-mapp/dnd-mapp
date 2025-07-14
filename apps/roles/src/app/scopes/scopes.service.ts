import { CreateScopeRequest, RpcCodes, UpdateScopeRequest } from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import {
    createScopeFailedNameTaken,
    removeScopeFailedNotFound,
    updateScopeFailedNameTaken,
    updateScopeFailedNotFound,
} from '../models';
import { throwRpcException } from '../utils';
import { ScopesRepository } from './scopes.repository';

@Injectable()
export class ScopesService {
    constructor(private readonly scopesRepository: ScopesRepository) {}

    public async getAll() {
        return await this.scopesRepository.findAll();
    }

    public async getAllOfRole(roleId: string) {
        return await this.scopesRepository.findAllByRole(roleId);
    }

    public async getById(scopeId: string) {
        return await this.scopesRepository.findOneById(scopeId);
    }

    public async getByName(name: string) {
        return await this.scopesRepository.findOneByName(name);
    }

    public async create(data: CreateScopeRequest) {
        if (await this.doesScopeWithNameExist(data.name)) {
            throwRpcException(createScopeFailedNameTaken(data.name), RpcCodes.INVALID_ARGUMENT);
        }
        return await this.scopesRepository.create(data);
    }

    public async update(data: UpdateScopeRequest) {
        const query = await this.getById(data.id);

        if (!query) {
            throwRpcException(updateScopeFailedNotFound(data.id), RpcCodes.NOT_FOUND);
        }
        if (await this.doesScopeWithNameExist(data.name, data.id)) {
            throwRpcException(updateScopeFailedNameTaken(data.id, data.name), RpcCodes.INVALID_ARGUMENT);
        }
        return await this.scopesRepository.update(data);
    }

    public async remove(scopeId: string) {
        const query = await this.getById(scopeId);

        if (!query) {
            throwRpcException(removeScopeFailedNotFound(scopeId), RpcCodes.NOT_FOUND);
        }
        await this.scopesRepository.remove(scopeId);
    }

    private async doesScopeWithNameExist(name: string, scopeId?: string) {
        const query = await this.getByName(name);
        return Boolean(query) && (!scopeId || scopeId !== query.id);
    }
}
