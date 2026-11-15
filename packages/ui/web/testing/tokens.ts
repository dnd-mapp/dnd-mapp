/**
 * Reads the color that `token` resolves to in the theme the test runs in, such as `'--color-accent-default'`, in the
 * format that `getComputedStyle` and the harnesses return, such as `'rgb(200, 30, 40)'`. Throws when `tokens.css`
 * doesn't define the token, rather than return a color the probe inherits.
 */
export function readColorToken(token: `--color-${string}`): string {
    if (!getComputedStyle(document.documentElement).getPropertyValue(token)) {
        throw new Error(`tokens.css defines no ${token}.`);
    }
    const probe = document.createElement('div');

    probe.style.color = `var(${token})`;
    document.body.append(probe);

    try {
        return getComputedStyle(probe).color;
    } finally {
        probe.remove();
    }
}
