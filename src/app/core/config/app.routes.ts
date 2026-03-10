import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'not-found',
        loadComponent: async () => (await import('../not-found/not-found.page')).NotFoundPage,
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
