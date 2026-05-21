import { NextResponse } from 'next/server';
import { isDatabaseConfigured } from '@/lib/db';

export async function GET() {
  let database: 'configured' | 'unconfigured' | 'connected' | 'error' = 'unconfigured';

  if (isDatabaseConfigured()) {
    database = 'configured';
    try {
      const { getPrisma } = await import('@/lib/db');
      await getPrisma().$queryRaw`SELECT 1`;
      database = 'connected';
    } catch {
      database = 'error';
    }
  }

  return NextResponse.json({
    status: 'healthy',
    service: 'StudioAEC.Web',
    database,
    clerk: Boolean(process.env.CLERK_SECRET_KEY),
    stripe: Boolean(
      process.env.STRIPE_RESTRICTED_KEY || process.env.STRIPE_SECRET_KEY,
    ),
    stripeWebhook: Boolean(process.env.STRIPE_WEBHOOK_SECRET),
    s3: Boolean(
      process.env.AWS_ACCESS_KEY_ID &&
        process.env.AWS_SECRET_ACCESS_KEY &&
        process.env.S3_BUCKET,
    ),
    openai: Boolean(process.env.OPENAI_API_KEY),
  });
}
