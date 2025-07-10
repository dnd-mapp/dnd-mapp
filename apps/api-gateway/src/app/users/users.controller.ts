import {
    CreateUserRequest,
    HttpStatuses,
    UpdateEmailData,
    UpdatePasswordData,
    UpdateUserData,
    USER_CLIENT_NAME,
    USER_SERVICE_NAME,
    type UsersServiceConsumer as UsersService,
} from '@dnd-mapp/shared-api';
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
    Res,
    UseInterceptors,
} from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import type { FastifyReply } from 'fastify';
import { lastValueFrom, map } from 'rxjs';

@Controller('/users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController implements OnModuleInit {
    private usersService: UsersService;

    constructor(@Inject(USER_CLIENT_NAME) private readonly grpcClient: ClientGrpc) {}

    public onModuleInit() {
        this.usersService = this.grpcClient.getService(USER_SERVICE_NAME);
    }

    @Get()
    public async getAll() {
        return await lastValueFrom(this.usersService.getAll({}).pipe(map(({ users }) => users)));
    }

    @Post()
    public async create(data: CreateUserRequest, @Res({ passthrough: true }) response: FastifyReply) {
        const created = await lastValueFrom(this.usersService.create(data));

        response.status(HttpStatuses.CREATED).header('location', `${response.request.url}/${created.id}`);
        return created;
    }

    @Get('/:userId')
    public async getById(@Param('userId') userId: string) {
        return await lastValueFrom(this.usersService.getOneBy({ userId: userId }));
    }

    @Put('/:userId')
    public async update(@Param('userId') userId: string, @Body() data: UpdateUserData) {
        return await lastValueFrom(this.usersService.update({ userId: userId, data: data }));
    }

    @Put('/:userId/password')
    public async updatePassword(@Param('userId') userId: string, @Body() data: UpdatePasswordData) {
        return await lastValueFrom(this.usersService.updatePassword({ userId: userId, data: data }));
    }

    @Put('/:userId/email')
    public async updateEmail(@Param('userId') userId: string, @Body() data: UpdateEmailData) {
        return await lastValueFrom(this.usersService.updateEmail({ userId: userId, data: data }));
    }

    @Delete('/:userId')
    public async remove(@Param('userId') userId: string) {
        await lastValueFrom(this.usersService.remove({ userId: userId, data: { id: userId } }));
    }
}
