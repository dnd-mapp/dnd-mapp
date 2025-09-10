import { Injectable, signal } from '@angular/core';
import { NavigationItemComponent } from './navigation-item';

@Injectable({ providedIn: 'root' })
export class NavigationBarService {
    private readonly items = signal<NavigationItemComponent[]>([]);

    public updateItems(items: NavigationItemComponent[]) {
        this.items.set(items);
    }

    public showBadgeForItemWithRoute(route: string, badgeLabel?: number) {
        const item = this.items().find((item) => item.route() === route);
        item.showBadge(badgeLabel);
    }

    public updateBadgeForItemWithRoute(route: string, badgeLabel: number) {
        const item = this.items().find((item) => item.route() === route);
        item.updateBadge(badgeLabel);
    }
}
