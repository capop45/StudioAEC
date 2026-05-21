import Stripe from 'stripe';

const globalForStripe = globalThis as unknown as { stripe: Stripe | undefined };

/** Prefer restricted key (rk_) per Stripe best practices; fallback to secret key (sk_). */
export function getStripeApiKey(): string | undefined {
  return (
    process.env.STRIPE_RESTRICTED_KEY?.trim() || process.env.STRIPE_SECRET_KEY?.trim()
  );
}

export function isStripeConfigured(): boolean {
  return Boolean(getStripeApiKey());
}

export function getStripe(): Stripe {
  const apiKey = getStripeApiKey();
  if (!apiKey) {
    throw new Error('STRIPE_RESTRICTED_KEY or STRIPE_SECRET_KEY is not configured');
  }

  if (!globalForStripe.stripe) {
    globalForStripe.stripe = new Stripe(apiKey, {
      typescript: true,
    });
  }

  return globalForStripe.stripe;
}

export function getAppBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3000';
  return url.replace(/\/$/, '');
}
