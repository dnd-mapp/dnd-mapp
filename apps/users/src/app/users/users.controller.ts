import {
    CreateUserRequest,
    GetAllRequest,
    GetUserByIdRequest,
    RemoveUserRequest,
    RpcCodes,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    UpdateUserRequest,
    USER_SERVICE_NAME,
    type UsersServiceProducer,
} from '@dnd-mapp/shared-api';
import { Metadata, ServerUnaryCall, status } from '@grpc/grpc-js';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { getFailedIdNotFound, updateFailedInvalidPathAndId } from '../models';
import { throwRpcException } from '../utils';
import { UsersService } from './users.service';

@Controller()
export class UsersController implements UsersServiceProducer {
    constructor(private readonly usersService: UsersService) {}

    @GrpcMethod(USER_SERVICE_NAME)
    public async getAll(_data: GetAllRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        return await this.usersService.getAll();
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async create(data: CreateUserRequest, _metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        return await this.usersService.create(data);
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async getById(_data: GetUserByIdRequest, metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const userId = this.getUserId(metadata);
        const query = await this.usersService.getById(userId);

        if (!query) throwRpcException(getFailedIdNotFound(userId), status.NOT_FOUND);
        return query;
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async update(request: UpdateUserRequest, metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const userId = this.getUserId(metadata);

        if (request.userId !== userId) {
            throwRpcException(updateFailedInvalidPathAndId(userId, request.userId), RpcCodes.PERMISSION_DENIED);
        }
        return await this.usersService.update(request);
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async updatePassword(
        request: UpdatePasswordRequest,
        metadata: Metadata,
        _call: ServerUnaryCall<unknown, unknown>
    ) {
        const userId = this.getUserId(metadata);

        if (request.userId !== userId) {
            throwRpcException(updateFailedInvalidPathAndId(userId, request.userId), RpcCodes.PERMISSION_DENIED);
        }
        return await this.usersService.updatePassword(request);
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async updateEmail(
        request: UpdateEmailRequest,
        metadata: Metadata,
        _call: ServerUnaryCall<unknown, unknown>
    ) {
        const userId = this.getUserId(metadata);

        if (request.userId !== userId) {
            throwRpcException(updateFailedInvalidPathAndId(userId, request.userId), RpcCodes.PERMISSION_DENIED);
        }
        return await this.usersService.updateEmail(request);
    }

    @GrpcMethod(USER_SERVICE_NAME)
    public async remove(request: RemoveUserRequest, metadata: Metadata, _call: ServerUnaryCall<unknown, unknown>) {
        const userId = this.getUserId(metadata);

        if (request.userId !== userId) {
            throwRpcException(updateFailedInvalidPathAndId(userId, request.userId), RpcCodes.PERMISSION_DENIED);
        }
        return await this.usersService.remove(request);
    }

    private getUserId(metadata: Metadata): string {
        return metadata.get('userId')[0] as string;
    }
}
