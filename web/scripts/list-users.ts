import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, name: true, role: true, clerkUserId: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  console.log(`Users in database: ${users.length}`);
  console.log(JSON.stringify(users, null, 2));
}

main()
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
