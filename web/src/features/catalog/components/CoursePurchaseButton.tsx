'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/Icon';
import type { CourseDto } from '@/features/catalog/types';

interface CoursePurchaseButtonProps {
  course: CourseDto;
  isSignedIn: boolean;
  signInRedirectUrl: string;
}

function formatPrice(priceCents: number, currency: string): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(priceCents / 100);
}

export function CoursePurchaseButton({
  course,
  isSignedIn,
  signInRedirectUrl,
}: CoursePurchaseButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!course.purchasable || course.priceCents == null) {
    return null;
  }

  const priceLabel = formatPrice(course.priceCents, course.currency);

  if (!isSignedIn) {
    return (
      <Link
        href={signInRedirectUrl}
        className="btn btn-primary btn-sm course-card__buy"
      >
        Comprar · {priceLabel}
        <Icon name="arrow-right" size={14} />
      </Link>
    );
  }

  async function handlePurchase() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: course.id }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? 'Não foi possível iniciar o pagamento.');
        return;
      }

      window.location.href = data.url;
    } catch {
      setError('Erro de rede ao iniciar o checkout.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="course-card__buy-wrap">
      <button
        type="button"
        className="btn btn-primary btn-sm course-card__buy"
        onClick={handlePurchase}
        disabled={loading}
      >
        {loading ? 'Redirecionando…' : `Comprar · ${priceLabel}`}
        {!loading && <Icon name="arrow-right" size={14} />}
      </button>
      {error && (
        <p className="course-card__buy-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
