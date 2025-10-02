import { http, HttpResponse } from 'msw';
import { RESOURCE_SERVER_BASE_URL } from '../server';

export const clientHandlers = [
    http.get('config.json', () => {
        return HttpResponse.json({ resourcesServerBaseUrl: RESOURCE_SERVER_BASE_URL });
    }),
];
