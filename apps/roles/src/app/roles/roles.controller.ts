import {
    AddScopeRequest,
    CreateRoleRequest,
    GetAllRolesRequest,
    GetAllScopesOfRoleRequest,
    GetOneRoleRequest,
    RemoveRoleRequest,
    RemoveScopeFromRoleRequest,
    Role,
    ROLE_SERVICE_NAME,
    RolesServiceProducer,
    RpcCodes,
    UpdateRoleRequest,
} from '@dnd-mapp/shared-api';
import { Metadata, type ServerUnaryCall } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
    addScopeToRoleFailedInvalidPathAndId,
    getRoleFailedIdNotFound,
    getRoleFailedNameNotFound,
    getScopesOfRoleFailedInvalidPathAndId,
    removeRoleFailedInvalidPathAndId,
    removeScopeFromRoleFailedInvalidPathAndId,
    updateRoleFailedInvalidPathAndId,
} from '../models';
import { throwRpcException } from '../utils';
import { RolesService } from './roles.service';

@Controller()
export class RolesController implements RolesServiceProducer {
    constructor(private readonly rolesService: RolesService) {}

    @GrpcMethod(ROLE_SERVICE_NAME)
    public async getAll(data: GetAllRolesRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        return { roles: await this.rolesService.getAll(data) };
    }

    @GrpcMethod(ROLE_SERVICE_NAME)
    public async getOne(data: GetOneRoleRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const { roleId, name } = data;
        let result: Role;

        if (roleId) {
            result = await this.rolesService.getById(roleId);

            if (!result) {
                throwRpcException(getRoleFailedIdNotFound(roleId), RpcCodes.NOT_FOUND);
            }
        } else if (name) {
            result = await this.rolesService.getByName(name);

            if (!result) {
                throwRpcException(getRoleFailedNameNotFound(name), RpcCodes.NOT_FOUND);
            }
        }
        return result;
    }

    @GrpcMethod(ROLE_SERVICE_NAME)
    public async getAllScopesOfRole(
        data: GetAllScopesOfRoleRequest,
        metadata: Metadata,
        _call: ServerUnaryCall<unknown, unknown>
    ) {
        const roleId = this.getRoleId(metadata);

        if (roleId !== data.roleId) {
            throwRpcException(getScopesOfRoleFailedInvalidPathAndId(roleId, data.roleId), RpcCodes.PERMISSION_DENIED);
        }
        return { scopes: await this.rolesService.getAllScopesOfRole(roleId) };
    }

    @GrpcMethod(ROLE_SERVICE_NAME)
    public async create(data: CreateRoleRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        return await this.rolesService.create(data);
    }

    @GrpcMethod(ROLE_SERVICE_NAME)
    public async addScope(data: AddScopeRequest, metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const roleId = this.getRoleId(metadata);

        if (roleId !== data.roleId) {
            throwRpcException(addScopeToRoleFailedInvalidPathAndId(roleId, data.roleId), RpcCodes.PERMISSION_DENIED);
        }
        return await this.rolesService.addScopeToRole(data);
    }

    @GrpcMethod(ROLE_SERVICE_NAME)
    public async update(data: UpdateRoleRequest, metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const roleId = this.getRoleId(metadata);

        if (roleId !== data.id) {
            throwRpcException(updateRoleFailedInvalidPathAndId(roleId, data.id), RpcCodes.PERMISSION_DENIED);
        }
        return await this.rolesService.update(data);
    }

    @GrpcMethod(ROLE_SERVICE_NAME)
    public async remove(data: RemoveRoleRequest, metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const roleId = this.getRoleId(metadata);

        if (roleId !== data.roleId) {
            throwRpcException(removeRoleFailedInvalidPathAndId(roleId, data.roleId), RpcCodes.PERMISSION_DENIED);
        }
        await this.rolesService.remove(data.roleId);
    }

    @GrpcMethod(ROLE_SERVICE_NAME)
    public async removeScope(
        data: RemoveScopeFromRoleRequest,
        metadata: Metadata,
        _call: ServerUnaryCall<unknown, unknown>
    ) {
        const roleId = this.getRoleId(metadata);

        if (roleId !== data.roleId) {
            throwRpcException(
                removeScopeFromRoleFailedInvalidPathAndId(roleId, data.roleId),
                RpcCodes.PERMISSION_DENIED
            );
        }
        return await this.rolesService.removeScopeFromRole(data);
    }

    private getRoleId(metadata: Metadata) {
        return metadata.get('roleId')[0] as string;
    }
}
