import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { http, HttpResponse } from 'msw';
import { lastValueFrom, map } from 'rxjs';
import { getMockServiceWorker } from '../../../../test/mocks';
import { RequestService } from './request.service';

describe('RequestService', () => {
    function setupTest() {
        TestBed.configureTestingModule({
            providers: [provideHttpClient()],
        });

        return {
            service: TestBed.inject(RequestService),
        };
    }

    it('should send a request', async () => {
        const url = 'https://localhost:8080/test';

        getMockServiceWorker().use(http.get(url, () => HttpResponse.json({ hello: 'world' })));

        const { service } = setupTest();

        const result = await lastValueFrom(service.get(url).pipe(map((response) => response.body)));

        expect(result).toEqual({ hello: 'world' });
    });
});
