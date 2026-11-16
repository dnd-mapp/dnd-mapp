import { InjectionToken } from '@angular/core';
import type { TabComponent } from './tab.component';

/**
 * Each tab provides itself under this token, so the tab list queries its tabs without importing the Tab component,
 * which imports the tab list. The import cycle would otherwise leave one of the two classes undefined when the other
 * starts.
 */
export const TAB = new InjectionToken<TabComponent>('TAB');
