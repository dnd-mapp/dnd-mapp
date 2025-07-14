import { Metadata, ServerUnaryCall } from '@grpc/grpc-js';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Observable } from 'rxjs';

export class Scope {
    @IsNotEmpty()
    @IsString()
    public id: string;

    @IsNotEmpty()
    @IsString()
    public name: string;
}

export class Scopes {
    @ValidateNested({ each: true })
    @IsArray()
    public scopes: Scope[];
}

export class GetAllScopesRequest {}

export class GetOneScopeRequest {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    scopeId?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    name?: string;
}

export class CreateScopeRequest {
    @IsNotEmpty()
    @IsString()
    name: string;
}

export class UpdateScopeRequest {
    @IsNotEmpty()
    @IsString()
    public id: string;

    @IsNotEmpty()
    @IsString()
    name: string;
}

export class RemoveScopeRequest {
    @IsNotEmpty()
    @IsString()
    scopeId: string;
}

export interface ScopesServiceProducer {
    getAll(data: GetAllScopesRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<Scopes>;
    getOne(data: GetOneScopeRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<Scope>;
    create(data: CreateScopeRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<Scope>;
    update(data: UpdateScopeRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<Scope>;
    remove(data: RemoveScopeRequest, metadata: Metadata, call: ServerUnaryCall<unknown, unknown>): Promise<void>;
}

export interface ScopesServiceConsumer {
    getAll(data: GetAllScopesRequest): Observable<Scopes>;
    getOne(data: GetOneScopeRequest): Observable<Scope>;
    create(data: CreateScopeRequest): Observable<Scope>;
    update(data: UpdateScopeRequest, metadata: Metadata): Observable<Scope>;
    remove(data: RemoveScopeRequest, metadata: Metadata): Observable<void>;
}
