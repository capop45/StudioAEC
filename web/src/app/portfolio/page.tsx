import type { Metadata } from 'next';
import { PortfolioFilter } from '@/features/marketing/components/PortfolioFilter';

export const metadata: Metadata = {
  title: 'Portfólio',
  description: 'Projetos modelados em Revit — edifícios, residências, comércio e infraestrutura.',
};

export default function PortfolioPage() {
  return <PortfolioFilter />;
}
