import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview')).SettingsOverviewPage,
    },
];
