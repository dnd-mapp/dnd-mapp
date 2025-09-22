import { join } from 'path';
import { withPackage } from './package.provider';

export const USER_PACKAGE_NAME = 'user';

export const USER_CLIENT_NAME = 'USER_PACKAGE';

export const USER_SERVICE_DEFINITION_PATH = 'assets/proto/user.proto';

export const USER_SERVICE_HOST = '0.0.0.0:5000';

export const USER_SERVICE_NAME = 'UsersService';

export function withUserPackage(baseDir: string) {
    return withPackage({
        clientName: USER_CLIENT_NAME,
        packageName: USER_PACKAGE_NAME,
        protoDefinitionPath: join(baseDir, USER_SERVICE_DEFINITION_PATH),
    });
}
