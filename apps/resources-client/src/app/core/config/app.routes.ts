import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: async () => (await import('../home')).HomePage,
    },
    {
        path: 'not-found',
        loadComponent: async () => (await import('../not-found')).NotFoundPage,
    },
    {
        path: 'resources',
        loadChildren: async () => (await import('../../resources')).resourcesRoutes,
    },
    {
        path: 'settings',
        loadChildren: async () => (await import('../../settings')).settingsRoutes,
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
