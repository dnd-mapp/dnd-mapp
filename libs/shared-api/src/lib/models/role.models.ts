import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Observable } from 'rxjs';
import { Scope, Scopes } from './scope.models';

export class Role {
    @IsNotEmpty()
    @IsString()
    public id: string;

    @IsNotEmpty()
    @IsString()
    public name: string;

    @ValidateNested()
    public scopes: Scope[];
}

export class Roles {
    @ValidateNested()
    @IsArray()
    public roles: Role[];
}

export class GetAllRolesRequest {
    @IsNotEmpty({ each: true })
    @IsString({ each: true })
    @IsArray()
    public hasScopes: string[];
}

export class GetRoleByIdRequest {}

export class GetAllScopesOfRoleRequest {
    @IsNotEmpty()
    @IsString()
    public roleId: string;
}

export class CreateRoleRequest {
    @IsNotEmpty()
    @IsString()
    public name: string;
}

export class AddScopeRequest {
    @IsNotEmpty()
    @IsString()
    public roleId: string;

    @IsNotEmpty()
    @IsString()
    public scopeId: string;
}

export class UpdateRoleRequest {
    @IsNotEmpty()
    @IsString()
    public id: string;

    @IsNotEmpty()
    @IsString()
    public name: string;
}

export class RemoveRoleRequest {
    @IsNotEmpty()
    @IsString()
    public roleId: string;
}

export class RemoveScopeFromRoleRequest {
    @IsNotEmpty()
    @IsString()
    public roleId: string;

    @IsNotEmpty()
    @IsString()
    public scopeId: string;
}

export interface RolesServiceProducer {
    getAll(data: GetAllRolesRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<Roles>;

    create(data: CreateRoleRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<Role>;

    getById(data: GetRoleByIdRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<Role>;

    update(data: UpdateRoleRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<Role>;

    remove(data: RemoveRoleRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<void>;

    getAllScopesOfRole(
        data: GetAllScopesOfRoleRequest,
        metadata: Metadata,
        call: ServerUnaryCall<unknown, unknown>
    ): Promise<Scopes>;

    addScope(data: AddScopeRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<Role>;

    removeScope(
        data: RemoveScopeFromRoleRequest,
        metadata: Metadata,
        call: ServerUnaryCall<unknown, unknown>
    ): Promise<Role>;
}

export interface RolesServiceConsumer {
    getAll(data: GetAllRolesRequest): Observable<Roles>;
    create(data: CreateRoleRequest): Observable<Role>;

    getById(data: GetRoleByIdRequest, metadata: Metadata): Observable<Role>;
    update(data: UpdateRoleRequest, metadata: Metadata): Observable<Role>;
    remove(data: RemoveRoleRequest, metadata: Metadata): Observable<void>;

    getAllScopesOfRole(data: GetAllScopesOfRoleRequest, metadata: Metadata): Observable<Scopes>;
    addScope(data: AddScopeRequest, metadata: Metadata): Observable<Role>;
    removeScope(data: RemoveScopeFromRoleRequest, metadata: Metadata): Observable<Role>;
}
