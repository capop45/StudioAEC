import type { MarketingSearchStats, RedditPostRecord } from '@/features/marketing/types';

const STOPWORDS = new Set([
  'a',
  'o',
  'e',
  'de',
  'da',
  'do',
  'em',
  'um',
  'uma',
  'os',
  'as',
  'para',
  'com',
  'no',
  'na',
  'que',
  'the',
  'and',
  'or',
  'in',
  'on',
  'at',
  'to',
  'for',
  'is',
  'are',
  'was',
  'be',
  'by',
  'it',
  'of',
  'my',
  'i',
  'me',
  'revit',
  'bim',
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
}

export function buildMarketingStats(posts: RedditPostRecord[]): MarketingSearchStats {
  const subCounts = new Map<string, number>();
  const wordCounts = new Map<string, number>();
  let totalScore = 0;
  let oldest: number | null = null;
  let newest: number | null = null;

  for (const post of posts) {
    totalScore += post.score;
    subCounts.set(post.subreddit, (subCounts.get(post.subreddit) ?? 0) + 1);
    const blob = `${post.title} ${post.selftextPreview}`;
    for (const term of tokenize(blob)) {
      wordCounts.set(term, (wordCounts.get(term) ?? 0) + 1);
    }
    if (oldest === null || post.createdUtc < oldest) oldest = post.createdUtc;
    if (newest === null || post.createdUtc > newest) newest = post.createdUtc;
  }

  const topSubreddits = [...subCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  const topKeywords = [...wordCounts.entries()]
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  const total = posts.length;

  return {
    totalPosts: total,
    totalScore,
    avgScore: total > 0 ? Math.round((totalScore / total) * 10) / 10 : 0,
    topSubreddits,
    topKeywords,
    dateRange: {
      oldest: oldest ? new Date(oldest * 1000).toISOString() : null,
      newest: newest ? new Date(newest * 1000).toISOString() : null,
    },
  };
}

export function buildPersonaDraft(
  posts: RedditPostRecord[],
  stats: MarketingSearchStats,
  query: string,
): string {
  const topPain = posts.slice(0, 8).map((p, i) => `${i + 1}. [r/${p.subreddit}] ${p.title}`);
  const subs = stats.topSubreddits.map((s) => `r/${s.name} (${s.count})`).join(', ');
  const kws = stats.topKeywords.map((k) => k.term).join(', ');

  return [
    '# Rascunho de persona (revisar com LLM — ver playbook)',
    '',
    `**Consulta:** ${query}`,
    `**Subreddits dominantes:** ${subs || '—'}`,
    `**Termos frequentes:** ${kws || '—'}`,
    `**Posts analisados:** ${stats.totalPosts} | **Score médio:** ${stats.avgScore}`,
    '',
    '## Dores detectadas (amostra — validar manualmente)',
    ...topPain,
    '',
    '## Próximo passo',
    'Cole este rascunho + export JSON no ChatGPT/Gemini usando o prompt do playbook (`LLM_PERSONA_PROMPT`).',
    'Não publicar campanhas sem validação humana (Fase 1 checklist).',
  ].join('\n');
}
