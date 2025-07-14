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

async function seed() {
    await initializePrismaClient();

    await cleanUpPrismaClient();
}

(async () => {
    try {
        await seed();
    } catch (error) {
        console.error(error);
    }
})();
