import { Spell } from '@dnd-mapp/shared';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SpellsRepository {
    public async findAll() {
        return Promise.resolve<Spell[]>([]);
    }
}
