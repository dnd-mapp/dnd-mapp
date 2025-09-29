import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
    async function setupTest() {
        const app = await Test.createTestingModule({
            controllers: [AppController],
        }).compile();

        return {
            controller: app.get(AppController),
        };
    }

    it('should return "Hello API"', async () => {
        const { controller } = await setupTest();
        expect(controller.getData()).toEqual({ message: 'Hello from Resources server' });
    });
});
