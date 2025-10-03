import { SelectOption } from '@dnd-mapp/shared-ui';

export const ResourceTypes = {
    SPELLS: 'spells',
} as const;

export type ResourceType = (typeof ResourceTypes)[keyof typeof ResourceTypes];

export const resourceOptions: SelectOption<ResourceType>[] = [{ label: 'Spells', value: ResourceTypes.SPELLS }];
