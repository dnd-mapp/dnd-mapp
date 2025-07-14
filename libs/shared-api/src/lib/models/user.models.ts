import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { PickType } from '@nestjs/mapped-types';
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

export class GetAllRequest {}

export class GetAllUsersResponse {
    @ValidateNested({ each: true })
    @Type(() => User)
    users: User[];
}

export class GetOneUserRequest {
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public userId?: string;

    @IsString()
    @IsNotEmpty()
    @IsOptional()
    public username?: string;
}

export class CreateUserRequest extends PickType(User, [
    'username',
    'email',
    'emailVerified',
    'emailVerificationCodeExpiry',
    'status',
    'lockedUntil',
    'password',
    'passwordExpiry',
] as const) {}

export class RemoveUserRequest {
    @IsString()
    @IsNotEmpty()
    public userId: string;
}

export class UpdateUserRequest extends PickType(User, [
    'username',
    'passwordExpiry',
    'emailVerified',
    'emailVerificationCode',
    'emailVerificationCodeExpiry',
    'loginAttempts',
    'lastLogin',
    'status',
    'lockedUntil',
] as const) {
    @IsString()
    @IsNotEmpty()
    public userId: string;
}

export class UpdatePasswordRequest extends PickType(User, ['passwordExpiry'] as const) {
    @IsString()
    @IsNotEmpty()
    public userId: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(12)
    public newPassword: string;

    @IsString()
    @IsNotEmpty()
    public oldPassword: string;
}

export class UpdateEmailRequest extends PickType(User, [
    'emailVerified',
    'emailVerificationCode',
    'emailVerificationCodeExpiry',
] as const) {
    @IsString()
    @IsNotEmpty()
    public userId: string;

    @IsEmail({ allow_display_name: false, require_display_name: false, require_tld: true, allow_ip_domain: false })
    @IsNotEmpty()
    @IsString()
    public newEmail?: string;

    @IsString()
    @IsNotEmpty()
    public oldEmail: string;
}

export interface UsersServiceProducer {
    getAll(
        data: GetAllRequest,
        metadata: Metadata,
        call: ServerUnaryCall<unknown, unknown>
    ): Promise<GetAllUsersResponse>;
    getOneBy(data: GetOneUserRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<User>;
    create(data: CreateUserRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<User>;
    update(data: UpdateUserRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<User>;
    updatePassword(
        data: UpdatePasswordRequest,
        metadata: Metadata,
        call: ServerUnaryCall<unknown, unknown>
    ): Promise<User>;
    updateEmail(data: UpdateEmailRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<User>;
    remove(data: RemoveUserRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<void>;
}

export interface UsersServiceConsumer {
    getAll(data: GetAllRequest): Observable<GetAllUsersResponse>;
    getOneBy(data: GetOneUserRequest): Observable<User>;
    create(data: CreateUserRequest): Observable<User>;
    update(data: UpdateUserRequest, metadata: Metadata): Observable<User>;
    updatePassword(data: UpdatePasswordRequest, metadata: Metadata): Observable<User>;
    updateEmail(data: UpdateEmailRequest, metadata: Metadata): Observable<User>;
    remove(data: RemoveUserRequest, metadata: Metadata): Observable<void>;
}
