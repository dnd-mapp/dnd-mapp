import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RequestService {
    private readonly httpClient = inject(HttpClient);

    public get<Response>(url: string) {
        return this.httpClient.get<Response>(url, { observe: 'response' });
    }

    public post<Response, RequestBody>(url: string, body: RequestBody) {
        return this.httpClient.post<Response>(url, body, { observe: 'response' });
    }

    public put<Response, RequestBody = Response>(url: string, body: RequestBody) {
        return this.httpClient.put<Response>(url, body, { observe: 'response' });
    }

    public delete(url: string) {
        return this.httpClient.delete<void>(url, { observe: 'response' });
    }
}
