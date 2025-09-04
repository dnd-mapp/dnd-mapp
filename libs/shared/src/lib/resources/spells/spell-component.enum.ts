export const CastingComponents = {
    MATERIAL: {
        short: 'M',
        long: 'Material',
    },
    VOCAL: {
        short: 'V',
        long: 'Vocal',
    },
    SOMATIC: {
        short: 'S',
        long: 'Somatic',
    },
} as const;

export type CastingComponent = (typeof CastingComponents)[keyof typeof CastingComponents];
