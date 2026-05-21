import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

async function main() {
  const result = await prisma.course.updateMany({
    where: { slug: 'modulo-1', published: true },
    data: {
      purchasable: true,
      priceCents: 19900,
      currency: 'brl',
    },
  });

  console.log(`Updated ${result.count} courses (modulo-1) as purchasable.`);

  const track = await prisma.track.findFirst({
    where: { slug: 'arquitetura' },
    include: {
      courses: {
        where: { published: true },
        orderBy: { slug: 'asc' },
        select: { slug: true, purchasable: true, priceCents: true, title: true },
      },
    },
  });

  console.log('Arquitetura courses:', track?.courses);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
