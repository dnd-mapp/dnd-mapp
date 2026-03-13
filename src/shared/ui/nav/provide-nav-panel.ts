import { InjectionToken, Type, ValueProvider } from '@angular/core';

export const NAV_PANEL = new InjectionToken('Navigation panel');

export function provideNavPanel<T>(navPanel: Type<T>): ValueProvider {
    return {
        provide: NAV_PANEL,
        useValue: navPanel,
    };
}
