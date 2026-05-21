import { NextResponse } from 'next/server';
import { getPlanningLists } from '@/features/admin/services/planningService';

export async function GET() {
  return NextResponse.json(getPlanningLists());
}
