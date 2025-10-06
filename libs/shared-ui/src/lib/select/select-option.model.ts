export interface SelectOption<T = unknown> {
    value: T;
    label: string;
    selected?: boolean;
}
