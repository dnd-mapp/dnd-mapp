import { InjectionToken } from '@angular/core';
import { DMA_DESKTOP_APP_API_NAMESPACE, DmaDesktopAppApi } from '@dnd-mapp/desktop-shared';

export const DESKTOP_APP_API = new InjectionToken<DmaDesktopAppApi>('DESKTOP_APP_API', {
    providedIn: 'root',
    factory: () => window[DMA_DESKTOP_APP_API_NAMESPACE],
});
