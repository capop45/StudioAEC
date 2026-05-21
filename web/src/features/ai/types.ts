export interface RetrievedChunk {
  id: string;
  content: string;
  score: number;
  courseId: string;
  lessonId: string | null;
}

export interface TutorAnswer {
  answer: string;
  sources: RetrievedChunk[];
  usedLlm: boolean;
}
