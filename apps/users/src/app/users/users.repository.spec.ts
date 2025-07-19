import { Test } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { UsersRepository } from './users.repository';

describe('UsersRepository', () => {
    async function setupTest() {
        const module = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        return {
            repository: module.get(UsersRepository),
        };
    }

    it('should be defined', async () => {
        const { repository } = await setupTest();
        expect(repository).toBeDefined();
    });
});
