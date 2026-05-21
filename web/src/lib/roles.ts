/** Admin resolution: Clerk public metadata, env allowlist, optional username. */

export const DEFAULT_ADMIN_CLERK_ID = 'user_3E2Hu1ehSTZmblJ6Z2wYN2QJTxa';
export const DEFAULT_ADMIN_USERNAME = 'andre';

export type AdminCheckInput = {
  clerkUserId?: string | null;
  username?: string | null;
  publicRole?: string | null;
  email?: string | null;
};

function parseCsvEnv(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

const BUILTIN_ADMIN_IDS = [DEFAULT_ADMIN_CLERK_ID];
const BUILTIN_ADMIN_USERNAMES = [DEFAULT_ADMIN_USERNAME];

export function getAdminClerkUserIds(): string[] {
  const fromEnv =
    typeof window === 'undefined' ? parseCsvEnv(process.env.CLERK_ADMIN_USER_IDS) : [];
  return [...new Set([...BUILTIN_ADMIN_IDS, ...fromEnv])];
}

export function getAdminUsernames(): string[] {
  const fromEnv =
    typeof window === 'undefined' ? parseCsvEnv(process.env.CLERK_ADMIN_USERNAMES) : [];
  return [...new Set([...BUILTIN_ADMIN_USERNAMES, ...fromEnv])].map((n) => n.toLowerCase());
}

export function resolveIsAdmin(input: AdminCheckInput): boolean {
  if (input.publicRole === 'admin') return true;

  const email = input.email?.toLowerCase() ?? '';
  if (email.includes('admin')) return true;

  const clerkId = input.clerkUserId?.trim();
  if (clerkId && getAdminClerkUserIds().includes(clerkId)) return true;

  const username = input.username?.toLowerCase().trim();
  if (username && getAdminUsernames().includes(username)) return true;

  return false;
}
