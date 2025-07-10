import {
    CreateUserRequest,
    GetAllUsersRequest,
    GetOneUserRequest,
    RemoveUserRequest,
    RpcCodes,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    UpdateUserRequest,
    USER_SERVICE_NAME,
} from '@dnd-mapp/shared-api';
import type { ServerUnaryCall } from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { updateFailedInvalidPathAndId } from '../models';
import { throwRpcException } from '../utils';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @GrpcMethod(USER_SERVICE_NAME)
    public async getAll(_data: GetAllUsersRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        return await this.usersService.getAll();
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async getOneBy(data: GetOneUserRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        return await this.usersService.getOneBy(data, true);
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async create(data: CreateUserRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        return await this.usersService.create(data);
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async update(request: UpdateUserRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        if (request.userId !== request.data.id) {
            throwRpcException(
                updateFailedInvalidPathAndId(request.userId, request.data.id),
                RpcCodes.PERMISSION_DENIED
            );
        }
        return await this.usersService.update(request.data);
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async updatePassword(
        request: UpdatePasswordRequest,
        _metadata: Metadata,
        _call: ServerUnaryCall<unknown, unknown>
    ) {
        if (request.userId !== request.data.id) {
            throwRpcException(
                updateFailedInvalidPathAndId(request.userId, request.data.id),
                RpcCodes.PERMISSION_DENIED
            );
        }
        return await this.usersService.updatePassword(request.data);
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async updateEmail(
        request: UpdateEmailRequest,
        _metadata: Metadata,
        _call: ServerUnaryCall<unknown, unknown>
    ) {
        if (request.userId !== request.data.id) {
            throwRpcException(
                updateFailedInvalidPathAndId(request.userId, request.data.id),
                RpcCodes.PERMISSION_DENIED
            );
        }
        return await this.usersService.updateEmail(request.data);
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async remove(request: RemoveUserRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        if (request.userId !== request.data.id) {
            throwRpcException(
                updateFailedInvalidPathAndId(request.userId, request.data.id),
                RpcCodes.PERMISSION_DENIED
            );
        }
        return await this.usersService.remove(request.data);
    }
}
