import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import {
  getLibraryDownloadUrl,
  LibraryDownloadError,
} from '@/features/content/services/libraryDownloadService';
import { getUserIdByClerkId } from '@/features/ai/services/accessService';
import { syncCurrentUserToDatabase } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ assetId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { userId: clerkUserId } = await auth();
  if (!clerkUserId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { assetId } = await context.params;
  await syncCurrentUserToDatabase();

  const userId = await getUserIdByClerkId(clerkUserId);
  if (!userId) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  try {
    const result = await getLibraryDownloadUrl({ assetId, userId });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof LibraryDownloadError) {
      const status =
        error.code === 'NOT_FOUND'
          ? 404
          : error.code === 'FORBIDDEN'
            ? 403
            : 503;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }

    console.error('[library/download]', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
