import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
    CompassReIcon,
    CompassSoIcon,
    fabColorAttribute,
    FabComponent,
    fabSizeAttribute,
    HouseReIcon,
    HouseSoIcon,
    MusicSoIcon,
    NavigationBarComponent,
    NavigationItemComponent,
    PenToSquareSoIcon,
    RadioSoIcon,
    ThemeDirective,
} from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-story',
    templateUrl: './fab-story.component.html',
    styleUrl: './fab-story.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    hostDirectives: [ThemeDirective],
    host: {
        '[class.floating]': 'floating()',
    },
    imports: [
        PenToSquareSoIcon,
        FabComponent,
        CompassReIcon,
        CompassSoIcon,
        HouseReIcon,
        HouseSoIcon,
        MusicSoIcon,
        NavigationBarComponent,
        NavigationItemComponent,
        RadioSoIcon,
    ],
})
export class FabStoryComponent {
    public readonly color = input.required({ transform: fabColorAttribute });

    public readonly size = input.required({ transform: fabSizeAttribute });

    public readonly floating = input(false, { transform: booleanAttribute });

    public readonly navigationBarShown = input(false, { transform: booleanAttribute });
}
