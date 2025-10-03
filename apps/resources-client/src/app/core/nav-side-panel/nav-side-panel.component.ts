import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { User } from '@dnd-mapp/shared';
import {
    ArrowRightFromBracketSoIconComponent,
    ArrowRightToBracketSoIconComponent,
    ButtonComponent,
    CircleUserSoIconComponent,
    GearSoIconComponent,
    HouseSoIconComponent,
    NavLinkComponent,
    SideSheetService,
    UserPlusSoIconComponent,
    WrenchSoIconComponent,
} from '@dnd-mapp/shared-ui';
import { filter } from 'rxjs';

@Component({
    selector: 'dma-nav-side-panel',
    templateUrl: './nav-side-panel.component.html',
    styleUrl: './nav-side-panel.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [
        NavLinkComponent,
        HouseSoIconComponent,
        ButtonComponent,
        UserPlusSoIconComponent,
        ArrowRightToBracketSoIconComponent,
        CircleUserSoIconComponent,
        ArrowRightFromBracketSoIconComponent,
        GearSoIconComponent,
        WrenchSoIconComponent,
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
