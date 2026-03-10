import { Routes } from '@angular/router';

export const characterRoutes: Routes = [
    {
        path: '',
        loadComponent: async () =>
            (await import('../characters-overview/characters-overview.page')).CharactersOverviewPage,
    },
];
