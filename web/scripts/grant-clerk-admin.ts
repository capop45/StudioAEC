/**
 * Grants admin role in Clerk public_metadata for a user.
 * Run: npx tsx scripts/grant-clerk-admin.ts
 * Requires CLERK_SECRET_KEY in .env.local (loaded via dotenv if present).
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_USER_ID = 'user_3E2Hu1ehSTZmblJ6Z2wYN2QJTxa';

function loadEnvLocal() {
  const path = resolve(process.cwd(), '.env.local');
  if (!existsSync(path)) return;
  const text = readFileSync(path, 'utf8');
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) {
    console.error('CLERK_SECRET_KEY is missing. Add it to web/.env.local');
    process.exit(1);
  }

  const userId = process.env.CLERK_ADMIN_USER_ID ?? DEFAULT_USER_ID;

  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${secret}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      public_metadata: { role: 'admin' },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`Clerk API error (${res.status}):`, body);
    process.exit(1);
  }

  const user = (await res.json()) as { id: string; username: string | null };
  console.log(`Admin granted for ${user.id} (username: ${user.username ?? 'n/a'})`);
  console.log('public_metadata.role = "admin"');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
