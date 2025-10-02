import { inject, Injectable } from '@angular/core';
import { ConfigService } from '../config';
import { RequestService } from './request.service';

@Injectable({ providedIn: 'root' })
export class ResourcesServerService {
    private readonly requestService = inject(RequestService);
    private readonly configService = inject(ConfigService);

    private readonly baseUrl = this.configService.config().resourcesServerBaseUrl;

    public get<Response>(path: string) {
        return this.requestService.get<Response>(`${this.baseUrl}${path}`);
    }

    public post<Response, RequestBody>(path: string, data: RequestBody) {
        return this.requestService.post<Response, RequestBody>(`${this.baseUrl}${path}`, data);
    }

    public put<Response, RequestBody = Response>(path: string, data: RequestBody) {
        return this.requestService.put<Response, RequestBody>(`${this.baseUrl}${path}`, data);
    }

    public delete(path: string) {
        return this.requestService.delete(`${this.baseUrl}${path}`);
    }
}
