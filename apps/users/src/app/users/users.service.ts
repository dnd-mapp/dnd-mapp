import {
    compareHashToValue,
    createHash,
    CreateUserRequest,
    GetAllUsersResponse,
    GetOneUserRequest,
    RemoveUserData,
    UpdateEmailData,
    UpdatePasswordData,
    UpdateUserData,
    User,
    UsersServiceProducer,
} from '@dnd-mapp/shared-api';
import { status } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import {
    createFailedUsernameTaken,
    getFailedIdNotFound,
    getFailedUsernameNotFound,
    removeFailedNotFound,
    updateFailedEmailMismatch,
    updateFailedEmailVerificationCodeExpired,
    updateFailedEmailVerificationCodeInvalid,
    updateFailedNotFound,
    updateFailedPasswordMismatch,
    updateFailedUsernameTaken,
} from '../models';
import { throwRpcException } from '../utils';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService implements UsersServiceProducer {
    constructor(private readonly usersRepository: UsersRepository) {}

    public async getAll() {
        const users = await this.usersRepository.findAll();
        return plainToInstance(GetAllUsersResponse, { users: users });
    }

    public async getOneBy(data: GetOneUserRequest, throwExceptions = false) {
        const { userId, username } = data;

        let query: User;

        if (userId) {
            query = await this.usersRepository.findOneById(userId);

            if (!query && throwExceptions) throwRpcException(getFailedIdNotFound(userId), status.NOT_FOUND);
        } else if (username) {
            query = await this.usersRepository.findOneByUsername(username);

            if (!query && throwExceptions) throwRpcException(getFailedUsernameNotFound(username), status.NOT_FOUND);
        }
        return query;
    }

    public async create(data: CreateUserRequest) {
        if (await this.isUsernameTaken(data.username)) {
            throwRpcException(createFailedUsernameTaken(data.username), status.INVALID_ARGUMENT);
        }
        data.password = await createHash(data.password);

        return await this.usersRepository.create(data);
    }

    public async update(data: UpdateUserData) {
        if (!(await this.doesUserExist(data.id))) {
            throwRpcException(updateFailedNotFound(data.id), status.NOT_FOUND);
        }
        if (await this.isUsernameTaken(data.username, data.id)) {
            throwRpcException(updateFailedUsernameTaken(data.id, data.username), status.INVALID_ARGUMENT);
        }
        return await this.usersRepository.update(data);
    }

    public async updatePassword(data: UpdatePasswordData) {
        const query = await this.getOneBy({ userId: data.id });

        // Create a hash before every check so that bad actors won't be able to guess
        // the current password based on the response time.
        data.newPassword = await createHash(data.newPassword);

        if (!query) {
            throwRpcException(updateFailedNotFound(data.id), status.NOT_FOUND);
        }
        if (!(await this.doesPasswordMatch(data.password, query.password))) {
            throwRpcException(updateFailedPasswordMismatch(data.id), status.INVALID_ARGUMENT);
        }
        return await this.usersRepository.updatePassword(data);
    }

    public async updateEmail(data: UpdateEmailData) {
        const query = await this.getOneBy({ userId: data.id });

        if (!query) {
            throwRpcException(updateFailedNotFound(data.id), status.NOT_FOUND);
        }
        if (data.email !== query.email) {
            throwRpcException(updateFailedEmailMismatch(data.id), status.INVALID_ARGUMENT);
        }
        if (data.emailVerificationCode !== query.emailVerificationCode) {
            throwRpcException(updateFailedEmailVerificationCodeInvalid(data.id), status.INVALID_ARGUMENT);
        }
        if (new Date().getTime() < query.emailVerificationCodeExpiry.getTime()) {
            throwRpcException(updateFailedEmailVerificationCodeExpired(data.id), status.INVALID_ARGUMENT);
        }
        return await this.usersRepository.updateEmail({
            id: query.id,
            email: data.newEmail,
            emailVerificationCode: null,
            emailVerificationCodeExpiry: null,
            emailVerified: true,
        });
    }

    public async remove(data: RemoveUserData) {
        if (!(await this.doesUserExist(data.id))) {
            throwRpcException(removeFailedNotFound(data.id), status.NOT_FOUND);
        }
        await this.usersRepository.removeById(data.id);
    }

    private doesUserExist = async (userId: string) => Boolean(await this.getOneBy({ userId: userId }));

    private async isUsernameTaken(username: string, userId?: string) {
        const query = await this.getOneBy({ username: username });
        return query && (!userId || userId !== query.id);
    }

    private doesPasswordMatch = async (password: string, hash: string) => await compareHashToValue(password, hash);
}
