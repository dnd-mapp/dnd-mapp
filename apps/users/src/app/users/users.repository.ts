import {
    CreateUserRequest,
    DatabaseService,
    UpdateEmailRequest,
    UpdatePasswordRequest,
    UpdateUserRequest,
    User,
} from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from '../../../prisma/client';

@Injectable()
export class UsersRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public findAll = async () => plainToInstance(User, await this.databaseService.prisma.user.findMany());

    public findOneById = async (userId: string) =>
        plainToInstance(User, await this.databaseService.prisma.user.findUnique({ where: { id: userId } }));

    public findOneByUsername = async (username: string) =>
        plainToInstance(User, await this.databaseService.prisma.user.findUnique({ where: { username: username } }));

    public create = async (data: CreateUserRequest) =>
        plainToInstance(User, await this.databaseService.prisma.user.create({ data: data }));

    public async update(data: UpdateUserRequest) {
        const { userId, username, status, lastLogin, loginAttempts, lockedUntil } = data;
        return plainToInstance(
            User,
            await this.databaseService.prisma.user.update({
                where: { id: userId },
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

    public async updatePassword(data: UpdatePasswordRequest) {
        const { userId, newPassword, passwordExpiry } = data;
        return plainToInstance(
            User,
            await this.databaseService.prisma.user.update({
                where: { id: userId },
                data: {
                    password: newPassword,
                    passwordExpiry: passwordExpiry,
                },
            })
        );
    }

    public async updateEmail(data: UpdateEmailRequest) {
        const { userId, newEmail, emailVerified, emailVerificationCode, emailVerificationCodeExpiry } = data;
        return plainToInstance(
            User,
            await this.databaseService.prisma.user.update({
                where: { id: userId },
                data: {
                    email: newEmail,
                    emailVerified: emailVerified,
                    emailVerificationCode: emailVerificationCode,
                    emailVerificationCodeExpiry: emailVerificationCodeExpiry,
                },
            })
        );
    }

    public async removeById(userId: string) {
        await this.databaseService.prisma.user.delete({ where: { id: userId } });
    }
}
