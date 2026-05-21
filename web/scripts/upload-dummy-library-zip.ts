import { config } from 'dotenv';
import { resolve } from 'path';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

config({ path: resolve(process.cwd(), '.env.local') });
config({ path: resolve(process.cwd(), '.env') });

function buildDemoZipFile(tmpDir: string, zipPath: string): void {
  const readmePath = resolve(tmpDir, 'readme.txt');
  writeFileSync(
    readmePath,
    'Estudio AEC — biblioteca demo (arquitetura)\nConteudo de teste para download via S3.\n',
    'utf8',
  );

  if (process.platform === 'win32') {
    const { execSync } = require('child_process') as typeof import('child_process');
    execSync(
      `powershell -NoProfile -Command "Compress-Archive -Path '${readmePath}' -DestinationPath '${zipPath}' -Force"`,
      { stdio: 'inherit' },
    );
  } else {
    const { execSync } = require('child_process') as typeof import('child_process');
    execSync(`zip -j "${zipPath}" "${readmePath}"`, { stdio: 'inherit' });
  }
}

async function main() {
  const bucket = process.env.S3_BUCKET?.trim();
  const region = process.env.AWS_REGION?.trim() || 'sa-east-1';
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY?.trim();
  const prefix = process.env.S3_LIBRARY_PREFIX?.trim().replace(/\/$/, '') ?? 'library';
  const key = `${prefix}/arquitetura/catalog.zip`;

  if (!bucket || !accessKeyId || !secretAccessKey) {
    throw new Error('S3_BUCKET, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are required');
  }

  const tmpDir = resolve(process.cwd(), '.tmp', 'arquitetura-demo');
  const zipPath = resolve(process.cwd(), '.tmp', 'catalog.zip');
  mkdirSync(tmpDir, { recursive: true });
  buildDemoZipFile(tmpDir, zipPath);
  const zip = readFileSync(zipPath);

  const client = new S3Client({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: zip,
      ContentType: 'application/zip',
    }),
  );

  console.log(`Uploaded s3://${bucket}/${key} (${zip.length} bytes)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
