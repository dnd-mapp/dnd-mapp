import type { Type } from '@angular/core';
import { IconArrowDownComponent } from './icon-arrow-down.component';
import { IconArrowRightComponent } from './icon-arrow-right.component';
import { IconCheckComponent } from './icon-check.component';
import { IconCloseComponent } from './icon-close.component';
import { IconExternalComponent } from './icon-external.component';
import { IconGithubComponent } from './icon-github.component';
import { IconMenuComponent } from './icon-menu.component';
import { IconMinusComponent } from './icon-minus.component';
import { IconMonitorComponent } from './icon-monitor.component';
import { IconMoonComponent } from './icon-moon.component';
import { IconPlusComponent } from './icon-plus.component';
import { IconSunComponent } from './icon-sun.component';

/**
 * The component of each glyph, in the order of the variants of the Icon component in Penpot, for the spec and the
 * stories. Apps import the component of the glyph they need instead, so `index.ts` leaves this out.
 */
export const ICONS: Record<string, Type<unknown>> = {
    'menu': IconMenuComponent,
    'close': IconCloseComponent,
    'arrow-right': IconArrowRightComponent,
    'arrow-down': IconArrowDownComponent,
    'plus': IconPlusComponent,
    'minus': IconMinusComponent,
    'external': IconExternalComponent,
    'sun': IconSunComponent,
    'moon': IconMoonComponent,
    'monitor': IconMonitorComponent,
    'check': IconCheckComponent,
    'github': IconGithubComponent,
};
