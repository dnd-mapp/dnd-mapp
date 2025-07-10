import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const USER_PACKAGE_NAME = 'user';

export const USER_CLIENT_NAME = 'USER_PACKAGE';

export const USER_SERVICE_DEFINITION_PATH = 'assets/user.proto';

export const USER_SERVICE_HOST = '0.0.0.0:5000';

export const USER_SERVICE_NAME = 'UsersService';

export const withUserPackage = (basePath: string) => {
    return {
        name: USER_CLIENT_NAME,
        transport: Transport.GRPC,
        options: {
            package: USER_PACKAGE_NAME,
            protoPath: join(basePath, USER_SERVICE_DEFINITION_PATH),
        },
    } satisfies ClientProviderOptions;
};
