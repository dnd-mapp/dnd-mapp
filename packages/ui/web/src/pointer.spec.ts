import { userEvent } from 'vitest/browser';

/**
 * Renders a box over the center of the viewport, away from the corner where the setup file `testing/pointer.ts`
 * moves the pointer.
 */
function renderBox() {
    const box = document.createElement('div');

    box.style.cssText = 'position: fixed; inset: 25%;';
    document.body.append(box);
    onTestFinished(() => {
        box.remove();
    });

    return box;
}

/** Waits until Chrome has updated the hover state after a layout change, which takes it a frame. */
async function nextFrames() {
    await new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(resolve);
        });
    });
}

// The second test checks what the first leaves behind, so the tests keep their order.
describe('the pointer before each test', { shuffle: false }, () => {
    it('should rest on the box that a test hovers', async () => {
        const box = renderBox();

        await userEvent.hover(box);

        expect(box.matches(':hover')).toBe(true);
    });

    it('should not hover a box that renders where the previous test left it', async () => {
        const box = renderBox();

        await nextFrames();

        expect(box.matches(':hover')).toBe(false);
    });
});
