import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
    CompassReIcon,
    CompassSoIcon,
    HouseReIcon,
    HouseSoIcon,
    MusicSoIcon,
    NavigationBarComponent,
    NavigationItemComponent,
    RadioSoIcon,
    ThemeDirective,
} from '@dnd-mapp/shared-ui';

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
export class NavigationBarStoryComponent {}
