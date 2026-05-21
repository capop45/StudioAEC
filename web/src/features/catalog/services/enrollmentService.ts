import { EnrollmentStatus } from '@/generated/prisma';
import { getPrisma, isDatabaseConfigured } from '@/lib/db';
import type { EnrollmentSummaryDto } from '@/features/catalog/types';

export async function hasActiveEnrollment(userId: string, courseId: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    return false;
  }

  const enrollment = await getPrisma().enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { status: true },
  });

  return enrollment?.status === EnrollmentStatus.ACTIVE;
}

export async function enrollUserInCourse(userId: string, courseId: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return getPrisma().enrollment.upsert({
    where: { userId_courseId: { userId, courseId } },
    create: {
      userId,
      courseId,
      status: EnrollmentStatus.ACTIVE,
    },
    update: {
      status: EnrollmentStatus.ACTIVE,
    },
  });
}

export async function getEnrollmentsForClerkUser(
  clerkUserId: string,
): Promise<EnrollmentSummaryDto[]> {
  if (!isDatabaseConfigured()) {
    return [];
  }

  try {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
      select: { id: true },
    });

    if (!user) {
      return [];
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id, status: { not: 'CANCELLED' } },
      include: {
        course: {
          include: {
            track: true,
            lessons: { select: { id: true } },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    if (enrollments.length === 0) {
      return [];
    }

    const lessonIds = enrollments.flatMap((e) => e.course.lessons.map((l) => l.id));
    const progressRows =
      lessonIds.length > 0
        ? await prisma.lessonProgress.findMany({
            where: { userId: user.id, lessonId: { in: lessonIds } },
            select: { lessonId: true, progressPercent: true },
          })
        : [];

    const progressByLesson = new Map(progressRows.map((p) => [p.lessonId, p.progressPercent]));

    return enrollments.map((enrollment) => {
      const lessonCount = enrollment.course.lessons.length;
      let progressPercent = 0;

      if (lessonCount > 0) {
        const sum = enrollment.course.lessons.reduce(
          (acc, lesson) => acc + (progressByLesson.get(lesson.id) ?? 0),
          0,
        );
        progressPercent = Math.round(sum / lessonCount);
      }

      return {
        id: enrollment.id,
        courseId: enrollment.courseId,
        courseTitle: enrollment.course.title,
        trackSlug: enrollment.course.track.slug,
        trackTitle: enrollment.course.track.title,
        level: enrollment.course.level,
        durationHours: enrollment.course.durationHours,
        status: enrollment.status,
        progressPercent,
        lessonCount,
      };
    });
  } catch {
    return [];
  }
}
