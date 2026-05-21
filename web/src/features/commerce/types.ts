import type { CommerceOrderStatus } from '@/generated/prisma';

export interface CheckoutSessionResult {
  url: string;
  orderId: string;
}

export interface CommerceOrderSummary {
  id: string;
  courseId: string;
  amountCents: number;
  currency: string;
  status: CommerceOrderStatus;
  stripeCheckoutSessionId: string | null;
}
