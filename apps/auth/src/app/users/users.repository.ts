import { DatabaseService } from '@dnd-mapp/shared-api';
import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaClient } from '../../../prisma/client';
import { CreateUserData, transformAllUserRoles, transformUserRoles, UpdateUserData, User } from '../shared';

const selectedUserAttributes = {
    select: {
        id: true,
        username: true,
        password: true,
        passwordExpiry: true,
        email: true,
        emailVerified: true,
        emailVerificationCode: true,
        emailVerificationCodeExpiry: true,
        loginAttempts: true,
        lastLogin: true,
        status: true,
        lockedUntil: true,
        roles: {
            select: {
                role: {
                    select: {
                        id: true,
                        name: true,
                        scopes: {
                            select: {
                                scope: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};

@Injectable()
export class UsersRepository {
    constructor(private readonly databaseService: DatabaseService<PrismaClient>) {}

    public findAll = async () =>
        plainToInstance(
            User,
            transformAllUserRoles(
                await this.databaseService.prisma.user.findMany({
                    ...selectedUserAttributes,
                })
            )
        );

    public findOneById = async (userId: string) =>
        plainToInstance(
            User,
            transformUserRoles(
                await this.databaseService.prisma.user.findFirst({ ...selectedUserAttributes, where: { id: userId } })
            )
        );

    public findOneByUsername = async (username: string) =>
        plainToInstance(
            User,
            transformUserRoles(
                await this.databaseService.prisma.user.findFirst({
                    ...selectedUserAttributes,
                    where: { username: username },
                })
            )
        );

    public async update(data: UpdateUserData) {
        const currentRoles = (await this.findOneById(data.id)).roles;

        return plainToInstance(
            User,
            transformUserRoles(
                await this.databaseService.prisma.user.update({
                    ...selectedUserAttributes,
                    where: { id: data.id },
                    data: {
                        id: data.id,
                        username: data.username,
                        email: data.email,
                        emailVerified: data.emailVerified,
                        emailVerificationCode: data.emailVerificationCode,
                        emailVerificationCodeExpiry: data.emailVerificationCodeExpiry,
                        passwordExpiry: data.passwordExpiry,
                        loginAttempts: data.loginAttempts,
                        lastLogin: data.lastLogin,
                        status: data.status,
                        lockedUntil: data.lockedUntil,
                        roles: {
                            deleteMany: [...currentRoles]
                                .filter((oldRole) => ![...data.roles].some((newRole) => oldRole.id === newRole.id))
                                .map((removedRole) => ({
                                    roleId: removedRole.id,
                                    userId: data.id,
                                })),
                            createMany: {
                                data: [...data.roles]
                                    .filter(
                                        (newRole) => ![...currentRoles].some((oldRole) => newRole.id === oldRole.id)
                                    )
                                    .map((addedRole) => ({
                                        roleId: addedRole.id,
                                        userId: data.id,
                                    })),
                            },
                        },
                    },
                })
            )
        );
    }

    public updatePassword = async (data: User) =>
        plainToInstance(
            User,
            transformUserRoles(
                await this.databaseService.prisma.user.update({
                    ...selectedUserAttributes,
                    where: { id: data.id },
                    data: {
                        password: data.password,
                        passwordExpiry: data.passwordExpiry,
                    },
                })
            )
        );

    public create = async (data: CreateUserData) =>
        plainToInstance(
            User,
            transformUserRoles(
                await this.databaseService.prisma.user.create({
                    ...selectedUserAttributes,
                    data: {
                        username: data.username,
                        email: data.email,
                        emailVerified: data.emailVerified,
                        emailVerificationCode: data.emailVerificationCode,
                        emailVerificationCodeExpiry: data.emailVerificationCodeExpiry,
                        password: data.password,
                        passwordExpiry: data.passwordExpiry,
                        status: data.status,
                        roles: {
                            createMany: {
                                data: [...data.roles].map(({ id }) => ({ roleId: id })),
                            },
                        },
                    },
                })
            )
        );

    public async removeById(userId: string) {
        await this.databaseService.prisma.user.delete({ where: { id: userId } });
    }
}
