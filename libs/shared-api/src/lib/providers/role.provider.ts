import { join } from 'path';
import { withPackage } from './package.provider';

export const ROLE_PACKAGE_NAME = 'role';

export const SCOPE_PACKAGE_NAME = 'scope';

export const ROLE_CLIENT_NAME = 'ROLE_PACKAGE';

export const SCOPE_CLIENT_NAME = 'SCOPE_PACKAGE';

export const ROLE_SERVICE_DEFINITION_PATH = 'assets/proto/role.proto';

export const SCOPE_SERVICE_DEFINITION_PATH = 'assets/proto/scope.proto';

export const ROLE_SERVICE_HOST = '0.0.0.0:5100';

export const ROLE_SERVICE_NAME = 'RolesService';

export const SCOPE_SERVICE_NAME = 'ScopesService';

export function withRolePackage(baseDir: string) {
    return withPackage({
        clientName: ROLE_CLIENT_NAME,
        packageName: ROLE_PACKAGE_NAME,
        protoDefinitionPath: join(baseDir, ROLE_SERVICE_DEFINITION_PATH),
    });
}

export function withScopePackage(baseDir: string) {
    return withPackage({
        clientName: SCOPE_CLIENT_NAME,
        packageName: SCOPE_PACKAGE_NAME,
        protoDefinitionPath: join(baseDir, SCOPE_SERVICE_DEFINITION_PATH),
    });
}
