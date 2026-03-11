import { InjectionToken } from '@angular/core';

export const STORAGE = new InjectionToken<Storage>('Browser Storage', {
    providedIn: 'root',
    factory: () => sessionStorage,
});
