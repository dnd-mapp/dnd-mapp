import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: async () => (await import('../home')).HomePage,
    },
    {
        path: 'login',
        loadComponent: async () => (await import('../../auth')).LoginPage,
    },
    {
        path: 'not-found',
        loadComponent: async () => (await import('../not-found')).NotFoundPage,
    },
    {
        path: 'reset-password',
        loadChildren: async () => (await import('../../auth')).ResetPasswordPage,
    },
    {
        path: 'roles',
        loadChildren: async () => (await import('../../roles')).roleRoutes,
    },
    {
        path: 'scopes',
        loadChildren: async () => (await import('../../scopes')).scopeRoutes,
    },
    {
        path: 'settings',
        loadChildren: async () => (await import('../../settings')).settingsRoutes,
    },
    {
        path: 'sign-up',
        loadComponent: async () => (await import('../../auth')).SignUpPage,
    },
    {
        path: 'users',
        loadChildren: async () => (await import('../../users')).userRoutes,
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
