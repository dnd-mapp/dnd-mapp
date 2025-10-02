export interface MockDB<T> {
    [resourceId: string]: T;
}
