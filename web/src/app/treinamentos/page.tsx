import type { Metadata } from 'next';
import { getCourses, getTracks } from '@/features/catalog/services/catalogService';
import { TreinamentosView } from '@/features/catalog/views/TreinamentosView';

export const metadata: Metadata = {
  title: 'Treinamentos',
  description: 'Trilhas Revit por especialidade — catálogo de cursos BIM do Estúdio AEC.',
};

export default async function TreinamentosPage() {
  const [tracks, courses] = await Promise.all([getTracks(), getCourses()]);
  const year = new Date().getFullYear();

  return <TreinamentosView tracks={tracks} courses={courses} year={year} />;
}
