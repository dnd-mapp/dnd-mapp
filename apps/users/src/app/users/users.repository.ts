import {
    CreateUserRequest,
    DatabaseService,
    UpdateEmailData,
    UpdatePasswordData,
    UpdateUserData,
    User,
} from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from '../../../prisma/client';

@Injectable()
export class UsersRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public findAll = async () => plainToInstance(User, await this.databaseService.prismaClient.user.findMany());

    public findOneById = async (userId: string) =>
        plainToInstance(User, await this.databaseService.prismaClient.user.findUnique({ where: { id: userId } }));

    public findOneByUsername = async (username: string) =>
        plainToInstance(
            User,
            await this.databaseService.prismaClient.user.findUnique({ where: { username: username } })
        );

    public create = async (data: CreateUserRequest) =>
        plainToInstance(User, await this.databaseService.prismaClient.user.create({ data: data }));

    public async update(data: UpdateUserData) {
        const { id, username, status, lastLogin, loginAttempts, lockedUntil } = data;
        return plainToInstance(
            User,
            await this.databaseService.prismaClient.user.update({
                where: { id: id },
                data: {
                    username: username,
                    status: status,
                    lastLogin: lastLogin,
                    loginAttempts: loginAttempts,
                    lockedUntil: lockedUntil,
                },
            })
        );
    }

    public async updatePassword(data: UpdatePasswordData) {
        const { id, password, passwordExpiry } = data;
        return plainToInstance(
            User,
            await this.databaseService.prismaClient.user.update({
                where: { id: id },
                data: {
                    password: password,
                    passwordExpiry: passwordExpiry,
                },
            })
        );
    }

    public async updateEmail(data: UpdateEmailData) {
        const { id, email, emailVerified, emailVerificationCode, emailVerificationCodeExpiry } = data;
        return plainToInstance(
            User,
            await this.databaseService.prismaClient.user.update({
                where: { id: id },
                data: {
                    email: email,
                    emailVerified: emailVerified,
                    emailVerificationCode: emailVerificationCode,
                    emailVerificationCodeExpiry: emailVerificationCodeExpiry,
                },
            })
        );
    }

    public async removeById(userId: string) {
        await this.databaseService.prismaClient.user.delete({ where: { id: userId } });
    }
}
