import { PartialType, PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
    IsBoolean,
    IsDate,
    IsEmail,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    Max,
    Min,
    MinLength,
    ValidateNested,
} from 'class-validator';
import { Observable } from 'rxjs';
import { type AccountStatus, AccountStatuses } from './account-status.models';
import type { WrapperType } from './common';

export const MAX_LOGIN_ATTEMPTS = 3;

export class User {
    @IsString()
    @IsNotEmpty()
    public id: string;

    @IsString()
    @IsNotEmpty()
    public username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(12)
    public password: string;

    @IsDate()
    @IsOptional()
    public passwordExpiry?: Date;

    @IsEmail({ allow_display_name: false, require_display_name: false, require_tld: true, allow_ip_domain: false })
    @IsNotEmpty()
    @IsString()
    public email: string;

    @IsBoolean()
    public emailVerified: boolean;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    public emailVerificationCode?: string;

    @IsDate()
    @IsOptional()
    public emailVerificationCodeExpiry?: Date;

    @Max(MAX_LOGIN_ATTEMPTS)
    @Min(0)
    @IsInt()
    public loginAttempts: number;

    @IsDate()
    @IsOptional()
    public lastLogin?: Date;

    @IsEnum(AccountStatuses)
    @IsString()
    public status: AccountStatus;

    @IsDate()
    @IsOptional()
    public lockedUntil?: Date;
}

export class GetAllUsersRequest {}

export class GetAllUsersResponse {
    @ValidateNested({ each: true })
    @Type(() => User)
    users: User[];
}

export class GetOneUserRequest extends PartialType(PickType(User, ['username'] as const)) {
    @IsString()
    @IsNotEmpty()
    public userId?: string;
}

export class CreateUserRequest extends PickType(User, [
    'username',
    'email',
    'emailVerified',
    'password',
    'passwordExpiry',
] as const) {}

export class RemoveUserData extends PickType(User, ['id'] as const) {}

export class RemoveUserRequest {
    @IsString()
    @IsNotEmpty()
    public userId: string;

    @ValidateNested()
    public data: WrapperType<RemoveUserData>;
}

export class UpdateUserData extends PickType(User, [
    'id',
    'username',
    'loginAttempts',
    'lastLogin',
    'status',
    'lockedUntil',
] as const) {}

export class UpdateUserRequest {
    @IsString()
    @IsNotEmpty()
    public userId: string;

    @ValidateNested()
    public data: WrapperType<UpdateUserData>;
}

export class UpdatePasswordData extends PickType(User, ['id', 'password', 'passwordExpiry'] as const) {
    @IsString()
    @IsNotEmpty()
    @MinLength(12)
    public newPassword: string;
}

export class UpdatePasswordRequest {
    @IsString()
    @IsNotEmpty()
    public userId: string;

    @ValidateNested()
    public data: WrapperType<UpdatePasswordData>;
}

export class UpdateEmailData extends PickType(User, [
    'id',
    'email',
    'emailVerified',
    'emailVerificationCode',
    'emailVerificationCodeExpiry',
] as const) {
    @IsEmail({ allow_display_name: false, require_display_name: false, require_tld: true, allow_ip_domain: false })
    @IsNotEmpty()
    @IsString()
    public newEmail?: string;
}

export class UpdateEmailRequest {
    @IsString()
    @IsNotEmpty()
    public userId: string;

    @ValidateNested()
    public data: WrapperType<UpdateEmailData>;
}

export interface UsersServiceProducer {
    getAll(data: GetAllUsersRequest): Promise<GetAllUsersResponse>;
    getOneBy(data: GetOneUserRequest, throwsExceptions?: boolean): Promise<User>;
    create(data: CreateUserRequest): Promise<User>;
    update(data: UpdateUserData): Promise<User>;
    updatePassword(data: UpdatePasswordData): Promise<User>;
    updateEmail(data: UpdateEmailData): Promise<User>;
    remove(data: RemoveUserData): Promise<void>;
}

export interface UsersServiceConsumer {
    getAll(data: GetAllUsersRequest): Observable<GetAllUsersResponse>;
    getOneBy(data: GetOneUserRequest, throwsExceptions?: boolean): Observable<User>;
    create(data: CreateUserRequest): Observable<User>;
    update(data: UpdateUserRequest): Observable<User>;
    updatePassword(data: UpdatePasswordRequest): Observable<User>;
    updateEmail(data: UpdateEmailRequest): Observable<User>;
    remove(data: RemoveUserRequest): Observable<void>;
}
