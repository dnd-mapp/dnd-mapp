export const titleCasePart = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export function titleCase(value: string) {
    const parts = value.split(' ');
    return parts.map((part) => titleCasePart(part)).join(' ');
}
