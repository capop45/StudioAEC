import { embedText, embeddingToPgVectorLiteral } from '@/lib/embeddings';
import { getPrisma, isDatabaseConfigured } from '@/lib/db';
import type { RetrievedChunk } from '@/features/ai/types';
import { assertCourseAccess } from '@/features/ai/services/accessService';

interface RetrieveOptions {
  userId: string;
  courseId: string;
  query: string;
  limit?: number;
}

export async function retrieveChunksForCourse(
  options: RetrieveOptions,
): Promise<RetrievedChunk[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  const limit = options.limit ?? 5;
  await assertCourseAccess(options.userId, options.courseId);

  const prisma = getPrisma();
  const course = await prisma.course.findUnique({
    where: { id: options.courseId },
    select: { organizationId: true },
  });

  if (!course) {
    return [];
  }

  const queryEmbedding = await embedText(options.query);
  const vectorLiteral = embeddingToPgVectorLiteral(queryEmbedding);

  // Pre-filter by course (and org when present) BEFORE vector similarity — padrão ouro
  const rows = await prisma.$queryRawUnsafe<
    { id: string; content: string; course_id: string; lesson_id: string | null; score: number }[]
  >(
    `
    SELECT
      c.id,
      c.content,
      c.course_id,
      c.lesson_id,
      1 - (c.embedding <=> $1::vector) AS score
    FROM ai_document_chunks c
    WHERE c.course_id = $2
      AND ($3::text IS NULL OR c.organization_id = $3 OR c.organization_id IS NULL)
      AND c.embedding IS NOT NULL
    ORDER BY c.embedding <=> $1::vector
    LIMIT $4
    `,
    vectorLiteral,
    options.courseId,
    course.organizationId,
    limit,
  );

  return rows.map((row) => ({
    id: row.id,
    content: row.content,
    courseId: row.course_id,
    lessonId: row.lesson_id,
    score: Number(row.score),
  }));
}
