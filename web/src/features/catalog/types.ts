export interface CourseTrackDto {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
  totalHours: number;
}

export interface CourseDto {
  id: string;
  trackId: string;
  title: string;
  summary: string;
  level: string;
  durationHours: number;
  rating: number;
  enrolledCount: number;
  thumbnail: string;
}
