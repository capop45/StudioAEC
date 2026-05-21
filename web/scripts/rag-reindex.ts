/**
 * Re-indexes lesson content with OpenAI embeddings (requires OPENAI_API_KEY + DATABASE_URL).
 * Usage: npm run rag:reindex
 */
import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../src/generated/prisma';
import { ingestCourseLessons } from '../src/features/ai/services/ingestionService';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    throw new Error('DATABASE_URL is required');
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    throw new Error('OPENAI_API_KEY is required for reindex with OpenAI embeddings');
  }

  const courses = await prisma.course.findMany({
    where: { published: true },
    select: { id: true, title: true },
  });

  console.log(`Reindexing ${courses.length} courses…`);

  let totalChunks = 0;
  for (const course of courses) {
    const count = await ingestCourseLessons(course.id);
    totalChunks += count;
    console.log(`  ${course.title}: ${count} chunks`);
  }

  console.log(`Done. ${totalChunks} chunks indexed.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
