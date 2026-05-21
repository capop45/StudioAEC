import { NextResponse } from 'next/server';
import { getPlanningTasks } from '@/features/admin/services/planningService';

export async function GET() {
  return NextResponse.json(getPlanningTasks());
}
