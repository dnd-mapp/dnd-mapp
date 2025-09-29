import { Test } from '@nestjs/testing';
import { SpellsController } from './spells.controller';
import { SpellsModule } from './spells.module';

describe('SpellsController', () => {
    async function setupTest() {
        const app = await Test.createTestingModule({
            imports: [SpellsModule],
        }).compile();

        return {
            controller: app.get(SpellsController),
        };
    }

    it('should create', async () => {
        const { controller } = await setupTest();
        expect(controller).toBeDefined();
    });
});
