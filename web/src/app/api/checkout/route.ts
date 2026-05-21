import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import {
  CheckoutError,
  createCourseCheckoutSession,
} from '@/features/commerce/services/checkoutService';
import { syncCurrentUserToDatabase } from '@/lib/auth';

const checkoutBodySchema = z.object({
  courseId: z.string().min(1),
});

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = checkoutBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  await syncCurrentUserToDatabase();

  try {
    const result = await createCourseCheckoutSession({
      clerkUserId: userId,
      courseId: parsed.data.courseId,
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof CheckoutError) {
      const status =
        error.code === 'NOT_FOUND'
          ? 404
          : error.code === 'ALREADY_ENROLLED'
            ? 409
            : error.code === 'NOT_PURCHASABLE'
              ? 422
              : 503;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }

    console.error('[checkout]', error);
    return NextResponse.json({ error: 'Checkout failed' }, { status: 500 });
  }
}
