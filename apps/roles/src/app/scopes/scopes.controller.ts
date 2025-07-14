import {
    CreateScopeRequest,
    GetAllScopesRequest,
    GetOneScopeRequest,
    RemoveScopeRequest,
    RpcCodes,
    Scope,
    SCOPE_SERVICE_NAME,
    ScopesServiceProducer,
    UpdateScopeRequest,
} from '@dnd-mapp/shared-api';
import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
    getScopeFailedIdNotFound,
    getScopeFailedNameNotFound,
    removeScopeFailedInvalidPathAndId,
    updateScopeFailedInvalidPathAndId,
} from '../models';
import { throwRpcException } from '../utils';
import { ScopesService } from './scopes.service';

@Controller()
export class ScopesController implements ScopesServiceProducer {
    constructor(private readonly scopesService: ScopesService) {}

    @GrpcMethod(SCOPE_SERVICE_NAME)
    public async getAll(_data: GetAllScopesRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        return { scopes: await this.scopesService.getAll() };
    }

    @GrpcMethod(SCOPE_SERVICE_NAME)
    public async getOne(data: GetOneScopeRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const { scopeId, name } = data;
        let query: Scope;

        if (scopeId) {
            query = await this.scopesService.getById(scopeId);

            if (!query) {
                throwRpcException(getScopeFailedIdNotFound(scopeId), RpcCodes.NOT_FOUND);
            }
        } else if (name) {
            query = await this.scopesService.getByName(name);

            if (!query) {
                throwRpcException(getScopeFailedNameNotFound(name), RpcCodes.NOT_FOUND);
            }
        }
        return query;
    }

    @GrpcMethod(SCOPE_SERVICE_NAME)
    public async create(data: CreateScopeRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        return await this.scopesService.create(data);
    }

    @GrpcMethod(SCOPE_SERVICE_NAME)
    public async update(data: UpdateScopeRequest, metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const scopeId = this.getScopeId(metadata);

        if (scopeId !== data.id) {
            throwRpcException(updateScopeFailedInvalidPathAndId(scopeId, data.id), RpcCodes.PERMISSION_DENIED);
        }
        return await this.scopesService.update(data);
    }

    @GrpcMethod(SCOPE_SERVICE_NAME)
    public async remove(data: RemoveScopeRequest, metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const scopeId = this.getScopeId(metadata);

        if (scopeId !== data.scopeId) {
            throwRpcException(removeScopeFailedInvalidPathAndId(scopeId, data.scopeId), RpcCodes.PERMISSION_DENIED);
        }
        await this.scopesService.remove(data.scopeId);
    }

    private getScopeId(metadata: Metadata) {
        return metadata.get('scopeId')[0] as string;
    }
}
