import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const DEFAULT_EXPIRES_SECONDS = 300;

export function isS3Configured(): boolean {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID?.trim() &&
      process.env.AWS_SECRET_ACCESS_KEY?.trim() &&
      process.env.S3_BUCKET?.trim(),
  );
}

function getS3Client(): S3Client {
  if (!isS3Configured()) {
    throw new Error('S3 is not configured');
  }

  return new S3Client({
    region: process.env.AWS_REGION?.trim() || 'us-east-1',
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export async function createPresignedDownloadUrl(s3Key: string): Promise<string> {
  const bucket = process.env.S3_BUCKET!.trim();
  const prefix = process.env.S3_LIBRARY_PREFIX?.trim().replace(/\/$/, '') ?? 'library';
  const key = s3Key.startsWith(prefix) ? s3Key : `${prefix}/${s3Key}`;

  const client = getS3Client();
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const expiresIn = Number(process.env.S3_PRESIGN_EXPIRES_SECONDS ?? DEFAULT_EXPIRES_SECONDS);

  return getSignedUrl(client, command, { expiresIn });
}
