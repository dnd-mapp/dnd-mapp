import { componentWrapperDecorator, Preview } from '@storybook/angular';

function wrapStory(story: string) {
    return `<main><section>${story}</section></main>`;
}

const preview: Preview = {
    decorators: [componentWrapperDecorator((story) => wrapStory(story))],
};

export default preview;
