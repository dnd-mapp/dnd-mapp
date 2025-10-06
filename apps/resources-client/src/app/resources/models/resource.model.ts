import { ResourceEntity } from '@dnd-mapp/shared';

export class Resource implements ResourceEntity {
    public id: string;

    public _label = 'New Resource';

    public get label() {
        return this._label;
    }
}
