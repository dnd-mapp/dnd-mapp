import { Routes } from '@angular/router';

export const compendiumRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../compendium/compendium.page')).CompendiumPage,
    },
];
