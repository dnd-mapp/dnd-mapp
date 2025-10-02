import { inject, Injectable } from '@angular/core';
import { ConfigService } from '../config';
import { RequestService } from './request.service';

@Injectable({ providedIn: 'root' })
export class ResourcesServerService {
    private readonly requestService = inject(RequestService);
    private readonly configService = inject(ConfigService);

    private readonly baseUrl = this.configService.config().resourcesServerBaseUrl;

    public get<T>(path: string) {
        return this.requestService.get<T>(`${this.baseUrl}${path}`);
    }
}
