import { expectRequest, provideHttpTesting, setupTestEnvironment } from '@/test';
import { HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { lastValueFrom } from 'rxjs';
import { RequestService } from './request.service';

describe('RequestService', () => {
    async function setupTest() {
        await setupTestEnvironment({
            providers: [provideHttpTesting()],
        });

        return {
            service: TestBed.inject(RequestService),
        };
    }

    afterEach(() => {
        TestBed.inject(HttpTestingController).verify();
    });

    it('should make a GET request', async () => {
        const { service } = await setupTest();

        const data = lastValueFrom(service.get<{ message: string }>('http://localhost:8080/greet'));

        expectRequest({
            url: 'http://localhost:8080/greet',
            body: { message: 'Hello world' },
        });
        expect(await data).toEqual({ message: 'Hello world' });
    });

    it('should make a POST request', async () => {
        const { service } = await setupTest();

        const request = lastValueFrom(
            service.post<{ id: string; username: string }, { username: string }>('http://localhost:8080/user', {
                username: 'TheLegend27',
            })
        );

        expectRequest({
            url: 'http://localhost:8080/user',
            body: {
                id: '1234',
                username: 'TheLegend27',
            },
            status: 201,
            statusText: 'Created',
        });

        expect(await request).toEqual({ id: '1234', username: 'TheLegend27' });
    });

    it('should make a PUT request', async () => {
        const { service } = await setupTest();

        const request = lastValueFrom(
            service.put<{ id: string; username: string }, { username: string }>('http://localhost:8080/user/1234', {
                username: 'TheLegend28',
            })
        );

        expectRequest({
            url: 'http://localhost:8080/user/1234',
            body: {
                id: '1234',
                username: 'TheLegend28',
            },
            status: 200,
            statusText: 'OK',
        });

        expect(await request).toEqual({ id: '1234', username: 'TheLegend28' });
    });

    it('should make a DELETE request', async () => {
        const { service } = await setupTest();

        const request = lastValueFrom(service.delete('http://localhost:8080/user/1234'));

        expectRequest({
            url: 'http://localhost:8080/user/1234',
            body: null,
            status: 204,
            statusText: 'No Content',
        });

        await expect(request).resolves.not.toThrowError();
    });
});
