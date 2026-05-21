import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCourses, getTrackBySlug } from '@/features/catalog/services/catalogService';
import { TrackDetailView } from '@/features/catalog/views/TrackDetailView';

interface TrackDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TrackDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const track = await getTrackBySlug(slug);
  if (!track) {
    return { title: 'Trilha não encontrada' };
  }
  return {
    title: track.title,
    description: track.description,
  };
}

export default async function TrackDetailPage({ params }: TrackDetailPageProps) {
  const { slug } = await params;
  const track = await getTrackBySlug(slug);
  if (!track) {
    notFound();
  }

  const courses = await getCourses(track.id);
  return <TrackDetailView track={track} courses={courses} />;
}
