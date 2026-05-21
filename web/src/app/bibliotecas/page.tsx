import type { Metadata } from 'next';
import { BibliotecasFilter } from '@/features/marketing/components/BibliotecasFilter';

export const metadata: Metadata = {
  title: 'Bibliotecas BIM',
  description: 'Famílias paramétricas Revit, scripts Dynamo e bibliotecas multidisciplinares.',
};

export default function BibliotecasPage() {
  return <BibliotecasFilter />;
}
