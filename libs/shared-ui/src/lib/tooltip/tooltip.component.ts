import {
    ChangeDetectionStrategy,
    Component,
    DestroyRef,
    EventEmitter,
    HostListener,
    inject,
    OnInit,
    Output,
    signal,
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { TOOLTIP_DELAYS } from '@dnd-mapp/shared-ui/utils';
import { debounce, timer } from 'rxjs';
import { showHideAnimation, ShowHideAnimationState, ShowHideAnimationStates } from './animations';

@Component({
    selector: 'dma-tooltip',
    templateUrl: './tooltip.component.html',
    styleUrl: './tooltip.component.scss',
    animations: [showHideAnimation],
    host: {
        '[@showHide]': 'this.currentState()',
    },
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TooltipComponent implements OnInit {
    private readonly destroyRef = inject(DestroyRef);
    private readonly tooltipDelays = inject(TOOLTIP_DELAYS, { optional: true });

    public label: string;

    public readonly currentState = signal<ShowHideAnimationState>('hidden');

    private readonly nextState = signal<ShowHideAnimationState>('hidden');

    private readonly nextState$ = toObservable(this.nextState).pipe(
        debounce((state) => this.getAnimationDelay(state)),
        takeUntilDestroyed(this.destroyRef)
    );

    @Output() public animationDone = new EventEmitter<void>();

    private readonly showDelay = this.tooltipDelays?.show ?? 500;
    private readonly hideDelay = this.tooltipDelays?.hide ?? 200;

    constructor() {
        this.nextState$.subscribe({
            next: (state) => {
                this.currentState.set(state);

                if (
                    this.currentState() === ShowHideAnimationStates.HIDDEN &&
                    state === ShowHideAnimationStates.HIDDEN
                ) {
                    this.notifyTooltipCleanUp();
                }
            },
        });
    }

    public ngOnInit() {
        this.nextState.set(ShowHideAnimationStates.SHOWN);
    }

    public updateAnimationState(animationState: ShowHideAnimationState) {
        this.nextState.set(animationState);
    }

    @HostListener('mouseover')
    protected onMouseover() {
        this.updateAnimationState(ShowHideAnimationStates.SHOWN);
    }

    @HostListener('mouseout')
    protected onMouseout() {
        this.updateAnimationState(ShowHideAnimationStates.HIDDEN);
    }

    private getAnimationDelay(state: ShowHideAnimationState) {
        if (state === this.currentState()) return timer(0);
        return state === ShowHideAnimationStates.HIDDEN ? timer(this.hideDelay) : timer(this.showDelay);
    }

    private notifyTooltipCleanUp() {
        this.animationDone.next();
        this.animationDone.complete();
    }
}
