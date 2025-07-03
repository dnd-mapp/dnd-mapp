import { prettifyError, rpcCodeToHttpError, rpcCodeToHttpStatus } from '@dnd-mapp/api-shared';
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import type { FastifyReply } from 'fastify';

@Catch(Error)
export class RpcExceptionFilter implements ExceptionFilter<unknown> {
    public catch(exception: unknown, host: ArgumentsHost) {
        if (exception instanceof HttpException) throw exception;

        if (
            typeof exception === 'object' &&
            'code' in exception &&
            typeof exception.code === 'number' &&
            'details' in exception
        ) {
            const ctx = host.switchToHttp();
            const response = ctx.getResponse<FastifyReply>();

            response
                .status(rpcCodeToHttpStatus(exception.code))
                .send({ error: prettifyError(rpcCodeToHttpError(exception.code)), message: exception.details });
        }
    }
}
