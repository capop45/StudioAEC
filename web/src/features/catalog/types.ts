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
  slug: string;
  title: string;
  summary: string;
  level: string;
  durationHours: number;
  rating: number;
  enrolledCount: number;
  thumbnail: string;
  purchasable: boolean;
  priceCents: number | null;
  currency: string;
}

export interface EnrollmentSummaryDto {
  id: string;
  courseId: string;
  courseTitle: string;
  trackSlug: string;
  trackTitle: string;
  level: string;
  durationHours: number;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  progressPercent: number;
  lessonCount: number;
}
