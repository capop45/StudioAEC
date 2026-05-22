import type { RedditPostRecord, RedditSearchInput } from '@/features/marketing/types';

const REDDIT_USER_AGENT = 'web:studioaec-marketing:1.0 (contact: admin@studioaec.com.br)';

interface RedditListingChild {
  data: {
    id: string;
    title: string;
    subreddit: string;
    author: string;
    score: number;
    num_comments: number;
    permalink: string;
    url: string;
    created_utc: number;
    selftext?: string;
  };
}

interface RedditListing {
  data?: { children?: RedditListingChild[] };
}

function mapChild(child: RedditListingChild): RedditPostRecord {
  const d = child.data;
  const preview = (d.selftext ?? '').replace(/\s+/g, ' ').trim().slice(0, 280);
  return {
    id: d.id,
    title: d.title,
    subreddit: d.subreddit,
    author: d.author,
    score: d.score,
    numComments: d.num_comments,
    permalink: `https://www.reddit.com${d.permalink}`,
    url: d.url,
    createdUtc: d.created_utc,
    selftextPreview: preview,
  };
}

async function fetchListing(url: string): Promise<RedditPostRecord[]> {
  const res = await fetch(url, {
    headers: { 'User-Agent': REDDIT_USER_AGENT },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Reddit API ${res.status}: ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as RedditListing;
  const children = json.data?.children ?? [];
  return children.map(mapChild);
}

export async function searchReddit(input: RedditSearchInput): Promise<RedditPostRecord[]> {
  const q = input.query.trim();
  if (!q) {
    throw new Error('Query is required');
  }

  const limit = Math.min(Math.max(input.limitPerSource ?? 15, 5), 25);
  const subs = input.subreddits.length > 0 ? input.subreddits : ['all'];
  const seen = new Set<string>();
  const results: RedditPostRecord[] = [];

  for (const sub of subs) {
    const base =
      sub === 'all'
        ? `https://www.reddit.com/search.json?q=${encodeURIComponent(q)}&sort=relevance&limit=${limit}`
        : `https://www.reddit.com/r/${encodeURIComponent(sub)}/search.json?q=${encodeURIComponent(q)}&restrict_sr=on&sort=relevance&limit=${limit}`;

    try {
      const batch = await fetchListing(base);
      for (const post of batch) {
        if (!seen.has(post.id)) {
          seen.add(post.id);
          results.push(post);
        }
      }
    } catch (err) {
      if (subs.length === 1) throw err;
      console.error(`Reddit search failed for r/${sub}:`, err);
    }

    await new Promise((r) => setTimeout(r, 350));
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}
