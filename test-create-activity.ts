import { PrismaClient } from '@prisma/client';
import { sign } from 'jsonwebtoken';

const prisma = new PrismaClient();

async function run() {
    // ensure an admin exists or just mock the token
    let admin = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (!admin) {
        admin = await prisma.user.create({
            data: {
                name: 'Test Admin',
                email: 'admin2@test.com',
                password: 'hash',
                role: 'admin'
            }
        });
    }

    const token = sign(
        { id: admin.id, email: admin.email, role: admin.role },
        process.env.JWT_SECRET || 'fallback_secret',
        { expiresIn: '1d' }
    );

    const res = await fetch('http://localhost:3000/api/activities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            title: 'Majestic Mountain Climbing',
            description: 'A beautiful climb in the Alps',
            date: new Date(Date.now() + 86400000).toISOString(),
            capacity: 10
        })
    });

    const data = await res.json();
    console.log('Response:', data);
}

run().catch(console.error).finally(() => prisma.$disconnect());
