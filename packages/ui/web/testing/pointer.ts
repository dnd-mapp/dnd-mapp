import { beforeEach } from 'vitest';
import { userEvent } from 'vitest/browser';

/**
 * Moves the pointer to the bottom-right corner of the viewport before each test, so a component that the test renders
 * where the previous test left the pointer does not turn hovered a frame later. `userEvent.unhover` would hover the
 * center of `<body>` instead, where a component that fills the viewport renders.
 */
beforeEach(async () => {
    const corner = document.createElement('div');

    corner.style.cssText = 'position: fixed; right: 0; bottom: 0; width: 8px; height: 8px;';
    document.body.append(corner);

    try {
        await userEvent.hover(corner);
    } finally {
        corner.remove();
    }
});
