import { NextResponse } from 'next/server';
import { getTracks } from '@/features/catalog/services/catalogService';

export async function GET() {
  const tracks = await getTracks();
  return NextResponse.json(tracks);
}
