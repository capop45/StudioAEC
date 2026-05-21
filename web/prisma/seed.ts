import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient, UserRole } from '../src/generated/prisma';

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

  const levels = ['Iniciante', 'Intermediário', 'Avançado'];

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
      await prisma.course.upsert({
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
        },
        update: { published: true },
      });
    }
  }

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
