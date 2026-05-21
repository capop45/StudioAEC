import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(__dirname, '../.env.local') });
config({ path: resolve(__dirname, '../.env') });

import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient, UserRole } from '../src/generated/prisma';
import { ingestCourseLessons } from '../src/features/ai/services/ingestionService';

const LIBRARY_ASSETS = [
  { id: 'lib-arq', slug: 'arquitetura', title: 'Biblioteca Arquitetura', category: 'Arquitetura', trackSlug: 'arquitetura', s3Key: 'arquitetura/catalog.zip' },
  { id: 'lib-hid', slug: 'hidraulica', title: 'Biblioteca Hidráulica', category: 'Hidráulica', trackSlug: 'hidraulica', s3Key: 'hidraulica/catalog.zip' },
  { id: 'lib-ele', slug: 'eletrica', title: 'Biblioteca Elétrica', category: 'Elétrica', trackSlug: 'eletrica', s3Key: 'eletrica/catalog.zip' },
  { id: 'lib-pci', slug: 'preventivo', title: 'Biblioteca Preventivo', category: 'Preventivo', trackSlug: 'preventivo', s3Key: 'preventivo/catalog.zip' },
  { id: 'lib-cli', slug: 'climatizacao', title: 'Biblioteca Climatização', category: 'Climatização', trackSlug: 'climatizacao', s3Key: 'climatizacao/catalog.zip' },
  { id: 'lib-est', slug: 'estruturas', title: 'Biblioteca Estrutural', category: 'Estruturas', trackSlug: 'estruturas', s3Key: 'estruturas/catalog.zip' },
  { id: 'lib-fam', slug: 'familias', title: 'Famílias paramétricas', category: 'Geral', trackSlug: null, s3Key: 'geral/familias.zip', requiresEnrollment: false },
  { id: 'lib-dyn', slug: 'dynamo', title: 'Scripts Dynamo', category: 'Automação', trackSlug: null, s3Key: 'geral/dynamo.zip', requiresEnrollment: false },
] as const;

const LESSON_TRANSCRIPTS = [
  'Visão geral do fluxo BIM no Revit: níveis, eixos, vínculos e convenções de nomenclatura para projetos AEC.',
  'Configuração de template executivo: folhas, escala, estilos de linha e parâmetros compartilhados.',
  'Documentação executiva: cortes, detalhes, tabelas e publicação de entregáveis para obra.',
];

const ADMIN_CLERK_ID = process.env.CLERK_ADMIN_USER_ID ?? 'user_3E2Hu1ehSTZmblJ6Z2wYN2QJTxa';
const ADMIN_EMAIL = process.env.CLERK_ADMIN_EMAIL ?? 'andre@estudioaec.local';
const ADMIN_NAME = process.env.CLERK_ADMIN_NAME ?? 'Andre';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TRACKS = [
  {
    slug: 'arquitetura',
    title: 'Arquitetura',
    description: 'Treinamentos e bibliotecas de Revit para projetos arquitetônicos BIM.',
    icon: 'buildings',
    color: '#6366f1',
    courseCount: 12,
    totalHours: 48,
    sortOrder: 0,
  },
  {
    slug: 'hidraulica',
    title: 'Hidráulica',
    description: 'Modelagem, dimensionamento e documentação hidráulica em Revit.',
    icon: 'drop',
    color: '#0ea5e9',
    courseCount: 8,
    totalHours: 32,
    sortOrder: 1,
  },
  {
    slug: 'eletrica',
    title: 'Elétrica',
    description: 'Projeto elétrico integrado com painéis, circuitos e memorial descritivo.',
    icon: 'lightning',
    color: '#f59e0b',
    courseCount: 10,
    totalHours: 40,
    sortOrder: 2,
  },
  {
    slug: 'preventivo',
    title: 'Preventivo',
    description: 'Sistemas de combate a incêndio e segurança conforme normas técnicas.',
    icon: 'shield',
    color: '#ef4444',
    courseCount: 6,
    totalHours: 24,
    sortOrder: 3,
  },
  {
    slug: 'climatizacao',
    title: 'Climatização',
    description: 'HVAC, dutos, cargas térmicas e compatibilização multidisciplinar.',
    icon: 'wind',
    color: '#14b8a6',
    courseCount: 7,
    totalHours: 28,
    sortOrder: 4,
  },
  {
    slug: 'estruturas',
    title: 'Estruturas',
    description: 'Estruturas de concreto e aço com detalhamento e quantitativos.',
    icon: 'columns',
    color: '#8b5cf6',
    courseCount: 9,
    totalHours: 36,
    sortOrder: 5,
  },
] as const;

async function main() {
  console.log('Seeding Estúdio AEC catalog…');

  const org = await prisma.organization.upsert({
    where: { slug: 'estudio-aec' },
    create: {
      name: 'Estúdio AEC',
      slug: 'estudio-aec',
    },
    update: {},
  });

  await prisma.user.upsert({
    where: { clerkUserId: ADMIN_CLERK_ID },
    create: {
      clerkUserId: ADMIN_CLERK_ID,
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: UserRole.ADMIN,
      organizationId: org.id,
    },
    update: {
      email: ADMIN_EMAIL,
      name: ADMIN_NAME,
      role: UserRole.ADMIN,
      organizationId: org.id,
    },
  });

  await prisma.aiPromptTemplate.upsert({
    where: { slug: 'tutor-default' },
    create: {
      slug: 'tutor-default',
      name: 'Tutor BIM — padrão',
      version: 1,
      systemPrompt:
        'Você é um tutor técnico do Estúdio AEC. Responda apenas com base no contexto fornecido. Se não souber, diga que não há material no curso sobre o assunto.',
      active: true,
    },
    update: { active: true },
  });

  const adminUser = await prisma.user.findUnique({
    where: { clerkUserId: ADMIN_CLERK_ID },
  });

  const levels = ['Iniciante', 'Intermediário', 'Avançado'];
  const demoCourseIds: string[] = [];

  for (const trackData of TRACKS) {
    const track = await prisma.track.upsert({
      where: {
        organizationId_slug: {
          organizationId: org.id,
          slug: trackData.slug,
        },
      },
      create: {
        organizationId: org.id,
        ...trackData,
        published: true,
      },
      update: {
        title: trackData.title,
        description: trackData.description,
        courseCount: trackData.courseCount,
        totalHours: trackData.totalHours,
      },
    });

    for (let i = 0; i < 4; i++) {
      const moduleNum = (i % 4) + 1;
      const slug = `modulo-${moduleNum}`;
      const course = await prisma.course.upsert({
        where: {
          trackId_slug: { trackId: track.id, slug },
        },
        create: {
          organizationId: org.id,
          trackId: track.id,
          slug,
          title: `Revit ${trackData.title} — Módulo ${moduleNum}`,
          summary:
            'Aprenda fluxos BIM com templates, famílias e documentação executiva alinhada ao mercado.',
          level: levels[i % 3],
          durationHours: 4 + (i % 6),
          rating: 4.2 + (i % 8) * 0.1,
          enrolledCount: 120 + i * 17,
          thumbnailUrl: `https://picsum.photos/seed/aec-${trackData.slug}-${i}/640/360`,
          published: true,
          purchasable: moduleNum === 1,
          priceCents: moduleNum === 1 ? 19900 : null,
          currency: 'brl',
        },
        update: {
          published: true,
          purchasable: moduleNum === 1,
          priceCents: moduleNum === 1 ? 19900 : null,
          currency: 'brl',
        },
      });

      if (moduleNum === 1 && demoCourseIds.length < 3) {
        demoCourseIds.push(course.id);
      }
    }
  }

  if (adminUser && demoCourseIds.length > 0) {
    const lessonTitles = ['Visão geral BIM', 'Template e configuração', 'Documentação executiva'];

    for (const courseId of demoCourseIds) {
      for (let li = 0; li < lessonTitles.length; li++) {
        const lessonSlug = `aula-${li + 1}`;
        const lesson = await prisma.lesson.upsert({
          where: { courseId_slug: { courseId, slug: lessonSlug } },
          create: {
            courseId,
            slug: lessonSlug,
            title: lessonTitles[li],
            sortOrder: li,
            durationMin: 25 + li * 10,
            transcript: LESSON_TRANSCRIPTS[li],
            published: true,
          },
          update: {
            title: lessonTitles[li],
            sortOrder: li,
            transcript: LESSON_TRANSCRIPTS[li],
          },
        });

        const progressPercent = li === 0 ? 100 : li === 1 ? 45 : 0;
        await prisma.lessonProgress.upsert({
          where: {
            userId_lessonId: { userId: adminUser.id, lessonId: lesson.id },
          },
          create: {
            userId: adminUser.id,
            lessonId: lesson.id,
            progressPercent,
            completedAt: progressPercent === 100 ? new Date() : null,
          },
          update: { progressPercent },
        });
      }

      await prisma.enrollment.upsert({
        where: {
          userId_courseId: { userId: adminUser.id, courseId },
        },
        create: {
          userId: adminUser.id,
          courseId,
          status: 'ACTIVE',
        },
        update: { status: 'ACTIVE' },
      });
    }

    console.log(`Demo enrollments: ${demoCourseIds.length} courses for admin user.`);

    let totalChunks = 0;
    for (const courseId of demoCourseIds) {
      totalChunks += await ingestCourseLessons(courseId);
    }
    console.log(`RAG ingestion: ${totalChunks} chunks indexed for demo courses.`);
  }

  for (const lib of LIBRARY_ASSETS) {
    await prisma.libraryAsset.upsert({
      where: { id: lib.id },
      create: {
        id: lib.id,
        slug: lib.slug,
        title: lib.title,
        category: lib.category,
        s3Key: lib.s3Key,
        trackSlug: lib.trackSlug,
        requiresEnrollment: 'requiresEnrollment' in lib ? lib.requiresEnrollment : true,
      },
      update: {
        title: lib.title,
        category: lib.category,
        s3Key: lib.s3Key,
        trackSlug: lib.trackSlug,
        requiresEnrollment: 'requiresEnrollment' in lib ? lib.requiresEnrollment : true,
      },
    });
  }
  console.log(`Library assets: ${LIBRARY_ASSETS.length} records.`);

  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
