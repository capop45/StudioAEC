export interface LoginResponse {
  token: string;
  name: string;
  email: string;
  role: string;
}

export interface CourseTrack {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  courseCount: number;
  totalHours: number;
}

export interface Course {
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

export interface PlanningList {
  id: string;
  name: string;
  order: number;
}

export interface PlanningTask {
  id: string;
  title: string;
  status: string;
  priority: string;
  assignee: string;
  startDate: string;
  endDate: string;
  progressPercent: number;
  listId: string;
}

export interface WorkloadEntry {
  assignee: string;
  taskCount: number;
  hoursEstimated: number;
  capacityHours: number;
}

export interface GanttItem {
  id: string;
  title: string;
  assignee: string;
  start: string;
  end: string;
  color: string;
}
