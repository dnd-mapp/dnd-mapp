import { Resource } from './resource.model';

export class ResourceBuilder {
    private readonly resource = new Resource();

    constructor() {
        this.resource.id = null;
    }

    public build() {
        return this.resource;
    }

    public withId(id: string) {
        this.resource.id = id;
    }
}

export const DEFAULT_RESOURCE = new ResourceBuilder().build();
