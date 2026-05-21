import { auth, currentUser } from '@clerk/nextjs/server';
import { UserRole } from '@/generated/prisma';
import { upsertUserFromClerk } from '@/features/auth/services/userSyncService';
import { resolveIsAdmin } from '@/lib/roles';

export async function getSessionUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

export async function isAdminUser(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;

  return resolveIsAdmin({
    clerkUserId: user.id,
    username: user.username,
    publicRole: user.publicMetadata?.role as string | undefined,
    email: user.primaryEmailAddress?.emailAddress,
  });
}

export async function syncCurrentUserToDatabase() {
  const user = await currentUser();
  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress;
  if (!email) return null;

  const isAdmin = resolveIsAdmin({
    clerkUserId: user.id,
    username: user.username,
    publicRole: user.publicMetadata?.role as string | undefined,
    email,
  });

  return upsertUserFromClerk({
    clerkUserId: user.id,
    email,
    name: [user.firstName, user.lastName].filter(Boolean).join(' ') || null,
    role: isAdmin ? 'admin' : ((user.publicMetadata?.role as string | undefined) ?? null),
  });
}

export function mapClerkRoleToEnum(role?: string | null): UserRole {
  if (role === 'admin') return UserRole.ADMIN;
  if (role === 'instructor') return UserRole.INSTRUCTOR;
  return UserRole.STUDENT;
}
