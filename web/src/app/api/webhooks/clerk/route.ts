import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { deleteUserByClerkId, upsertUserFromClerk } from '@/features/auth/services/userSyncService';

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    email_addresses?: { email_address: string }[];
    first_name?: string | null;
    last_name?: string | null;
    public_metadata?: { role?: string };
  };
};

export async function POST(request: Request) {
  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'CLERK_WEBHOOK_SECRET not configured' }, { status: 503 });
  }

  const payload = await request.text();
  const headers = {
    'svix-id': request.headers.get('svix-id') ?? '',
    'svix-timestamp': request.headers.get('svix-timestamp') ?? '',
    'svix-signature': request.headers.get('svix-signature') ?? '',
  };

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, headers) as ClerkWebhookEvent;
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
  }

  const { type, data } = event;
  const email = data.email_addresses?.[0]?.email_address;

  if (type === 'user.created' || type === 'user.updated') {
    if (!email) {
      return NextResponse.json({ ok: true, skipped: 'no email' });
    }
    await upsertUserFromClerk({
      clerkUserId: data.id,
      email,
      name: [data.first_name, data.last_name].filter(Boolean).join(' ') || null,
      role: data.public_metadata?.role ?? null,
    });
  }

  if (type === 'user.deleted') {
    await deleteUserByClerkId(data.id);
  }

  return NextResponse.json({ ok: true });
}
