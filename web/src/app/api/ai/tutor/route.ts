import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { answerCourseQuestion, TutorError } from '@/features/ai/services/tutorService';
import { syncCurrentUserToDatabase } from '@/lib/auth';

const tutorBodySchema = z.object({
  courseId: z.string().min(1),
  message: z.string().min(1).max(4000),
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

  const parsed = tutorBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 });
  }

  await syncCurrentUserToDatabase();

  try {
    const result = await answerCourseQuestion({
      clerkUserId: userId,
      courseId: parsed.data.courseId,
      message: parsed.data.message,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof TutorError) {
      const status =
        error.code === 'ACCESS_DENIED'
          ? 403
          : error.code === 'USER_NOT_FOUND'
            ? 404
            : error.code === 'NOT_CONFIGURED'
              ? 503
              : 400;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }

    console.error('[ai/tutor]', error);
    return NextResponse.json({ error: 'Tutor request failed' }, { status: 500 });
  }
}
