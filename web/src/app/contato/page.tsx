import type { Metadata } from 'next';
import { ContatoForm } from '@/features/marketing/components/ContatoForm';

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Fale com o Estúdio AEC — treinamentos, templates, bibliotecas e consultoria BIM.',
};

export default function ContatoPage() {
  return <ContatoForm />;
}
