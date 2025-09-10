import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
    CompassReIcon,
    CompassSoIcon,
    HouseReIcon,
    HouseSoIcon,
    MusicSoIcon,
    NavigationBarComponent,
    NavigationBarService,
    NavigationItemComponent,
    RadioSoIcon,
    ThemeDirective,
} from '@dnd-mapp/shared-ui';
import { interval } from 'rxjs';

@Component({
    selector: 'dma-story',
    templateUrl: './navigation-bar-story.component.html',
    styleUrl: './navigation-bar-story.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    imports: [
        NavigationBarComponent,
        NavigationItemComponent,
        HouseSoIcon,
        HouseReIcon,
        CompassSoIcon,
        CompassReIcon,
        MusicSoIcon,
        RadioSoIcon,
    ],
})
export class NavigationBarStoryComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly navigationBarService = inject(NavigationBarService, {});

    public ngOnInit() {
        interval(3_000)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (time) => {
                    this.navigationBarService.showBadgeForItemWithRoute('/browse');

                    if (time > 0 && time % 2 === 0) {
                        const randomLabel = Math.round(Math.random() * 2000);

                        this.navigationBarService.showBadgeForItemWithRoute('/library', randomLabel);
                        this.navigationBarService.updateBadgeForItemWithRoute('/library', randomLabel);
                    }
                },
            });
    }
}
