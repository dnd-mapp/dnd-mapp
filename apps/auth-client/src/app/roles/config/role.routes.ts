import { Routes } from '@angular/router';

export const roleRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview')).RolesOverviewPage,
    },
];
