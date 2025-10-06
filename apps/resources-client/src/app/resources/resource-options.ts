import { SelectOption } from '@dnd-mapp/shared-ui';

export const ResourceTypes = {
    BACKGROUNDS: 'backgrounds',
    CLASSES: 'classes',
    ITEMS: 'items',
    RACES: 'races',
    SPELLS: 'spells',
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

const DEFAULT_RESOURCE_TYPE: ResourceType = ResourceTypes.SPELLS;

export function resourceTypeAttribute(value: unknown) {
    return Object.values(ResourceTypes).find((type) => type === value) ?? DEFAULT_RESOURCE_TYPE;
}

export const resourceOptions: SelectOption<ResourceType>[] = [
    { label: 'Background', value: ResourceTypes.BACKGROUNDS, selected: false },
    { label: 'Classes', value: ResourceTypes.CLASSES, selected: false },
    { label: 'Items', value: ResourceTypes.ITEMS, selected: false },
    { label: 'Races', value: ResourceTypes.RACES, selected: false },
    { label: 'Spells', value: ResourceTypes.SPELLS, selected: false },
];
