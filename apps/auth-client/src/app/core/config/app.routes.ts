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
        path: 'users',
        loadChildren: async () => (await import('../../users')).userRoutes,
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
