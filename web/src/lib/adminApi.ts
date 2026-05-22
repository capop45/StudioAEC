import { NextResponse } from 'next/server';
import { isAdminUser } from '@/lib/auth';

export async function requireAdminApi(): Promise<NextResponse | null> {
  const admin = await isAdminUser();
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}
