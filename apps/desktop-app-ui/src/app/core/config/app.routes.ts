import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: '',
        loadComponent: async () => (await import('../home')).HomePage,
    },
    {
        path: 'notifications',
        loadComponent: async () => (await import('../../notifications')).NotificationsPage,
    },
    {
        path: 'settings',
        loadComponent: async () => (await import('../../settings')).SettingsPage,
    },
    {
        path: '**',
        redirectTo: '',
    },
];
