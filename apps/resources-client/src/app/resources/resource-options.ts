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
    { label: 'Background', value: ResourceTypes.BACKGROUNDS, selected: false },
    { label: 'Classes', value: ResourceTypes.CLASSES, selected: false },
    { label: 'Items', value: ResourceTypes.ITEMS, selected: false },
    { label: 'Races', value: ResourceTypes.RACES, selected: false },
    { label: 'Spells', value: ResourceTypes.SPELLS, selected: true },
];
