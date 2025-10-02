import { http, HttpResponse } from 'msw';
import { mockSpellDB } from '../../../db';
import { RESOURCE_SERVER_BASE_URL } from '../constants';

export const spellsHandlers = [
    http.get(`${RESOURCE_SERVER_BASE_URL}/spells`, () => {
        return HttpResponse.json(mockSpellDB.getAll());
    }),
];
