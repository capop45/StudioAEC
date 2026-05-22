'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ACTIVE_MARKETING_TOOLS,
  DEFAULT_AEC_SUBREDDITS,
  DISCONTINUED_MARKETING_TOOLS,
  LLM_PERSONA_PROMPT,
  MARKETING_PHASE_CHECKLIST,
  MARKETING_TOOL_CATEGORIES,
  MARKETING_TOOLS,
  PRICING_TIER_LABELS,
  buildF5BotUrl,
  buildGoogleTrendsUrl,
  buildMetaAdLibraryUrl,
  type MarketingPricingTier,
  type MarketingToolDefinition,
} from '@/content/marketing/tools';
import type { MarketingResearchBundle, PhaseChecklistState } from '@/features/marketing/types';
import {
  bundleToJson,
  bundleToMarkdownReport,
  downloadFilename,
  postsToCsv,
} from '@/features/marketing/services/marketingExportService';
import '@/styles/marketing.css';

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function PricingBadge({ tier }: { tier: MarketingPricingTier }) {
  return <span className={`marketing-badge marketing-badge--${tier}`}>{PRICING_TIER_LABELS[tier]}</span>;
}

function ToolRow({ tool }: { tool: MarketingToolDefinition }) {
  const replacements =
    tool.replacedBy?.map((id) => MARKETING_TOOLS.find((t) => t.id === id)?.name).filter(Boolean) ?? [];

  return (
    <li className={tool.status === 'discontinued' ? 'marketing-tool--discontinued' : ''}>
      <div className="marketing-tool__head">
        {tool.status === 'active' ? (
          <a href={tool.url} target="_blank" rel="noopener noreferrer">
            {tool.name}
          </a>
        ) : (
          <span className="marketing-tool__name-muted">{tool.name}</span>
        )}
        <PricingBadge tier={tool.pricingTier} />
        {tool.status === 'discontinued' && (
          <span className="marketing-badge marketing-badge--discontinued">Descontinuado</span>
        )}
      </div>
      <span>{tool.description}</span>
      <span className="marketing-tool__pricing">{tool.pricingNote}</span>
      {tool.statusNote && <p className="marketing-tool__status-note">{tool.statusNote}</p>}
      {replacements.length > 0 && (
        <p className="marketing-tool__replaces">
          Substitutos: {replacements.join(', ')}
        </p>
      )}
      <em>{tool.exportHint}</em>
    </li>
  );
}

function initialChecklist(): PhaseChecklistState[] {
  const items: PhaseChecklistState[] = [];
  MARKETING_PHASE_CHECKLIST.forEach((phase) => {
    phase.items.forEach((_, itemIndex) => {
      items.push({ phase: phase.phase, itemIndex, done: false });
    });
  });
  return items;
}

export function MarketingPanel() {
  const [query, setQuery] = useState('revit slow families BIM course');
  const [selectedSubs, setSelectedSubs] = useState<string[]>([...DEFAULT_AEC_SUBREDDITS]);
  const [competitorBrand, setCompetitorBrand] = useState('Novatr');
  const [trendKeywords, setTrendKeywords] = useState('BIM,Revit,curso arquitetura');
  const [bundle, setBundle] = useState<MarketingResearchBundle | null>(null);
  const [checklist, setChecklist] = useState<PhaseChecklistState[]>(initialChecklist);
  const [personaNotes, setPersonaNotes] = useState('');
  const [broadNotes, setBroadNotes] = useState(
    'Meta Ads: broad BR, criativo = segmentação. Gancho 3s nomeia arquiteto/engenheiro + dor Revit pesado.',
  );
  const [landingNotes, setLandingNotes] = useState(
    '10% qualificação | 35% problema universidade/curso teórico | 10% método prático | 40% demo tela | 5% CTA inscrição.',
  );
  const [importJson, setImportJson] = useState('');
  const [importToolId, setImportToolId] = useState('sparktoro');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeToolsByCategory = useMemo(() => {
    const grouped = new Map<string, MarketingToolDefinition[]>();
    for (const tool of ACTIVE_MARKETING_TOOLS) {
      const list = grouped.get(tool.category) ?? [];
      list.push(tool);
      grouped.set(tool.category, list);
    }
    return [...grouped.entries()].sort(
      (a, b) =>
        MARKETING_TOOL_CATEGORIES[a[0] as keyof typeof MARKETING_TOOL_CATEGORIES].order -
        MARKETING_TOOL_CATEGORIES[b[0] as keyof typeof MARKETING_TOOL_CATEGORIES].order,
    );
  }, []);

  const freeToolCount = ACTIVE_MARKETING_TOOLS.filter((t) => t.pricingTier === 'free').length;

  const toggleSub = (sub: string) => {
    setSelectedSubs((prev) =>
      prev.includes(sub) ? prev.filter((s) => s !== sub) : [...prev, sub],
    );
  };

  const toggleChecklist = (phase: number, itemIndex: number) => {
    setChecklist((prev) =>
      prev.map((c) =>
        c.phase === phase && c.itemIndex === itemIndex ? { ...c, done: !c.done } : c,
      ),
    );
  };

  const runSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/marketing/reddit/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          subreddits: selectedSubs,
          limitPerSource: 15,
          personaNotes,
          broadTargetingNotes: broadNotes,
          landingStructureNotes: landingNotes,
          toolImports: bundle?.toolImports ?? [],
          phaseChecklist: checklist,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Falha na pesquisa');
      }
      setBundle(data as MarketingResearchBundle);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [query, selectedSubs, personaNotes, broadNotes, landingNotes, bundle?.toolImports, checklist]);

  const addToolImport = () => {
    if (!importJson.trim()) return;
    let parsed: unknown;
    try {
      parsed = JSON.parse(importJson);
    } catch {
      setError('JSON de import inválido');
      return;
    }
    const tool = MARKETING_TOOLS.find((t) => t.id === importToolId);
    const record = {
      toolId: importToolId,
      toolName: tool?.name ?? importToolId,
      importedAt: new Date().toISOString(),
      notes: '',
      data: parsed,
    };
    setBundle((prev) =>
      prev
        ? { ...prev, toolImports: [...prev.toolImports, record] }
        : {
            version: 1,
            generatedAt: new Date().toISOString(),
            query,
            subreddits: selectedSubs,
            posts: [],
            stats: {
              totalPosts: 0,
              totalScore: 0,
              avgScore: 0,
              topSubreddits: [],
              topKeywords: [],
              dateRange: { oldest: null, newest: null },
            },
            personaDraft: personaNotes,
            toolImports: [record],
            phaseChecklist: checklist,
            broadTargetingNotes: broadNotes,
            landingStructureNotes: landingNotes,
          },
    );
    setImportJson('');
    setError(null);
  };

  const exportBundle = (format: 'json' | 'csv' | 'md') => {
    if (!bundle) return;
    const full: MarketingResearchBundle = {
      ...bundle,
      phaseChecklist: checklist,
      personaDraft: personaNotes || bundle.personaDraft,
      broadTargetingNotes: broadNotes,
      landingStructureNotes: landingNotes,
    };
    if (format === 'json') {
      triggerDownload(
        bundleToJson(full),
        downloadFilename('marketing-research', 'json'),
        'application/json',
      );
    } else if (format === 'csv') {
      triggerDownload(
        postsToCsv(full.posts),
        downloadFilename('marketing-posts', 'csv'),
        'text/csv;charset=utf-8',
      );
    } else {
      triggerDownload(
        bundleToMarkdownReport(full),
        downloadFilename('marketing-persona', 'md'),
        'text/markdown;charset=utf-8',
      );
    }
  };

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(LLM_PERSONA_PROMPT);
  };

  return (
    <div className="marketing-panel">
      <header className="marketing-panel__intro">
        <p>
          Pesquisa de audiência conforme <code>docs/MARKETING_REDDIT_STRATEGY.md</code>.
          Matriz revisada em maio/2026: <strong>{freeToolCount} ferramentas gratuitas</strong> ativas,
          freemium com limites documentados, e substitutos para GummySearch/Howitzer (descontinuados).
        </p>
        <div className="marketing-legend">
          <PricingBadge tier="free" />
          <PricingBadge tier="freemium" />
          <PricingBadge tier="trial" />
          <PricingBadge tier="paid" />
        </div>
        <span className="marketing-link">Playbook: docs/MARKETING_REDDIT_STRATEGY.md</span>
      </header>

      <section className="marketing-section">
        <h2>Pesquisa Reddit (AEC)</h2>
        <div className="marketing-form-row">
          <label>
            Palavras-chave
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ex.: revit heavy families BIM course"
            />
          </label>
        </div>
        <div className="marketing-subs">
          <span className="marketing-subs__label">Subreddits</span>
          {DEFAULT_AEC_SUBREDDITS.map((sub) => (
            <button
              key={sub}
              type="button"
              className={`marketing-chip ${selectedSubs.includes(sub) ? 'active' : ''}`}
              onClick={() => toggleSub(sub)}
            >
              r/{sub}
            </button>
          ))}
        </div>
        <div className="marketing-actions">
          <button type="button" className="btn btn-primary" onClick={runSearch} disabled={loading}>
            {loading ? 'Pesquisando…' : 'Executar pesquisa'}
          </button>
          {bundle && (
            <>
              <button type="button" className="btn btn-sm" onClick={() => exportBundle('json')}>
                JSON
              </button>
              <button type="button" className="btn btn-sm" onClick={() => exportBundle('csv')}>
                CSV posts
              </button>
              <button type="button" className="btn btn-sm" onClick={() => exportBundle('md')}>
                Relatório MD
              </button>
            </>
          )}
        </div>
        {error && <p className="marketing-error">{error}</p>}
      </section>

      {bundle && (
        <>
          <section className="marketing-section marketing-stats">
            <h2>Estatísticas</h2>
            <div className="marketing-stats__grid">
              <div className="marketing-stat-card">
                <span className="marketing-stat-card__value">{bundle.stats.totalPosts}</span>
                <span className="marketing-stat-card__label">Posts</span>
              </div>
              <div className="marketing-stat-card">
                <span className="marketing-stat-card__value">{bundle.stats.avgScore}</span>
                <span className="marketing-stat-card__label">Score médio</span>
              </div>
              <div className="marketing-stat-card">
                <span className="marketing-stat-card__value">
                  {bundle.stats.topSubreddits[0]?.name ?? '—'}
                </span>
                <span className="marketing-stat-card__label">Subreddit top</span>
              </div>
            </div>
            <div className="marketing-keywords">
              <strong>Termos frequentes:</strong>{' '}
              {bundle.stats.topKeywords.map((k) => `${k.term} (${k.count})`).join(' · ') || '—'}
            </div>
          </section>

          <section className="marketing-section">
            <h2>Resultados ({bundle.posts.length})</h2>
            <div className="marketing-posts">
              {bundle.posts.map((p) => (
                <article key={p.id} className="marketing-post">
                  <h3>
                    <a href={p.permalink} target="_blank" rel="noopener noreferrer">
                      {p.title}
                    </a>
                  </h3>
                  <p className="marketing-post__meta">
                    r/{p.subreddit} · score {p.score} · {p.numComments} comentários · u/{p.author}
                  </p>
                  {p.selftextPreview && <p className="marketing-post__preview">{p.selftextPreview}</p>}
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      <section className="marketing-section">
        <h2>Atalhos de ferramentas</h2>
        <div className="marketing-form-row marketing-form-row--2">
          <label>
            Marca (Meta Ad Library)
            <input
              type="text"
              value={competitorBrand}
              onChange={(e) => setCompetitorBrand(e.target.value)}
            />
          </label>
          <label>
            Google Trends (termos separados por vírgula)
            <input
              type="text"
              value={trendKeywords}
              onChange={(e) => setTrendKeywords(e.target.value)}
            />
          </label>
        </div>
        <div className="marketing-actions">
          <a
            className="btn btn-sm"
            href={buildMetaAdLibraryUrl(competitorBrand)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Meta Ad Library
          </a>
          <a
            className="btn btn-sm"
            href={buildGoogleTrendsUrl(trendKeywords.split(',').map((s) => s.trim()))}
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Trends
          </a>
          <a className="btn btn-sm" href={buildF5BotUrl()} target="_blank" rel="noopener noreferrer">
            F5Bot (alertas grátis)
          </a>
          <button type="button" className="btn btn-sm" onClick={copyPrompt}>
            Copiar prompt LLM
          </button>
        </div>
      </section>

      <section className="marketing-section">
        <h2>Notas estratégicas</h2>
        <label>
          Persona / síntese IA
          <textarea
            rows={6}
            value={personaNotes}
            onChange={(e) => setPersonaNotes(e.target.value)}
            placeholder={bundle?.personaDraft ?? 'Cole aqui a persona após ChatGPT/Gemini…'}
          />
        </label>
        <label>
          Broad targeting (Meta)
          <textarea rows={3} value={broadNotes} onChange={(e) => setBroadNotes(e.target.value)} />
        </label>
        <label>
          Landing 10-35-10-40-5
          <textarea rows={3} value={landingNotes} onChange={(e) => setLandingNotes(e.target.value)} />
        </label>
      </section>

      <section className="marketing-section">
        <h2>Import manual (SparkToro, SEMrush, etc.)</h2>
        <div className="marketing-form-row marketing-form-row--2">
          <label>
            Ferramenta
            <select value={importToolId} onChange={(e) => setImportToolId(e.target.value)}>
              {ACTIVE_MARKETING_TOOLS.filter((t) => !t.automatable).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({PRICING_TIER_LABELS[t.pricingTier]})
                </option>
              ))}
            </select>
          </label>
        </div>
        <label>
          JSON exportado da ferramenta
          <textarea
            rows={4}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            placeholder='{"sources":[...]}'
          />
        </label>
        <button type="button" className="btn btn-sm" onClick={addToolImport}>
          Adicionar ao pacote
        </button>
        {bundle && bundle.toolImports.length > 0 && (
          <ul className="marketing-imports">
            {bundle.toolImports.map((imp, i) => (
              <li key={`${imp.toolId}-${i}`}>
                {imp.toolName} — {new Date(imp.importedAt).toLocaleString('pt-BR')}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="marketing-section">
        <h2>Checklist por fase (AEC)</h2>
        {MARKETING_PHASE_CHECKLIST.map((phase) => (
          <div key={phase.phase} className="marketing-phase">
            <h3>
              Fase {phase.phase}: {phase.title}
            </h3>
            <ul>
              {phase.items.map((item, itemIndex) => {
                const state = checklist.find(
                  (c) => c.phase === phase.phase && c.itemIndex === itemIndex,
                );
                return (
                  <li key={itemIndex}>
                    <label>
                      <input
                        type="checkbox"
                        checked={state?.done ?? false}
                        onChange={() => toggleChecklist(phase.phase, itemIndex)}
                      />
                      {item}
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </section>

      <section className="marketing-section marketing-tools-grid">
        <h2>Matriz de ferramentas (ativas)</h2>
        {activeToolsByCategory.map(([category, tools]) => (
          <div key={category} className="marketing-tool-group">
            <h3>{MARKETING_TOOL_CATEGORIES[category as keyof typeof MARKETING_TOOL_CATEGORIES].label}</h3>
            <ul>
              {tools.map((tool) => (
                <ToolRow key={tool.id} tool={tool} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      {DISCONTINUED_MARKETING_TOOLS.length > 0 && (
        <section className="marketing-section marketing-tools-grid marketing-tools-grid--deprecated">
          <h2>Ferramentas descontinuadas (referência histórica)</h2>
          <p className="marketing-tools-disclaimer">
            Não iniciar novos fluxos com estas ferramentas. Use os substitutos indicados em cada item.
          </p>
          <ul>
            {DISCONTINUED_MARKETING_TOOLS.map((tool) => (
              <ToolRow key={tool.id} tool={tool} />
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
