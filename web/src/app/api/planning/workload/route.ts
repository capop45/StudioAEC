import { NextResponse } from 'next/server';
import { getWorkload } from '@/features/admin/services/planningService';

export async function GET() {
  return NextResponse.json(getWorkload());
}
