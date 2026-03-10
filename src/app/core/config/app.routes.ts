import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../home/home.page')).HomePage,
    },
    {
        path: 'campaigns',
        loadChildren: async () => (await import('../../campaign/config/campaign.routes')).campaignRoutes,
    },
    {
        path: 'characters',
        loadChildren: async () => (await import('../../character/config/character.routes')).characterRoutes,
    },
    {
        path: 'not-found',
        loadComponent: async () => (await import('../not-found/not-found.page')).NotFoundPage,
    },
    {
        path: '**',
        redirectTo: 'not-found',
    },
];
