export const createRoleFailedNameTaken = (name: string) =>
    `Could not create Role. - Reason: Name "${name}" is not available`;

export const updateRoleFailedInvalidPathAndId = (path: string, id: string) =>
    `Could not update Role. - Reason: It's forbidden to update Role on path "${path}" with data from Role with ID "${id}"`;

export const getScopesOfRoleFailedInvalidPathAndId = (path: string, id: string) =>
    `Could not get Scopes of Role. - Reason: It's forbidden to get Scopes Role on path "${path}" when using ID "${id}" of another Role`;

export const getScopesOfRoleFailedRoleNotFound = (roleId: string) =>
    `Could not get Scopes of Role. - Reason: Role with ID "${roleId}" was not found`;

export const addScopeToRoleFailedInvalidPathAndId = (path: string, id: string) =>
    `Could not add Scope to Role. - Reason: It's forbidden to add Scopes to Role on path "${path}" when using ID "${id}" of another Role`;

export const addScopeToRoleFailedRoleNotFound = (roleId: string) =>
    `Could not add Scope to Role. - Reason: Role with ID "${roleId}" was not found`;

export const addScopeToRoleFailedScopeNotFound = (roleId: string, scopeId: string) =>
    `Could not add Scope to Role with ID ${roleId}. - Reason: Scope with ID "${scopeId}" was not found`;

export const removeRoleFailedInvalidPathAndId = (path: string, id: string) =>
    `Could not remove Role. - Reason: It's forbidden to remove Role on path "${path}" with when using ID "${id}" from another Role`;

export const removeScopeFromRoleFailedInvalidPathAndId = (path: string, id: string) =>
    `Could not remove Scopes from Role. - Reason: It's forbidden to remove Scopes from Role on path "${path}" when using ID "${id}" of another Role`;

export const updateRoleFailedNotFound = (roleId: string) =>
    `Could not update Role with ID "${roleId}". - Reason: Role was not found`;

export const updateRoleFailedNameTaken = (roleId: string, name: string) =>
    `Could not update Role with ID "${roleId}". - Reason: Name "${name}" is not available`;

export const removeRoleFailedNotFound = (roleId: string) =>
    `Could not remove Role with ID "${roleId}". - Reason: Role was not found`;

export const removeScopeFromRoleFailedRoleNotFound = (roleId: string) =>
    `Could not remove Scope from Role. - Reason: Role with ID "${roleId}" was not found`;

export const removeScopeFromRoleFailedScopeNotFound = (roleId: string, scopeId: string) =>
    `Could not remove Scope from Role with ID ${roleId}. - Reason: Scope with ID "${scopeId}" was not found`;

export const getRoleFailedNameNotFound = (name: string) => `Role with name "${name}" was not found`;

export const getRoleFailedIdNotFound = (roleId: string) => `Role with ID "${roleId}" was not found`;

export const createScopeFailedNameTaken = (name: string) =>
    `Could not create Scope. - Reason: Name "${name}" is not available`;

export const updateScopeFailedInvalidPathAndId = (path: string, id: string) =>
    `Could not update Scope. - Reason: It's forbidden to update Scope on path "${path}" with data from Scope with ID "${id}"`;

export const updateScopeFailedNotFound = (scopeId: string) =>
    `Could not update Scope with ID "${scopeId}". - Reason: Scope was not found`;

export const updateScopeFailedNameTaken = (scopeId: string, name: string) =>
    `Could not update Scope with ID "${scopeId}". - Reason: Name "${name}" is not available`;

export const removeScopeFailedInvalidPathAndId = (path: string, id: string) =>
    `Could not remove Scope. - Reason: It's forbidden to remove Scope on path "${path}" with when using ID "${id}" from another Scope`;

export const removeScopeFailedNotFound = (scopeId: string) =>
    `Could not remove Scope with ID "${scopeId}". - Reason: Scope was not found`;

export const getScopeFailedNameNotFound = (name: string) => `Scope with name "${name}" was not found`;

export const getScopeFailedIdNotFound = (scopeId: string) => `Scope with ID "${scopeId}" was not found`;
