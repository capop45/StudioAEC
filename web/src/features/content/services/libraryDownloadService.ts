import { getPrisma, isDatabaseConfigured } from '@/lib/db';
import { createPresignedDownloadUrl, isS3Configured } from '@/lib/storage';
import { isEnrolledInTrack } from '@/features/ai/services/accessService';

export class LibraryDownloadError extends Error {
  constructor(
    message: string,
    readonly code: 'NOT_CONFIGURED' | 'NOT_FOUND' | 'FORBIDDEN' | 'S3_NOT_CONFIGURED',
  ) {
    super(message);
    this.name = 'LibraryDownloadError';
  }
}

export async function getLibraryDownloadUrl(input: {
  assetId: string;
  userId: string;
}): Promise<{ url: string; expiresInSeconds: number }> {
  if (!isDatabaseConfigured()) {
    throw new LibraryDownloadError('Database not configured', 'NOT_CONFIGURED');
  }

  if (!isS3Configured()) {
    throw new LibraryDownloadError('S3 is not configured', 'S3_NOT_CONFIGURED');
  }

  const asset = await getPrisma().libraryAsset.findUnique({
    where: { id: input.assetId },
  });

  if (!asset) {
    throw new LibraryDownloadError('Library asset not found', 'NOT_FOUND');
  }

  if (asset.requiresEnrollment) {
    if (!asset.trackSlug) {
      throw new LibraryDownloadError('Enrollment required', 'FORBIDDEN');
    }

    const enrolled = await isEnrolledInTrack(input.userId, asset.trackSlug);
    if (!enrolled) {
      throw new LibraryDownloadError('Active enrollment in track required', 'FORBIDDEN');
    }
  }

  const url = await createPresignedDownloadUrl(asset.s3Key);
  const expiresInSeconds = Number(process.env.S3_PRESIGN_EXPIRES_SECONDS ?? 300);

  return { url, expiresInSeconds };
}
