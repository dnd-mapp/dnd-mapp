import { Routes } from '@angular/router';

export const rulesRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview.page')).OverviewPage,
    },
];
