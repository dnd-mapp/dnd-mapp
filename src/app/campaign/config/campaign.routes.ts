import { Routes } from '@angular/router';

export const campaignRoutes: Routes = [
    {
        path: '',
        loadComponent: async () =>
            (await import('../campaigns-overview/campaigns-overview.page')).CampaignsOverviewPage,
    },
];
