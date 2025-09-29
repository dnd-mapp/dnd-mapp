import { Routes } from '@angular/router';

export const charactersRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview.page')).OverviewPage,
    },
];
