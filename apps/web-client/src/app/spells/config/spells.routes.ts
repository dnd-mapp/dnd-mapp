import { Routes } from '@angular/router';

export const spellsRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview.page')).OverviewPage,
    },
];
