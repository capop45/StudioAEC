import { NextResponse } from 'next/server';
import { getGantt } from '@/features/admin/services/planningService';

export async function GET() {
  return NextResponse.json(getGantt());
}
