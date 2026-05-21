import { UserRole } from '@/generated/prisma';
import { getPrisma, isDatabaseConfigured } from '@/lib/db';

export interface ClerkUserPayload {
  clerkUserId: string;
  email: string;
  name?: string | null;
  role?: string | null;
}

function resolveRole(role?: string | null): UserRole {
  if (role === 'admin') return UserRole.ADMIN;
  if (role === 'instructor') return UserRole.INSTRUCTOR;
  return UserRole.STUDENT;
}

export async function upsertUserFromClerk(payload: ClerkUserPayload) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  const prisma = getPrisma();

  const org = await prisma.organization.upsert({
    where: { slug: 'estudio-aec' },
    create: { name: 'Estúdio AEC', slug: 'estudio-aec' },
    update: {},
  });

  return prisma.user.upsert({
    where: { clerkUserId: payload.clerkUserId },
    create: {
      clerkUserId: payload.clerkUserId,
      email: payload.email,
      name: payload.name ?? undefined,
      role: resolveRole(payload.role),
      organizationId: org.id,
    },
    update: {
      email: payload.email,
      name: payload.name ?? undefined,
      role: resolveRole(payload.role),
    },
  });
}

export async function deleteUserByClerkId(clerkUserId: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  try {
    return await getPrisma().user.delete({
      where: { clerkUserId },
    });
  } catch {
    return null;
  }
}
