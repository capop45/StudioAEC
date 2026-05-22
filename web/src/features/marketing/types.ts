export interface RedditPostRecord {
  id: string;
  title: string;
  subreddit: string;
  author: string;
  score: number;
  numComments: number;
  permalink: string;
  url: string;
  createdUtc: number;
  selftextPreview: string;
}

export interface MarketingSearchStats {
  totalPosts: number;
  totalScore: number;
  avgScore: number;
  topSubreddits: { name: string; count: number }[];
  topKeywords: { term: string; count: number }[];
  dateRange: { oldest: string | null; newest: string | null };
}

export interface ToolImportRecord {
  toolId: string;
  toolName: string;
  importedAt: string;
  notes: string;
  data: unknown;
}

export interface PhaseChecklistState {
  phase: number;
  itemIndex: number;
  done: boolean;
}

export interface MarketingResearchBundle {
  version: 1;
  generatedAt: string;
  query: string;
  subreddits: string[];
  posts: RedditPostRecord[];
  stats: MarketingSearchStats;
  personaDraft: string;
  toolImports: ToolImportRecord[];
  phaseChecklist: PhaseChecklistState[];
  broadTargetingNotes: string;
  landingStructureNotes: string;
}

export interface RedditSearchInput {
  query: string;
  subreddits: string[];
  limitPerSource?: number;
}
