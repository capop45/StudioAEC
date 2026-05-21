import { EnrollmentStatus } from '@/generated/prisma';
import { getPrisma, isDatabaseConfigured } from '@/lib/db';

export async function getUserIdByClerkId(clerkUserId: string): Promise<string | null> {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const user = await getPrisma().user.findUnique({
    where: { clerkUserId },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function isEnrolledInCourse(userId: string, courseId: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    return false;
  }

  const enrollment = await getPrisma().enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    select: { status: true },
  });

  return enrollment?.status === EnrollmentStatus.ACTIVE;
}

export async function isEnrolledInTrack(userId: string, trackSlug: string): Promise<boolean> {
  if (!isDatabaseConfigured()) {
    return false;
  }

  const count = await getPrisma().enrollment.count({
    where: {
      userId,
      status: EnrollmentStatus.ACTIVE,
      course: {
        track: { slug: trackSlug },
      },
    },
  });

  return count > 0;
}

export async function assertCourseAccess(userId: string, courseId: string): Promise<void> {
  const allowed = await isEnrolledInCourse(userId, courseId);
  if (!allowed) {
    throw new AccessDeniedError('Enrollment required for this course');
  }
}

export class AccessDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AccessDeniedError';
  }
}
