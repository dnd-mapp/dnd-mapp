import type { ArgTypes } from '@storybook/angular-vite';

/** What `radioArgType` needs to describe an input that takes one value of a constant object, such as `LogoKind`. */
export interface RadioArgTypeOptions<Value extends string> {
    /** The constant object that holds the values. */
    values: Record<string, Value>;
    /** The name of the type of the input, which the table shows. */
    typeName: string;
    /** The value the input takes when it is not set. */
    defaultValue: Value;
    /** What the input does, which the table shows. */
    description: string;
}

/**
 * Describes an input that takes one value of a constant object: a radio control with each value, and a table row
 * with the description, the type with its values, and the default. Storybook reads no descriptions from a component
 * without Compodoc, so the stories give them here.
 */
export function radioArgType<Value extends string>({
    values,
    typeName,
    defaultValue,
    description,
}: RadioArgTypeOptions<Value>): ArgTypes[string] {
    const options = Object.values(values);

    return {
        description,
        control: 'inline-radio',
        options,
        table: {
            type: { summary: typeName, detail: options.map((value) => `'${value}'`).join(' | ') },
            defaultValue: { summary: `'${defaultValue}'` },
        },
    };
}
