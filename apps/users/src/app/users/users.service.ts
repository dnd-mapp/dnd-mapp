import {
    compareHashToValue,
    createHash,
    CreateUserRequest,
    GetAllUsersResponse,
    GetOneUserRequest,
    RemoveUserRequest,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    UpdateUserRequest,
    User,
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
export class UsersService {
    constructor(private readonly usersRepository: UsersRepository) {}

    public async getAll() {
        const users = await this.usersRepository.findAll();
        return plainToInstance(GetAllUsersResponse, { users: users });
    }

    public async getOneBy(data: GetOneUserRequest) {
        const { userId, username } = data;

        let query: User;

        if (userId) {
            query = await this.usersRepository.findOneById(userId);

            if (!query) throwRpcException(getFailedIdNotFound(userId), status.NOT_FOUND);
        } else if (username) {
            query = await this.usersRepository.findOneByUsername(username);

            if (!query) throwRpcException(getFailedUsernameNotFound(username), status.NOT_FOUND);
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

    public async update(data: UpdateUserRequest) {
        if (!(await this.doesUserExist(data.userId))) {
            throwRpcException(updateFailedNotFound(data.userId), status.NOT_FOUND);
        }
        if (await this.isUsernameTaken(data.username, data.userId)) {
            throwRpcException(updateFailedUsernameTaken(data.userId, data.username), status.INVALID_ARGUMENT);
        }
        return await this.usersRepository.update(data);
    }

    public async updatePassword(data: UpdatePasswordRequest) {
        const query = await this.getOneBy({ userId: data.userId });

        // Create a hash before every check so that bad actors won't be able to guess
        // the current password based on the response time.
        data.newPassword = await createHash(data.newPassword);

        if (!query) {
            throwRpcException(updateFailedNotFound(data.userId), status.NOT_FOUND);
        }
        if (!(await this.doesPasswordMatch(data.oldPassword, query.password))) {
            throwRpcException(updateFailedPasswordMismatch(data.userId), status.INVALID_ARGUMENT);
        }
        return await this.usersRepository.updatePassword(data);
    }

    public async updateEmail(data: UpdateEmailRequest) {
        const query = await this.getOneBy({ userId: data.userId });

        if (!query) {
            throwRpcException(updateFailedNotFound(data.userId), status.NOT_FOUND);
        }
        if (data.oldEmail !== query.email) {
            throwRpcException(updateFailedEmailMismatch(data.userId), status.INVALID_ARGUMENT);
        }
        if (data.emailVerificationCode !== query.emailVerificationCode) {
            throwRpcException(updateFailedEmailVerificationCodeInvalid(data.userId), status.INVALID_ARGUMENT);
        }
        if (new Date().getTime() < query.emailVerificationCodeExpiry.getTime()) {
            throwRpcException(updateFailedEmailVerificationCodeExpired(data.userId), status.INVALID_ARGUMENT);
        }
        return await this.usersRepository.updateEmail({
            userId: query.id,
            oldEmail: data.oldEmail,
            newEmail: data.newEmail,
            emailVerificationCode: null,
            emailVerificationCodeExpiry: data.emailVerificationCodeExpiry,
            emailVerified: true,
        });
    }

    public async remove(data: RemoveUserRequest) {
        if (!(await this.doesUserExist(data.userId))) {
            throwRpcException(removeFailedNotFound(data.userId), status.NOT_FOUND);
        }
        await this.usersRepository.removeById(data.userId);
    }

    private doesUserExist = async (userId: string) => Boolean(await this.getOneBy({ userId: userId }));

    private async isUsernameTaken(username: string, userId?: string) {
        const query = await this.getOneBy({ username: username });
        return query && (!userId || userId !== query.id);
    }

    private doesPasswordMatch = async (password: string, hash: string) => await compareHashToValue(password, hash);
}
