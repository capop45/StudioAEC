import { HomeView } from '@/features/marketing/views/HomeView';
import { getCourses, getTracks } from '@/features/catalog/services/catalogService';

export default async function HomePage() {
  const [tracks, allCourses] = await Promise.all([getTracks(), getCourses()]);
  const courses = allCourses.slice(0, 6);

  return <HomeView tracks={tracks} courses={courses} />;
}
