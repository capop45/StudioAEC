import type { MarketingResearchBundle, RedditPostRecord } from '@/features/marketing/types';

function escapeCsv(value: string): string {
  const v = value.replace(/"/g, '""');
  return `"${v}"`;
}

export function bundleToJson(bundle: MarketingResearchBundle): string {
  return JSON.stringify(bundle, null, 2);
}

export function postsToCsv(posts: RedditPostRecord[]): string {
  const header = [
    'id',
    'subreddit',
    'title',
    'score',
    'num_comments',
    'author',
    'created_utc',
    'permalink',
    'preview',
  ].join(',');

  const rows = posts.map((p) =>
    [
      p.id,
      p.subreddit,
      p.title,
      String(p.score),
      String(p.numComments),
      p.author,
      String(p.createdUtc),
      p.permalink,
      p.selftextPreview,
    ]
      .map(escapeCsv)
      .join(','),
  );

  return [header, ...rows].join('\n');
}

export function bundleToMarkdownReport(bundle: MarketingResearchBundle): string {
  const lines = [
    '# Relatório de pesquisa de marketing — Estúdio AEC',
    '',
    `Gerado em: ${bundle.generatedAt}`,
    `Consulta: ${bundle.query}`,
    `Subreddits: ${bundle.subreddits.join(', ')}`,
    '',
    '## Estatísticas',
    `- Posts: ${bundle.stats.totalPosts}`,
    `- Score médio: ${bundle.stats.avgScore}`,
    `- Subreddits top: ${bundle.stats.topSubreddits.map((s) => `r/${s.name} (${s.count})`).join(', ')}`,
    `- Keywords: ${bundle.stats.topKeywords.map((k) => `${k.term} (${k.count})`).join(', ')}`,
    '',
    '## Persona (rascunho)',
    bundle.personaDraft,
    '',
    '## Broad targeting',
    bundle.broadTargetingNotes || '_Sem notas._',
    '',
    '## Landing 10-35-10-40-5',
    bundle.landingStructureNotes || '_Sem notas._',
    '',
    '## Imports de ferramentas',
  ];

  if (bundle.toolImports.length === 0) {
    lines.push('_Nenhum import manual._');
  } else {
    for (const imp of bundle.toolImports) {
      lines.push(`- **${imp.toolName}** (${imp.importedAt}): ${imp.notes || '—'}`);
    }
  }

  lines.push('', '## Amostra de posts', '');
  for (const p of bundle.posts.slice(0, 25)) {
    lines.push(`### [r/${p.subreddit}] ${p.title}`);
    lines.push(`- Score: ${p.score} | Comentários: ${p.numComments}`);
    lines.push(`- ${p.permalink}`);
    if (p.selftextPreview) lines.push(`> ${p.selftextPreview}`);
    lines.push('');
  }

  return lines.join('\n');
}

export function downloadFilename(prefix: string, ext: string): string {
  const d = new Date().toISOString().slice(0, 10);
  return `${prefix}-${d}.${ext}`;
}
