import { Preview } from '@storybook/angular';
import { useArgs } from 'storybook/preview-api';

const preview: Preview = {
    decorators: [
        (story, context) => {
            const [, updateArgs] = useArgs();
            return story({ ...context, updateArgs });
        },
    ],
};

export default preview;
