import type { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { BibliotecasFilter } from '@/features/marketing/components/BibliotecasFilter';

export const metadata: Metadata = {
  title: 'Bibliotecas BIM',
  description: 'Famílias paramétricas Revit, scripts Dynamo e bibliotecas multidisciplinares.',
};

export default async function BibliotecasPage() {
  const { userId } = await auth();
  return <BibliotecasFilter isSignedIn={Boolean(userId)} />;
}
