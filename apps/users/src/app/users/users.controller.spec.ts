import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { UsersController } from './users.controller';

describe('UsersController', () => {
    async function setupTest() {
        const app = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        return {
            controller: app.get(UsersController),
        };
    }

    it('should be defined', async () => {
        const { controller } = await setupTest();
        expect(controller).toBeDefined();
    });
});
