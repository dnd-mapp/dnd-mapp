import { Routes } from '@angular/router';

export const campaignsRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview.page')).OverviewPage,
    },
];
