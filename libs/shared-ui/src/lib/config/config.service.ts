import { inject, Injectable, signal } from '@angular/core';
import { transform } from '@dnd-mapp/shared';
import { map, tap } from 'rxjs';
import { RequestService } from '../http';
import { ClientConfig } from './config.model';

@Injectable({ providedIn: 'root' })
export class ConfigService {
    private readonly requestService = inject(RequestService);

    public readonly config = signal<ClientConfig>(null);

    public initialize() {
        return this.requestService.get('config.json').pipe(
            map((response) => transform(response.body, ClientConfig)),
            tap((config) => this.config.set(config)),
        );
    }
}
