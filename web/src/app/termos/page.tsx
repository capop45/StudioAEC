import type { Metadata } from 'next';
import { TERMS_OF_USE } from '@/content/legal';
import { LegalDocumentView } from '@/features/legal/components/LegalDocumentView';

export const metadata: Metadata = {
  title: 'Termos de uso',
  description:
    'Condições gerais de uso da plataforma Estúdio AEC: conta, compras, conteúdos, tutor IA e responsabilidades.',
};

export default function TermosPage() {
  return (
    <LegalDocumentView
      document={TERMS_OF_USE}
      sibling={{ href: '/privacidade', label: 'Ver Política de privacidade →' }}
    />
  );
}
