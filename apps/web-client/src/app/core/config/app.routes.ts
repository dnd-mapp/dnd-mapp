import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: async () => (await import('../home')).HomePage,
    },
    {
        path: 'campaigns',
        loadChildren: async () => (await import('../../campaigns')).campaignsRoutes,
    },
    {
        path: 'characters',
        loadChildren: async () => (await import('../../characters')).charactersRoutes,
    },
    {
        path: 'not-found',
        loadComponent: async () => (await import('../not-found')).NotFoundPage,
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
