import { ClientProviderOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const ROLE_PACKAGE_NAME = 'role';

export const SCOPE_PACKAGE_NAME = 'scope';

export const ROLE_CLIENT_NAME = 'ROLE_PACKAGE';

export const SCOPE_CLIENT_NAME = 'SCOPE_PACKAGE';

export const ROLE_SERVICE_DEFINITION_PATH = 'assets/proto/role.proto';

export const SCOPE_SERVICE_DEFINITION_PATH = 'assets/proto/scope.proto';

export const ROLE_SERVICE_HOST = '0.0.0.0:5100';

export const ROLE_SERVICE_NAME = 'RolesService';

export const SCOPE_SERVICE_NAME = 'ScopesService';

export function withRolePackage(baseDir: string): ClientProviderOptions {
    return {
        name: ROLE_CLIENT_NAME,
        transport: Transport.GRPC,
        options: {
            package: ROLE_PACKAGE_NAME,
            protoPath: join(baseDir, ROLE_SERVICE_DEFINITION_PATH),
        },
    };
}

export function withScopePackage(baseDir: string): ClientProviderOptions {
    return {
        name: SCOPE_CLIENT_NAME,
        transport: Transport.GRPC,
        options: {
            package: SCOPE_PACKAGE_NAME,
            protoPath: join(baseDir, SCOPE_SERVICE_DEFINITION_PATH),
        },
    };
}
