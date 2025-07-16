import {
    CreateScopeRequest,
    SCOPE_CLIENT_NAME,
    SCOPE_SERVICE_NAME,
    type ScopesServiceConsumer as ScopesService,
    UpdateScopeRequest,
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
    UseInterceptors,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Controller('/scopes')
@UseInterceptors(ClassSerializerInterceptor)
export class ScopesController implements OnModuleInit {
    private scopesService: ScopesService;

    constructor(@Inject(SCOPE_CLIENT_NAME) private readonly grpcClient: ClientGrpc) {}

    public onModuleInit() {
        this.scopesService = this.grpcClient.getService(SCOPE_SERVICE_NAME);
    }

    @Get()
    public async getAll() {
        return await lastValueFrom(this.scopesService.getAll({ withRoles: true }));
    }

    @Post()
    public async create(@Body() data: CreateScopeRequest) {
        return await lastValueFrom(this.scopesService.create(data));
    }

    @Get('/:scopeId')
    public async getById(@Param('scopeId') scopeId: string) {
        const metadata = new Metadata();
        metadata.set('scopeId', scopeId);

        return await lastValueFrom(this.scopesService.getById({}, metadata));
    }

    @Put('/:scopeId')
    public async update(@Param('scopeId') scopeId: string, @Body() data: UpdateScopeRequest) {
        const metadata = new Metadata();
        metadata.set('scopeId', scopeId);

        return await lastValueFrom(this.scopesService.update(data, metadata));
    }

    @Delete('/:scopeId')
    public async remove(@Param('scopeId') scopeId: string) {
        const metadata = new Metadata();
        metadata.set('scopeId', scopeId);

        await lastValueFrom(this.scopesService.remove({ scopeId: scopeId }, metadata));
    }
}
