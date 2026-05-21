import type Stripe from 'stripe';
import { getPrisma } from '@/lib/db';
import { getAppBaseUrl, getStripe, isStripeConfigured } from '@/lib/stripe';
import type { CheckoutSessionResult } from '@/features/commerce/types';
import { createPendingOrder } from '@/features/commerce/services/orderService';
import { ensureStripeCustomerForUser } from '@/features/commerce/services/stripeCustomerService';
import { hasActiveEnrollment } from '@/features/catalog/services/enrollmentService';

export class CheckoutError extends Error {
  constructor(
    message: string,
    readonly code: 'NOT_CONFIGURED' | 'NOT_FOUND' | 'NOT_PURCHASABLE' | 'ALREADY_ENROLLED',
  ) {
    super(message);
    this.name = 'CheckoutError';
  }
}

function buildLineItem(course: {
  id: string;
  title: string;
  summary: string;
  priceCents: number;
  currency: string;
  stripePriceId: string | null;
}): Stripe.Checkout.SessionCreateParams.LineItem {
  if (course.stripePriceId) {
    return {
      quantity: 1,
      price: course.stripePriceId,
    };
  }

  return {
    quantity: 1,
    price_data: {
      currency: course.currency,
      unit_amount: course.priceCents,
      product_data: {
        name: course.title,
        description: course.summary.slice(0, 250),
        metadata: { courseId: course.id },
      },
    },
  };
}

export async function createCourseCheckoutSession(input: {
  clerkUserId: string;
  courseId: string;
}): Promise<CheckoutSessionResult> {
  if (!isStripeConfigured()) {
    throw new CheckoutError('Stripe is not configured', 'NOT_CONFIGURED');
  }

  const prisma = getPrisma();
  const user = await prisma.user.findUnique({
    where: { clerkUserId: input.clerkUserId },
    select: { id: true },
  });

  if (!user) {
    throw new CheckoutError('User not found in database', 'NOT_FOUND');
  }

  const course = await prisma.course.findUnique({
    where: { id: input.courseId },
    include: { track: { select: { slug: true } } },
  });

  if (!course || !course.published) {
    throw new CheckoutError('Course not found', 'NOT_FOUND');
  }

  if (!course.purchasable || course.priceCents == null || course.priceCents <= 0) {
    throw new CheckoutError('Course is not available for purchase', 'NOT_PURCHASABLE');
  }

  const alreadyEnrolled = await hasActiveEnrollment(user.id, course.id);
  if (alreadyEnrolled) {
    throw new CheckoutError('You are already enrolled in this course', 'ALREADY_ENROLLED');
  }

  const stripeCustomerId = await ensureStripeCustomerForUser(user.id);
  const baseUrl = getAppBaseUrl();
  const stripe = getStripe();
  const priceCents = course.priceCents;

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: stripeCustomerId ?? undefined,
    client_reference_id: user.id,
    line_items: [
      buildLineItem({
        id: course.id,
        title: course.title,
        summary: course.summary,
        priceCents,
        currency: course.currency,
        stripePriceId: course.stripePriceId,
      }),
    ],
    metadata: {
      courseId: course.id,
      userId: user.id,
      clerkUserId: input.clerkUserId,
    },
    success_url: `${baseUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/treinamentos/${course.track.slug}?checkout=cancelled`,
  });

  if (!session.url) {
    throw new Error('Stripe Checkout session URL missing');
  }

  const order = await createPendingOrder({
    userId: user.id,
    courseId: course.id,
    amountCents: priceCents,
    currency: course.currency,
    stripeCheckoutSessionId: session.id,
  });

  return { url: session.url, orderId: order.id };
}
