import { RpcException } from '@nestjs/microservices';

export function throwRpcException(message: string, code: number) {
    throw new RpcException({
        message: message,
        code: code,
    });
}
