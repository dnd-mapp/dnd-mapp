import { Routes } from '@angular/router';

export const userRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview')).UsersOverviewPage,
    },
];
