import { embedText, embeddingToPgVectorLiteral } from '@/lib/embeddings';
import { getPrisma, isDatabaseConfigured } from '@/lib/db';
import { chunkText } from '@/features/ai/services/chunkingService';

export async function ingestLessonContent(lessonId: string): Promise<number> {
  if (!isDatabaseConfigured()) {
    return 0;
  }

  const prisma = getPrisma();
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: {
      course: { select: { id: true, organizationId: true, title: true } },
    },
  });

  if (!lesson) {
    return 0;
  }

  const sourceText =
    lesson.transcript?.trim() ||
    `${lesson.title}. Conteúdo do módulo ${lesson.course.title} do Estúdio AEC. Fluxos BIM, templates Revit e documentação executiva.`;

  const chunks = chunkText(sourceText);
  if (chunks.length === 0) {
    return 0;
  }

  const knowledgeBase = await prisma.aiKnowledgeBase.upsert({
    where: {
      id: `kb-lesson-${lesson.id}`,
    },
    create: {
      id: `kb-lesson-${lesson.id}`,
      courseId: lesson.courseId,
      organizationId: lesson.course.organizationId,
      title: `Lesson: ${lesson.title}`,
      sourceType: 'lesson_transcript',
      rawContent: sourceText,
    },
    update: {
      rawContent: sourceText,
      title: `Lesson: ${lesson.title}`,
    },
  });

  await prisma.aiDocumentChunk.deleteMany({
    where: { knowledgeBaseId: knowledgeBase.id },
  });

  let created = 0;

  for (let i = 0; i < chunks.length; i++) {
    const content = chunks[i];
    const embedding = await embedText(content);
    const vectorLiteral = embeddingToPgVectorLiteral(embedding);

    const chunk = await prisma.aiDocumentChunk.create({
      data: {
        knowledgeBaseId: knowledgeBase.id,
        lessonId: lesson.id,
        courseId: lesson.courseId,
        organizationId: lesson.course.organizationId,
        content,
        chunkIndex: i,
        tokenCount: Math.ceil(content.length / 4),
        embeddingJson: JSON.stringify(embedding),
      },
    });

    await prisma.$executeRawUnsafe(
      `UPDATE ai_document_chunks SET embedding = $1::vector WHERE id = $2`,
      vectorLiteral,
      chunk.id,
    );

    created += 1;
  }

  return created;
}

export async function ingestCourseLessons(courseId: string): Promise<number> {
  if (!isDatabaseConfigured()) {
    return 0;
  }

  const lessons = await getPrisma().lesson.findMany({
    where: { courseId, published: true },
    select: { id: true },
  });

  let total = 0;
  for (const lesson of lessons) {
    total += await ingestLessonContent(lesson.id);
  }

  return total;
}
