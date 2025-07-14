export interface Scope {
    id: string;
    name: string;
    roles?: RoleScope[];
}

export interface Role {
    id: string;
    name: string;
    scopes?: RoleScope[];
}

export interface RoleScope {
    scope?: Scope;
    role?: Role;
}

export const selectScopes = {
    scopes: {
        select: {
            scope: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
} as const;
