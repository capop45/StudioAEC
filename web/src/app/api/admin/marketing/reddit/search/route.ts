import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminApi } from '@/lib/adminApi';
import { searchReddit } from '@/features/marketing/services/redditSearchService';
import {
  buildMarketingStats,
  buildPersonaDraft,
} from '@/features/marketing/services/marketingStatsService';
import type { MarketingResearchBundle } from '@/features/marketing/types';

const bodySchema = z.object({
  query: z.string().min(2).max(200),
  subreddits: z.array(z.string().min(1).max(50)).max(12).default([]),
  limitPerSource: z.number().int().min(5).max(25).optional(),
  personaNotes: z.string().max(5000).optional(),
  broadTargetingNotes: z.string().max(5000).optional(),
  landingStructureNotes: z.string().max(5000).optional(),
  toolImports: z
    .array(
      z.object({
        toolId: z.string(),
        toolName: z.string(),
        importedAt: z.string(),
        notes: z.string(),
        data: z.unknown(),
      }),
    )
    .max(20)
    .optional(),
  phaseChecklist: z
    .array(
      z.object({
        phase: z.number(),
        itemIndex: z.number(),
        done: z.boolean(),
      }),
    )
    .optional(),
});

export async function POST(req: Request) {
  const forbidden = await requireAdminApi();
  if (forbidden) return forbidden;

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { query, subreddits, limitPerSource, toolImports, phaseChecklist } = parsed.data;

  try {
    const posts = await searchReddit({ query, subreddits, limitPerSource });
    const stats = buildMarketingStats(posts);
    const personaDraft = buildPersonaDraft(posts, stats, query);

    const bundle: MarketingResearchBundle = {
      version: 1,
      generatedAt: new Date().toISOString(),
      query,
      subreddits: subreddits.length > 0 ? subreddits : ['all'],
      posts,
      stats,
      personaDraft: parsed.data.personaNotes
        ? `${personaDraft}\n\n---\n\n${parsed.data.personaNotes}`
        : personaDraft,
      toolImports: toolImports ?? [],
      phaseChecklist: phaseChecklist ?? [],
      broadTargetingNotes: parsed.data.broadTargetingNotes ?? '',
      landingStructureNotes: parsed.data.landingStructureNotes ?? '',
    };

    return NextResponse.json(bundle);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Reddit search failed';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
