import type Stripe from 'stripe';
import { CommerceOrderStatus } from '@/generated/prisma';
import { enrollUserInCourse } from '@/features/catalog/services/enrollmentService';
import {
  completeOrder,
  expireOrderByCheckoutSessionId,
  findOrderByCheckoutSessionId,
} from '@/features/commerce/services/orderService';
import { getPrisma } from '@/lib/db';

export async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const order = await findOrderByCheckoutSessionId(session.id);
  if (!order) {
    return { handled: false, reason: 'order_not_found' as const };
  }

  if (order.status === CommerceOrderStatus.COMPLETED) {
    return { handled: true, reason: 'already_completed' as const };
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null;

  await completeOrder({
    orderId: order.id,
    stripePaymentIntentId: paymentIntentId,
  });

  await enrollUserInCourse(order.userId, order.courseId);

  await getPrisma().course.update({
    where: { id: order.courseId },
    data: { enrolledCount: { increment: 1 } },
  });

  return { handled: true, reason: 'enrolled' as const };
}

export async function handleCheckoutSessionExpired(session: Stripe.Checkout.Session) {
  const updated = await expireOrderByCheckoutSessionId(session.id);
  return { handled: Boolean(updated) };
}
