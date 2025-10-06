import { ResourceEntity } from '@dnd-mapp/shared';
import { ResourceBuilder } from './resource.builder';

export class Resource implements ResourceEntity {
    public id: string;

    public _label = 'New Resource';

    public get label() {
        return this._label;
    }
}

export const DEFAULT_RESOURCE = new ResourceBuilder().build();
