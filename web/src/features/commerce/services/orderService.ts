import { CommerceOrderStatus } from '@/generated/prisma';
import { getPrisma } from '@/lib/db';

export async function createPendingOrder(input: {
  userId: string;
  courseId: string;
  amountCents: number;
  currency: string;
  stripeCheckoutSessionId: string;
}) {
  return getPrisma().commerceOrder.create({
    data: {
      userId: input.userId,
      courseId: input.courseId,
      amountCents: input.amountCents,
      currency: input.currency,
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      status: CommerceOrderStatus.PENDING,
    },
  });
}

export async function findOrderByCheckoutSessionId(stripeCheckoutSessionId: string) {
  return getPrisma().commerceOrder.findUnique({
    where: { stripeCheckoutSessionId },
    include: {
      user: { select: { id: true, clerkUserId: true } },
      course: { select: { id: true, title: true, trackId: true, track: { select: { slug: true } } } },
    },
  });
}

export async function completeOrder(input: {
  orderId: string;
  stripePaymentIntentId?: string | null;
}) {
  return getPrisma().commerceOrder.update({
    where: { id: input.orderId },
    data: {
      status: CommerceOrderStatus.COMPLETED,
      stripePaymentIntentId: input.stripePaymentIntentId ?? undefined,
    },
  });
}

export async function expireOrderByCheckoutSessionId(stripeCheckoutSessionId: string) {
  const order = await getPrisma().commerceOrder.findUnique({
    where: { stripeCheckoutSessionId },
    select: { id: true, status: true },
  });

  if (!order || order.status !== CommerceOrderStatus.PENDING) {
    return null;
  }

  return getPrisma().commerceOrder.update({
    where: { id: order.id },
    data: { status: CommerceOrderStatus.EXPIRED },
  });
}
