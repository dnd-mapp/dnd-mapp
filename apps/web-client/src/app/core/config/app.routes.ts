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
        path: 'not-found',
        loadComponent: async () => (await import('../not-found')).NotFoundPage,
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
