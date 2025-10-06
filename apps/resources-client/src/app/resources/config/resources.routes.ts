import { Routes } from '@angular/router';
import { ResourceTypes } from '../resource-options';

export const resourcesRoutes: Routes = [
    {
        path: '',
        loadComponent: async () => (await import('../overview.page')).OverviewPage,
        children: [
            {
                path: ResourceTypes.BACKGROUNDS,
                redirectTo: '/resources',
            },
            {
                path: ResourceTypes.CLASSES,
                redirectTo: '/resources',
            },
            {
                path: ResourceTypes.ITEMS,
                redirectTo: '/resources',
            },
            {
                path: ResourceTypes.RACES,
                redirectTo: '/resources',
            },
            {
                path: ResourceTypes.SPELLS,
                loadComponent: async () => (await import('../resource-types/spells')).SpellForm,
            },
        ],
    },
];
