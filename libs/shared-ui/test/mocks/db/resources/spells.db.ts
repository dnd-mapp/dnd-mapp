import { MockDB } from '../models';

class MockSpellDB {
    private spells: MockDB<unknown> = {};

    public getAll() {
        return Object.values(this.spells);
    }

    public reset() {
        this.spells = {};
    }
}

export const mockSpellDB = new MockSpellDB();
