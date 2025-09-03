import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CheckboxComponent } from '@dnd-mapp/shared-ui';

@Component({
    selector: 'dma-story',
    templateUrl: './checkbox-story.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CheckboxComponent],
})
export class CheckboxStoryComponent {}
