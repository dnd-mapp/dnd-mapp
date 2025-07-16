import {
    AddScopeRequest,
    CreateRoleRequest,
    ROLE_CLIENT_NAME,
    ROLE_SERVICE_NAME,
    type RolesServiceConsumer as RolesService,
    UpdateRoleRequest,
} from '@dnd-mapp/shared-api';
import { Metadata } from '@grpc/grpc-js';
import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Inject,
    OnModuleInit,
    Param,
    Post,
    Put,
    Query,
    UseInterceptors,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, map } from 'rxjs';
import { GetAllRolesQueryParam } from './models';

@Controller('/roles')
@UseInterceptors(ClassSerializerInterceptor)
export class RolesController implements OnModuleInit {
    private rolesService: RolesService;

    constructor(@Inject(ROLE_CLIENT_NAME) private readonly grpcClient: ClientGrpc) {}

    public onModuleInit() {
        this.rolesService = this.grpcClient.getService(ROLE_SERVICE_NAME);
    }

    @Get()
    public async getAll(@Query() queryParams: GetAllRolesQueryParam) {
        return await lastValueFrom(
            this.rolesService.getAll({ hasScopes: queryParams.hasRoles }).pipe(map(({ roles }) => roles))
        );
    }

    @Post()
    public async create(@Body() data: CreateRoleRequest) {
        return await lastValueFrom(this.rolesService.create(data));
    }

    @Get('/:roleId')
    public async getById(@Param('roleId') roleId: string) {
        const metadata = new Metadata();
        metadata.set('roleId', roleId);

        return await lastValueFrom(this.rolesService.getById({}, metadata));
    }

    @Put('/:roleId')
    public async update(@Param('roleId') roleId: string, @Body() data: UpdateRoleRequest) {
        const metadata = new Metadata();
        metadata.set('roleId', roleId);

        return await lastValueFrom(this.rolesService.update(data, metadata));
    }

    @Delete('/:roleId')
    public async remove(@Param('roleId') roleId: string) {
        const metadata = new Metadata();
        metadata.set('roleId', roleId);

        await lastValueFrom(this.rolesService.remove({ roleId: roleId }, metadata));
    }

    @Get('/:roleId/scopes')
    public async getRoleScopes(@Param('roleId') roleId: string) {
        const metadata = new Metadata();
        metadata.set('roleId', roleId);

        return await lastValueFrom(
            this.rolesService.getAllScopesOfRole({ roleId: roleId }, metadata).pipe(map(({ scopes }) => scopes))
        );
    }

    @Post('/:roleId/scopes')
    public async addScope(@Param('roleId') roleId: string, @Body() data: AddScopeRequest) {
        const metadata = new Metadata();
        metadata.set('roleId', roleId);

        return await lastValueFrom(this.rolesService.addScope(data, metadata));
    }

    @Delete('/:roleId/scopes/:scopeId')
    public async removeScopeFromRole(@Param('roleId') roleId: string, @Param('scopeId') scopeId: string) {
        const metadata = new Metadata();
        metadata.set('roleId', roleId);

        return await lastValueFrom(this.rolesService.removeScope({ roleId: roleId, scopeId: scopeId }, metadata));
    }
}
