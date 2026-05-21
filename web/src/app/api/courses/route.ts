import { NextRequest, NextResponse } from 'next/server';
import { getCourses } from '@/features/catalog/services/catalogService';

export async function GET(request: NextRequest) {
  const trackId = request.nextUrl.searchParams.get('trackId') ?? undefined;
  const courses = await getCourses(trackId);
  return NextResponse.json(courses);
}
