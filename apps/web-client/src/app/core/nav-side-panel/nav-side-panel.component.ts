import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@dnd-mapp/shared';
import { filter } from 'rxjs';
import {
    ArrowRightFromBracketSoIconComponent,
    ArrowRightToBracketSoIconComponent,
    BookSoIconComponent,
    ButtonComponent,
    CircleUserSoIconComponent,
    CompassSoIconComponent,
    HouseSoIconComponent,
    NavLinkComponent,
    NavMenuContainerComponent,
    NavMenuTriggerComponent,
    SideSheetService,
    UserPlusSoIconComponent,
    UsersSoIconComponent,
} from '../../shared';

@Component({
    selector: 'dma-nav-side-panel',
    templateUrl: './nav-side-panel.component.html',
    styleUrl: './nav-side-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NavLinkComponent,
        HouseSoIconComponent,
        UsersSoIconComponent,
        CompassSoIconComponent,
        BookSoIconComponent,
        NavMenuTriggerComponent,
        NavMenuContainerComponent,
        ButtonComponent,
        UserPlusSoIconComponent,
        ArrowRightToBracketSoIconComponent,
        CircleUserSoIconComponent,
        ArrowRightFromBracketSoIconComponent,
    ],
})
export class NavSidePanelComponent implements OnInit {
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly sideSheetService = inject(SideSheetService);

    protected readonly authenticatedUser = signal<User>(null);

    protected readonly isAuthenticated = computed(() => this.authenticatedUser() !== null);

    public ngOnInit() {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe({
                next: () => this.sideSheetService.toggle(),
            });
    }

    protected onMyProfile() {
        console.warn('NAVIGATING TO MY PROFILE PAGE');
    }

    protected onLogOut() {
        console.warn('NAVIGATING TO MY LOG OUT PAGE');
    }

    protected onSignUp() {
        console.warn('NAVIGATING TO SIGN UP PAGE');
    }

    protected onLogIn() {
        console.warn('NAVIGATING TO LOG IN PAGE');
    }
}
