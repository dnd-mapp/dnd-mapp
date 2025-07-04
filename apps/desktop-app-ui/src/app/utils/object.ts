export function isEmptyObject(value: unknown) {
    return typeof value === 'object' && JSON.stringify(value) === '{}';
}
