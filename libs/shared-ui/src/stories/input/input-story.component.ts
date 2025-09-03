import { ChangeDetectionStrategy, Component } from '@angular/core';
import { InputComponent } from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-story',
    templateUrl: './input-story.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [InputComponent],
})
export class InputStoryComponent {}
