import { ResourceBuilder } from './resource.builder';

export class Resource {
    public id: string;
}

export const DEFAULT_RESOURCE = new ResourceBuilder().build();
