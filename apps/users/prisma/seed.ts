import { AccountStatuses } from '@dnd-mapp/api-shared';
import { PrismaClient } from './client';

let prismaClient: PrismaClient;

async function initializePrismaClient() {
    console.log('- Initializing Prisma Client');
    prismaClient = new PrismaClient();

    await prismaClient.$connect();
}

async function cleanUpPrismaClient() {
    console.log('- Cleaning up Prisma Client');
    await prismaClient.$disconnect();

    prismaClient = null;
}

async function generateDefaultUsers() {
    console.log('Generating default Users...');

    await prismaClient.user.create({
        data: {
            username: 'Admin',
            password: 'changemenow',
            passwordExpiry: new Date(),
            email: null,
            emailVerified: false,
            status: AccountStatuses.ACTIVE,
        },
    });
}

async function seed() {
    await initializePrismaClient();

    await generateDefaultUsers();

    await cleanUpPrismaClient();
}

(async () => {
    try {
        await seed();
    } catch (error) {
        console.error(error);
    }
})();
