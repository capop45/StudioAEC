export type MarketingToolCategory =
  | 'audience_research'
  | 'community_listening'
  | 'trends_demand'
  | 'seo_ppc'
  | 'ad_intelligence'
  | 'offer_monitoring'
  | 'first_party'
  | 'b2b_leads'
  | 'creative_editing'
  | 'validation'
  | 'ai_synthesis'
  | 'analytics';

/** free = custo zero permanente; freemium = plano gratuito com limites; trial = só avaliação; paid = pago desde o início */
export type MarketingPricingTier = 'free' | 'freemium' | 'trial' | 'paid';

export type MarketingToolStatus = 'active' | 'discontinued';

export interface MarketingToolDefinition {
  id: string;
  name: string;
  category: MarketingToolCategory;
  url: string;
  description: string;
  exportHint: string;
  pricingTier: MarketingPricingTier;
  pricingNote: string;
  status: MarketingToolStatus;
  statusNote?: string;
  replacedBy?: string[];
  automatable: boolean;
}

export const PRICING_TIER_LABELS: Record<MarketingPricingTier, string> = {
  free: 'Gratuito',
  freemium: 'Freemium',
  trial: 'Trial',
  paid: 'Pago',
};

export const MARKETING_TOOL_CATEGORIES: Record<
  MarketingToolCategory,
  { label: string; order: number }
> = {
  audience_research: { label: 'Pesquisa semântica de audiência', order: 1 },
  community_listening: { label: 'Escuta ativa em comunidades', order: 2 },
  trends_demand: { label: 'Tendências e demanda', order: 3 },
  seo_ppc: { label: 'Inteligência SEO/PPC', order: 4 },
  ad_intelligence: { label: 'Espionagem de anúncios', order: 5 },
  offer_monitoring: { label: 'Monitoramento de ofertas', order: 6 },
  first_party: { label: 'First-party (e-mail/SMS)', order: 7 },
  b2b_leads: { label: 'Leads B2B', order: 8 },
  creative_editing: { label: 'Criação de criativos', order: 9 },
  validation: { label: 'Validação humana', order: 10 },
  ai_synthesis: { label: 'Síntese com IA', order: 11 },
  analytics: { label: 'Analytics e auditoria', order: 12 },
};

export const MARKETING_TOOLS: MarketingToolDefinition[] = [
  {
    id: 'sparktoro',
    name: 'SparkToro',
    category: 'audience_research',
    url: 'https://sparktoro.com/pricing',
    description: 'Fontes de influência do nicho (sites, podcasts, canais, newsletters).',
    exportHint: 'Lista de fontes e relatórios (CSV em planos pagos).',
    pricingTier: 'freemium',
    pricingNote: 'Grátis: 5 relatórios/mês. Pago desde ~US$ 50/mês.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'f5bot',
    name: 'F5Bot',
    category: 'community_listening',
    url: 'https://f5bot.com/',
    description: 'Alertas por e-mail quando keywords aparecem no Reddit, HN ou Lobsters.',
    exportHint: 'Log de alertas e URLs dos posts.',
    pricingTier: 'free',
    pricingNote: 'Conta gratuita; planos pagos só para keywords muito comuns ou alertas semânticos.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'syften',
    name: 'Syften',
    category: 'community_listening',
    url: 'https://syften.com/',
    description: 'Monitoramento de keywords em Reddit e outros fóruns (substituto pago do GummySearch).',
    exportHint: 'Feed filtrado de menções e keywords.',
    pricingTier: 'paid',
    pricingNote: 'Pago (~US$ 19/mês em referências de mercado); não é gratuito.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'brandmentions',
    name: 'BrandMentions',
    category: 'community_listening',
    url: 'https://brandmentions.com/pricing.php',
    description: 'Menções de marca e keywords em Reddit, blogs e fóruns.',
    exportHint: 'CSV de menções (após trial).',
    pricingTier: 'trial',
    pricingNote: 'Trial 7 dias; planos pagos desde ~US$ 99/mês (cobrança trimestral no Starter).',
    status: 'active',
    automatable: false,
  },
  {
    id: 'reddit_native',
    name: 'Reddit (busca Admin Estúdio AEC)',
    category: 'community_listening',
    url: 'https://www.reddit.com/',
    description: 'Busca integrada no painel Admin — sem custo de SaaS.',
    exportHint: 'JSON/CSV via exportação do painel.',
    pricingTier: 'free',
    pricingNote: 'Gratuito (API pública Reddit + painel interno).',
    status: 'active',
    automatable: true,
  },
  {
    id: 'gummysearch',
    name: 'GummySearch',
    category: 'community_listening',
    url: 'https://gummysearch.com/',
    description: 'DESCONTINUADO — pesquisa de audiência no Reddit.',
    exportHint: 'Não aplicável.',
    pricingTier: 'paid',
    pricingNote: 'Encerrado em nov/2025; sem novos cadastros.',
    status: 'discontinued',
    statusNote: 'Descontinuado após impasse com Reddit Data API (nov/2025).',
    replacedBy: ['f5bot', 'reddit_native', 'syften'],
    automatable: false,
  },
  {
    id: 'howitzer',
    name: 'Howitzer',
    category: 'community_listening',
    url: 'https://howitzer.co/',
    description: 'DESCONTINUADO — automação de DM/outreach no Reddit.',
    exportHint: 'Não aplicável.',
    pricingTier: 'paid',
    pricingNote: 'Empresa deadpooled; domínio redireciona para outras ferramentas.',
    status: 'discontinued',
    statusNote: 'Não usar outreach em massa no Reddit — risco de ban e má reputação.',
    replacedBy: ['f5bot', 'reddit_native'],
    automatable: false,
  },
  {
    id: 'google_trends',
    name: 'Google Trends',
    category: 'trends_demand',
    url: 'https://trends.google.com/trends/',
    description: 'Interesse de busca ao longo do tempo.',
    exportHint: 'CSV ou captura dos termos AEC/BIM/Revit.',
    pricingTier: 'free',
    pricingNote: 'Gratuito.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'buzzsumo',
    name: 'BuzzSumo',
    category: 'trends_demand',
    url: 'https://buzzsumo.com/pricing/',
    description: 'Conteúdo mais compartilhado e Question Analyzer (inclui Reddit).',
    exportHint: 'Top URLs e ângulos (durante trial ou plano pago).',
    pricingTier: 'trial',
    pricingNote: 'Sem plano gratuito permanente; trial ~30 dias ou 50 buscas; pago desde ~US$ 199/mês.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'semrush',
    name: 'SEMrush',
    category: 'seo_ppc',
    url: 'https://www.semrush.com/',
    description: 'Keywords, tráfego e gap competitivo.',
    exportHint: 'Relatório de keywords (limitado no free).',
    pricingTier: 'freemium',
    pricingNote: 'Conta free: 10 consultas/dia, 100 URLs no Site Audit/mês, 10 keywords.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'ahrefs',
    name: 'Ahrefs Free',
    category: 'seo_ppc',
    url: 'https://ahrefs.com/webmaster-tools',
    description: 'Site Audit, Site Explorer e Web Analytics para sites que você verifica.',
    exportHint: 'Backlinks e keywords do seu domínio.',
    pricingTier: 'freemium',
    pricingNote: 'Grátis só para propriedades verificadas; concorrentes exigem plano pago.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'similarweb',
    name: 'Similarweb',
    category: 'seo_ppc',
    url: 'https://www.similarweb.com/',
    description: 'Tráfego estimado e mix de canais de concorrentes.',
    exportHint: 'Screenshots; export só em planos pagos.',
    pricingTier: 'freemium',
    pricingNote: 'Consultas básicas gratuitas limitadas; trial 7 dias (cartão); pago desde ~US$ 125/mês.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'meta_ad_library',
    name: 'Meta Ad Library',
    category: 'ad_intelligence',
    url: 'https://www.facebook.com/ads/library/',
    description: 'Anúncios ativos; longevidade indica criativo vencedor.',
    exportHint: 'Hooks e formatos (anúncios > 3 meses).',
    pricingTier: 'free',
    pricingNote: 'Gratuito (biblioteca pública).',
    status: 'active',
    automatable: false,
  },
  {
    id: 'tiktok_creative',
    name: 'TikTok Creative Center',
    category: 'ad_intelligence',
    url: 'https://ads.tiktok.com/business/creativecenter/',
    description: 'Criativos verticais e tendências UGC.',
    exportHint: 'Referências de edição e gancho.',
    pricingTier: 'free',
    pricingNote: 'Gratuito (conta TikTok for Business).',
    status: 'active',
    automatable: false,
  },
  {
    id: 'distill',
    name: 'Distill.io',
    category: 'offer_monitoring',
    url: 'https://distill.io/',
    description: 'Monitora mudanças em páginas de concorrentes.',
    exportHint: 'Log de alertas.',
    pricingTier: 'freemium',
    pricingNote: 'Grátis: 25 monitores locais, 5 cloud, checagem cloud a cada 6h.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'visualping',
    name: 'Visualping',
    category: 'offer_monitoring',
    url: 'https://visualping.io/',
    description: 'Alertas visuais de alteração em URLs.',
    exportHint: 'Histórico de mudanças.',
    pricingTier: 'freemium',
    pricingNote: 'Grátis: 5 páginas, 150 checagens/mês, intervalo mín. 60 min.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'klaviyo',
    name: 'Klaviyo',
    category: 'first_party',
    url: 'https://www.klaviyo.com/pricing',
    description: 'E-mail/SMS e abandono de carrinho para e-commerce/cursos.',
    exportHint: 'Métricas de lista e fluxos.',
    pricingTier: 'paid',
    pricingNote: 'Pago por contatos ativos; trial limitado para novos projetos.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'hubspot',
    name: 'HubSpot CRM',
    category: 'first_party',
    url: 'https://www.hubspot.com/products/crm',
    description: 'CRM e captura de leads (inbound).',
    exportHint: 'Export de contatos e funil.',
    pricingTier: 'freemium',
    pricingNote: 'CRM free permanente (até 2 usuários); marketing automation exige upgrade.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'braze',
    name: 'Braze',
    category: 'first_party',
    url: 'https://www.braze.com/',
    description: 'Engajamento mobile/e-mail em escala enterprise.',
    exportHint: 'Campanhas e entregabilidade.',
    pricingTier: 'paid',
    pricingNote: 'Enterprise; orçamento sob consulta.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'sendgrid',
    name: 'SendGrid (Twilio)',
    category: 'first_party',
    url: 'https://sendgrid.com/pricing',
    description: 'API de envio transacional em escala.',
    exportHint: 'Taxas de entrega.',
    pricingTier: 'freemium',
    pricingNote: 'Trial/plano entry pago; não é stack gratuita completa de CRM.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'hunter',
    name: 'Hunter.io',
    category: 'b2b_leads',
    url: 'https://hunter.io/pricing',
    description: 'E-mails por domínio (B2B escritórios).',
    exportHint: 'Lista verificada (limite no free).',
    pricingTier: 'freemium',
    pricingNote: 'Grátis: 50 créditos/mês; pago desde ~US$ 49/mês.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'mailshake',
    name: 'Mailshake',
    category: 'b2b_leads',
    url: 'https://mailshake.com/pricing',
    description: 'Cadência de cold e-mail e warming.',
    exportHint: 'Sequências e respostas.',
    pricingTier: 'paid',
    pricingNote: 'Pago (planos por usuário, sem tier free permanente).',
    status: 'active',
    automatable: false,
  },
  {
    id: 'icyleads',
    name: 'Icy Leads',
    category: 'b2b_leads',
    url: 'https://icyleads.com/',
    description: 'Prospecção fria B2B (e-mail + sequências).',
    exportHint: 'Taxas por campanha.',
    pricingTier: 'paid',
    pricingNote: 'Pago (~US$ 99/mês em listagens); avaliar suporte e reputação antes de contratar.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'veed',
    name: 'VEED',
    category: 'creative_editing',
    url: 'https://www.veed.io/pricing',
    description: 'UGC, legendas automáticas, formato vertical.',
    exportHint: 'Variantes de criativo A/B.',
    pricingTier: 'freemium',
    pricingNote: 'Grátis com watermark e export 720p; pago remove marca e sobe qualidade.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'motionbox',
    name: 'Motionbox',
    category: 'creative_editing',
    url: 'https://www.motionbox.io/',
    description: 'Edição colaborativa no browser e legendas automáticas.',
    exportHint: 'Formatos por gancho.',
    pricingTier: 'freemium',
    pricingNote: 'Cadastro gratuito; recursos avançados em planos pagos.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'jitter',
    name: 'Jitter',
    category: 'creative_editing',
    url: 'https://jitter.video/pricing',
    description: 'Motion graphics e anúncios animados.',
    exportHint: 'Peças por teste.',
    pricingTier: 'freemium',
    pricingNote: 'Plano free com limites; Pro para export sem watermark.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'google_forms',
    name: 'Google Forms',
    category: 'validation',
    url: 'https://forms.google.com/',
    description: 'Validação de problema, preço e produto similar.',
    exportHint: 'CSV de respostas.',
    pricingTier: 'free',
    pricingNote: 'Gratuito com conta Google.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    category: 'ai_synthesis',
    url: 'https://chatgpt.com/',
    description: 'Persona e copy a partir do corpus real.',
    exportHint: 'Documento persona revisado.',
    pricingTier: 'freemium',
    pricingNote: 'Tier free com limites; Plus/Team para modelos avançados.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    category: 'ai_synthesis',
    url: 'https://gemini.google.com/',
    description: 'Síntese alternativa ao ChatGPT.',
    exportHint: 'Persona + grade curricular.',
    pricingTier: 'freemium',
    pricingNote: 'Grátis com limites; Google AI Pro/Ultra pagos.',
    status: 'active',
    automatable: false,
  },
  {
    id: 'ga4',
    name: 'Google Analytics 4',
    category: 'analytics',
    url: 'https://analytics.google.com/',
    description: 'Comportamento first-party no site.',
    exportHint: 'Eventos de conversão.',
    pricingTier: 'free',
    pricingNote: 'Gratuito (propriedades padrão).',
    status: 'active',
    automatable: false,
  },
  {
    id: 'responsively',
    name: 'Responsively App',
    category: 'analytics',
    url: 'https://responsively.app/',
    description: 'Auditoria mobile da landing (open source).',
    exportHint: 'Checklist de breakpoints.',
    pricingTier: 'free',
    pricingNote: 'Gratuito e open source.',
    status: 'active',
    automatable: false,
  },
];

export const ACTIVE_MARKETING_TOOLS = MARKETING_TOOLS.filter((t) => t.status === 'active');

export const DISCONTINUED_MARKETING_TOOLS = MARKETING_TOOLS.filter(
  (t) => t.status === 'discontinued',
);

export function getToolById(id: string): MarketingToolDefinition | undefined {
  return MARKETING_TOOLS.find((t) => t.id === id);
}

export const DEFAULT_AEC_SUBREDDITS = [
  'bim',
  'Architects',
  'Revit',
  'RevitForum',
  'civilengineering',
  'Construction',
  'StructuralEngineering',
  'architecture',
] as const;

export const MARKETING_PHASE_CHECKLIST = [
  {
    phase: 1,
    title: 'Mineração de dores orgânicas (custo zero)',
    items: [
      'Monitorar subreddits AEC (F5Bot + busca Reddit no Admin)',
      'Auditar falhas de concorrentes Edtech (preço, teoria, experiência prática)',
      'Mapear gargalos Revit (famílias pesadas, pranchas, paramétricas, as-built)',
      'Sintetizar corpus em ChatGPT/Gemini com prompts do playbook',
      'Validar ementa em LinkedIn e grupos',
    ],
  },
  {
    phase: 2,
    title: 'Espionagem competitiva e influência',
    items: [
      'Mapear sequência de referência (Paul Aubin, Ascent)',
      'Meta Ad Library + TikTok Creative Center (anúncios > 3 meses)',
      'SparkToro (5 relatórios free) ou import manual: portais, YouTube, newsletters BIM',
    ],
  },
  {
    phase: 3,
    title: 'Iscas e first-party data',
    items: [
      'Definir isca (famílias leves, template lineweights ou checklist CAD→BIM)',
      'Landing de captura mobile-first (Responsively)',
      'HubSpot CRM free ou Klaviyo (pago) para entrega automática',
    ],
  },
  {
    phase: 4,
    title: 'Anúncios broad + UGC',
    items: [
      'Meta Ads com broad targeting (sem interesses estreitos)',
      'Vídeos VEED (free com watermark ou plano pago) — gancho nos 3 primeiros segundos',
      'CTA para isca, não venda direta no primeiro clique',
    ],
  },
  {
    phase: 5,
    title: 'Funil, visibilidade IA e retenção',
    items: [
      'Landing de vendas 10-35-10-40-5',
      'Consistência de marca (site, YouTube, Reddit, avaliações)',
      'Réguas e-mail: HubSpot free ou Klaviyo pago (carrinho, descontos)',
    ],
  },
] as const;

export const LLM_PERSONA_PROMPT = `Analise APENAS os dados anexados (posts Reddit, reviews, formulários importados).
Não invente demografia.

Entregue:
1) Top 10 dores com paráfrase fiel ao texto fonte
2) Persona operacional (cargo, contexto de escritório, medos, objeções de preço)
3) Gatilhos para os 3 primeiros segundos de vídeo UGC
4) Objecões para neutralizar na landing
5) Grade curricular prática (módulos anti-teoria genérica AEC)`;

export function buildGoogleTrendsUrl(keywords: string[]): string {
  const q = keywords.filter(Boolean).join(',');
  return `https://trends.google.com/trends/explore?q=${encodeURIComponent(q)}&geo=BR`;
}

export function buildMetaAdLibraryUrl(brand: string): string {
  return `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=BR&q=${encodeURIComponent(brand)}`;
}

export function buildF5BotUrl(): string {
  return 'https://f5bot.com/';
}
