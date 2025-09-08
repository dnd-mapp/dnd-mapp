import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { applicationConfig, Preview } from '@storybook/angular';

const preview: Preview = {
    decorators: [
        applicationConfig({
            providers: [provideAnimationsAsync()],
        }),
    ],
};

export default preview;
