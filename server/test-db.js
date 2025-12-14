const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
    const email = `testuser${Date.now()}@test.com`;
    console.log(`Attempting to create user: ${email}`);

    try {
        await prisma.$connect();

        const user = await prisma.user.create({
            data: {
                email: email,
                password: 'hashedpassword123' // skipping bcrypt for raw DB test
            }
        });

        console.log('✅ User created successfully:', user.id);
    } catch (e) {
        console.error('❌ Failed to create user:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
