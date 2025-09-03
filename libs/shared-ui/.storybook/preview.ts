import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { applicationConfig, componentWrapperDecorator, Preview } from '@storybook/angular';

function wrapStory(story: string) {
    return `<main><section>${story}</section></main>`;
}

const preview: Preview = {
    decorators: [
        componentWrapperDecorator((story) => wrapStory(story)),
        applicationConfig({
            providers: [provideAnimationsAsync()],
        }),
    ],
};

export default preview;
