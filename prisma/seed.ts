import {
    AccountStatuses,
    AppModule,
    ClientsService,
    Roles,
    RolesService,
    ScopeNames,
    ScopesService,
    UsersService,
} from '@dnd-mapp/auth';
import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

let app: INestApplication<unknown>;

async function generateDefaultRoles() {
    console.log('Generating default Roles...');
    const rolesService = app.get(RolesService);

    await Promise.all([
        rolesService.create({ name: Roles.USER }),
        rolesService.create({ name: Roles.ADMIN }),
        rolesService.create({ name: Roles.SUPER_ADMIN }),
    ]);
}

async function generateDefaultScopes() {
    console.log('Generating default Scopes...');
    const rolesService = app.get(RolesService);
    const scopesService = app.get(ScopesService);

    const userRole = await rolesService.getByName(Roles.USER);
    const adminRole = await rolesService.getByName(Roles.ADMIN);

    await scopesService.create({ name: ScopeNames.CHANGE_PASSWORD, roles: new Set([userRole]) });
    await scopesService.create({ name: ScopeNames.ROTATE_KEYS, roles: new Set([adminRole]) });

    await scopesService.create({ name: ScopeNames.CREATE_USERS, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.READ_USERS, roles: new Set([userRole]) });
    await scopesService.create({ name: ScopeNames.UPDATE_USERS, roles: new Set([userRole]) });
    await scopesService.create({ name: ScopeNames.DELETE_USERS, roles: new Set([userRole]) });

    await scopesService.create({ name: ScopeNames.CREATE_CLIENTS, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.READ_CLIENTS, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.UPDATE_CLIENTS, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.DELETE_CLIENTS, roles: new Set([adminRole]) });

    await scopesService.create({ name: ScopeNames.CREATE_SCOPES, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.READ_SCOPES, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.UPDATE_SCOPES, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.DELETE_SCOPES, roles: new Set([adminRole]) });

    await scopesService.create({ name: ScopeNames.CREATE_ROLES, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.READ_ROLES, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.UPDATE_ROLES, roles: new Set([adminRole]) });
    await scopesService.create({ name: ScopeNames.DELETE_ROLES, roles: new Set([adminRole]) });
}

async function generateDefaultUsers() {
    console.log('Generating default Users...');
    const usersService = app.get(UsersService);
    const rolesService = app.get(RolesService);

    const userRole = await rolesService.getByName(Roles.USER);
    const adminRole = await rolesService.getByName(Roles.ADMIN);
    const superAdminRole = await rolesService.getByName(Roles.SUPER_ADMIN);

    await usersService.create(
        {
            username: 'Admin',
            password: 'changemenow',
            roles: new Set([userRole, adminRole, superAdminRole]),
            passwordExpiry: new Date(),
            status: AccountStatuses.ACTIVE,
            emailVerified: false,
            email: null,
        },
        null
    );
}

async function generateDefaultClient() {
    console.log('Generating default Clients...');
    const clientsService = app.get(ClientsService);

    await clientsService.create({
        audience: 'dnd-mapp/authorization-server',
        redirectURLs: [
            { url: 'https://localhost.auth.dndmapp.net/app' },
            { url: 'https://auth.dndmapp.nl.eu.org/app' },
        ],
    });
}

async function main() {
    console.log('Generating default dataset...');
    app = await NestFactory.create(AppModule);

    await generateDefaultRoles();
    await generateDefaultScopes();
    await generateDefaultUsers();
    await generateDefaultClient();

    await app.close();
    console.log('Done.');
}

(async () => {
    try {
        await main();
    } catch (error) {
        console.error(error);
    }
})();
