import type { Metadata } from 'next';
import { PRIVACY_POLICY } from '@/content/legal';
import { LegalDocumentView } from '@/features/legal/components/LegalDocumentView';

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description:
    'Como o Estúdio AEC trata dados pessoais, cookies essenciais, operadores (Clerk, Stripe) e direitos LGPD.',
};

export default function PrivacidadePage() {
  return (
    <LegalDocumentView
      document={PRIVACY_POLICY}
      sibling={{ href: '/termos', label: 'Ver Termos de uso →' }}
    />
  );
}
