import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RequestService {
    private readonly httpClient = inject(HttpClient);

    public get<Response>(url: string) {
        return this.httpClient.get<Response>(url, { observe: 'response' });
    }
}
