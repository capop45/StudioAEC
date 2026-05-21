import { getPrisma, isDatabaseConfigured } from '@/lib/db';
import type { CourseDto, CourseTrackDto } from '@/features/catalog/types';

const SEED_TRACKS: CourseTrackDto[] = [
  {
    id: 'arquitetura',
    title: 'Arquitetura',
    slug: 'arquitetura',
    description: 'Treinamentos e bibliotecas de Revit para projetos arquitetônicos BIM.',
    icon: 'buildings',
    color: '#6366f1',
    courseCount: 12,
    totalHours: 48,
  },
  {
    id: 'hidraulica',
    title: 'Hidráulica',
    slug: 'hidraulica',
    description: 'Modelagem, dimensionamento e documentação hidráulica em Revit.',
    icon: 'drop',
    color: '#0ea5e9',
    courseCount: 8,
    totalHours: 32,
  },
  {
    id: 'eletrica',
    title: 'Elétrica',
    slug: 'eletrica',
    description: 'Projeto elétrico integrado com painéis, circuitos e memorial descritivo.',
    icon: 'lightning',
    color: '#f59e0b',
    courseCount: 10,
    totalHours: 40,
  },
  {
    id: 'preventivo',
    title: 'Preventivo',
    slug: 'preventivo',
    description: 'Sistemas de combate a incêndio e segurança conforme normas técnicas.',
    icon: 'shield',
    color: '#ef4444',
    courseCount: 6,
    totalHours: 24,
  },
  {
    id: 'climatizacao',
    title: 'Climatização',
    slug: 'climatizacao',
    description: 'HVAC, dutos, cargas térmicas e compatibilização multidisciplinar.',
    icon: 'wind',
    color: '#14b8a6',
    courseCount: 7,
    totalHours: 28,
  },
  {
    id: 'estruturas',
    title: 'Estruturas',
    slug: 'estruturas',
    description: 'Estruturas de concreto e aço com detalhamento e quantitativos.',
    icon: 'columns',
    color: '#8b5cf6',
    courseCount: 9,
    totalHours: 36,
  },
];

function buildSeedCourses(): CourseDto[] {
  const levels = ['Iniciante', 'Intermediário', 'Avançado'];
  const trackIds = SEED_TRACKS.map((t) => t.id);
  const courses: CourseDto[] = [];

  for (let i = 0; i < 24; i++) {
    const track = trackIds[i % trackIds.length];
    const trackLabel = track.charAt(0).toUpperCase() + track.slice(1);
    const moduleNum = (i % 4) + 1;
    courses.push({
      id: `course-${i + 1}`,
      trackId: track,
      slug: `modulo-${moduleNum}`,
      title: `Revit ${trackLabel} — Módulo ${moduleNum}`,
      summary:
        'Aprenda fluxos BIM com templates, famílias e documentação executiva alinhada ao mercado.',
      level: levels[i % 3],
      durationHours: 4 + (i % 6),
      rating: 4.2 + (i % 8) * 0.1,
      enrolledCount: 120 + i * 17,
      thumbnail: `https://picsum.photos/seed/aec${i}/640/360`,
      purchasable: moduleNum === 1,
      priceCents: moduleNum === 1 ? 19900 : null,
      currency: 'brl',
    });
  }

  return courses;
}

const SEED_COURSES = buildSeedCourses();

export async function getTracks(): Promise<CourseTrackDto[]> {
  if (!isDatabaseConfigured()) {
    return SEED_TRACKS;
  }

  try {
    const rows = await getPrisma().track.findMany({
      where: { published: true },
      orderBy: { sortOrder: 'asc' },
    });
    if (rows.length === 0) {
      return SEED_TRACKS;
    }
    return rows.map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      description: t.description,
      icon: t.icon,
      color: t.color,
      courseCount: t.courseCount,
      totalHours: t.totalHours,
    }));
  } catch {
    return SEED_TRACKS;
  }
}

export async function getTrackBySlug(slug: string): Promise<CourseTrackDto | null> {
  const tracks = await getTracks();
  return tracks.find((t) => t.slug.toLowerCase() === slug.toLowerCase()) ?? null;
}

export async function getCourses(trackId?: string): Promise<CourseDto[]> {
  if (!isDatabaseConfigured()) {
    return trackId
      ? SEED_COURSES.filter((c) => c.trackId === trackId)
      : SEED_COURSES;
  }

  try {
    const rows = await getPrisma().course.findMany({
      where: {
        published: true,
        ...(trackId ? { trackId } : {}),
      },
      orderBy: { slug: 'asc' },
    });
    if (rows.length === 0) {
      return trackId
        ? SEED_COURSES.filter((c) => c.trackId === trackId)
        : SEED_COURSES;
    }
    return rows.map((c) => ({
      id: c.id,
      trackId: c.trackId,
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      level: c.level,
      durationHours: c.durationHours,
      rating: c.rating,
      enrolledCount: c.enrolledCount,
      thumbnail: c.thumbnailUrl ?? '',
      purchasable: c.purchasable,
      priceCents: c.priceCents,
      currency: c.currency,
    }));
  } catch {
    return trackId
      ? SEED_COURSES.filter((c) => c.trackId === trackId)
      : SEED_COURSES;
  }
}
