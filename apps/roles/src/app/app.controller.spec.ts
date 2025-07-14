import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppModule } from './app.module';

describe('AppController', () => {
    async function testSetup() {
        const app = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        return {
            controller: app.get(AppController),
        };
    }

    it('should access the root', async () => {
        const { controller } = await testSetup();
        expect(controller.root()).toEqual({});
    });
});
