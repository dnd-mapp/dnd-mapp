import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ButtonHarness, DialogHarness, DialogHeaderHarness, createTestEnvironment } from '@dnd-mapp/shared-ui/test';
import { ButtonComponent } from '../button';
import { DialogContentComponent } from './content/dialog-content.component';
import { DialogService } from './dialog.service';
import { DialogHeaderComponent } from './header/dialog-header.component';

describe('Dialog', () => {
    @Component({
        template: `
            <section>
                <dma-dialog-header><h1 class="dma-dialog-title">My dialog</h1></dma-dialog-header>
                <dma-dialog-content><p>This is a custom dialog</p></dma-dialog-content>
            </section>
        `,
        host: {
            class: 'dma-dialog-container',
        },
        imports: [DialogContentComponent, DialogHeaderComponent],
    })
    class CustomDialogComponent {}

    @Component({
        template: `<button type="button" dma-button (click)="onOpenDialog()">Open Dialog</button>`,
        imports: [ButtonComponent],
    })
    class TestComponent {
        private readonly destroyRef = inject(DestroyRef);
        private readonly dialogService = inject(DialogService);

        public result: unknown;

        protected onOpenDialog() {
            const dialogRef = this.dialogService.open(CustomDialogComponent, {
                width: '500px',
                height: '500px',
            });

            dialogRef
                .afterClose()
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (result) => (this.result = result),
                });
        }
    }

    async function setupTest() {
        const {
            harness: buttonHarness,
            harnessLoader: harnessLoader,
            component: component,
            fixture: fixture,
        } = await createTestEnvironment({
            testComponent: TestComponent,
            harness: ButtonHarness,
        });

        return {
            buttonHarness: buttonHarness,
            harnessLoader: harnessLoader,
            component: component,
            fixture: fixture,
        };
    }

    it('should dismiss a dialog with no result', async () => {
        const { buttonHarness, harnessLoader, component } = await setupTest();

        expect(await harnessLoader.getHarnessOrNull(DialogHeaderHarness)).toBeNull();

        await buttonHarness.click();
        const dialogHarness = await harnessLoader.getHarnessOrNull(DialogHarness);

        expect(dialogHarness).not.toBeNull();
        expect(component.result).toBeUndefined();

        expect(await dialogHarness.getDialogTitle()).toEqual('My dialog');
        expect(await dialogHarness.getDialogContent()).toEqual('This is a custom dialog');

        await dialogHarness.dismissDialog();

        expect(await harnessLoader.getHarnessOrNull(DialogHarness)).toBeNull();
        expect(component.result).toBeUndefined();
    });
});
