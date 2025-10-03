import { SelectOption } from '@dnd-mapp/shared-ui';

export const ResourceTypes = {
    BACKGROUNDS: 'backgrounds',
    CLASSES: 'classes',
    ITEMS: 'items',
    RACES: 'races',
    SPELLS: 'spells',
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

export const resourceOptions: SelectOption<ResourceType>[] = [
    { label: 'Background', value: ResourceTypes.BACKGROUNDS },
    { label: 'Classes', value: ResourceTypes.CLASSES },
    { label: 'Items', value: ResourceTypes.ITEMS },
    { label: 'Races', value: ResourceTypes.RACES },
    { label: 'Spells', value: ResourceTypes.SPELLS },
];
