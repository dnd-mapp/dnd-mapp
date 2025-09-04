export const MagicSchools = {
    ABJURATION: 'Abjuration',
    CONJURATION: 'Conjuration',
    DIVINATION: 'Divination',
    ENCHANTMENT: 'Enchantment',
    EVOCATION: 'Evocation',
    ILLUSION: 'Illusion',
    NECROMANCY: 'Necromancy',
    TRANSMUTATION: 'Transmutation',
} as const;

export type MagicSchool = (typeof MagicSchools)[keyof typeof MagicSchools];
