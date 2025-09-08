export function getRootFontSize() {
    return Number(getComputedStyle(document.documentElement).fontSize.replace('px', ''));
}
