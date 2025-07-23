import { Routes } from '@angular/router';

export const scopeRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview')).ScopesOverviewPage,
    },
];
