import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RequestService {
    private readonly httpClient = inject(HttpClient);

    public get<ResponseData>(url: string) {
        return this.httpClient.get<ResponseData>(url);
    }

    public post<ResponseData, RequestData = ResponseData>(url: string, data: RequestData) {
        return this.httpClient.post<ResponseData>(url, data);
    }

    public put<ResponseData, RequestData = ResponseData>(url: string, data: RequestData) {
        return this.httpClient.put<ResponseData>(url, data);
    }

    public delete(url: string) {
        return this.httpClient.delete<void>(url);
    }
}
