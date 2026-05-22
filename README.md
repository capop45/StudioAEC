# Estúdio AEC — Plataforma LMS (Padrão Ouro)

Plataforma de treinamentos Revit/BIM preparada para IA (RAG, pgvector), com autenticação **Clerk**, catálogo público, área do aluno e módulo administrativo de planejamento.

## Stack (padrão ouro)

| Camada | Tecnologia |
|--------|------------|
| App | **Next.js 16** (App Router) + React 19 + TypeScript |
| Auth | **Clerk** (`clerkMiddleware`, `<Show>`, `<SignIn />`) |
| Banco | **PostgreSQL** + **pgvector** (Neon recomendado) |
| ORM | **Prisma 7** |
| UI | Tailwind 4 + design tokens (`web/src/styles/tokens.css`) |
| Legado | `frontend/` (Vite) + `backend/` (.NET) — **deprecados**, não estender |

## Estrutura

```
StudioAEC/
├── web/                      # Aplicação principal (Next.js)
│   ├── src/app/              # Rotas App Router
│   ├── src/features/         # auth, catalog, admin, ai, commerce
│   ├── src/components/       # UI compartilhada
│   ├── src/content/          # Dados de domínio (sem UI)
│   ├── prisma/               # Schema LMS + tabelas IA
│   └── src/proxy.ts          # Clerk middleware
├── frontend/                 # Legado Vite (referência)
├── backend/                  # Legado API .NET (referência)
└── CLAUDE.md / .cursorrules  # Governança (idênticos)
```

## Início rápido

### 1. Variáveis de ambiente

```bash
cd web
cp .env.example .env.local
```

Configure no [Clerk Dashboard](https://dashboard.clerk.com/):

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- URLs de sign-in conforme [documentação](https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page.md)

### 2. Banco local (PostgreSQL + pgvector)

```bash
cd web
npm run db:up          # Docker: postgres na porta 5432
npm run db:setup       # migrate + seed do catálogo
```

`DATABASE_URL` em `.env.local`:

```env
DATABASE_URL=postgresql://studioaec:studioaec@localhost:5432/studioaec?schema=public
```

### 3. Instalar e rodar

```bash
cd web
npm install
npm run dev
```

Acesse: <http://localhost:3000>

Testes E2E (com o dev server rodando ou via Playwright webServer):

```bash
npm run test:e2e
```

- Sign-in customizado: <http://localhost:3000/sign-in>
- Catálogo: `/treinamentos`, `/templates`, `/bibliotecas`, etc.
- Admin (autenticado): `/admin/planejamento`

### 4. Clerk (necessário para login real)

Sem `CLERK_SECRET_KEY`, o site público funciona; login e `/dashboard` exigem chaves do [Clerk Dashboard](https://dashboard.clerk.com/).

Webhook (sync usuário → Postgres): endpoint `https://seu-dominio/api/webhooks/clerk` com `CLERK_WEBHOOK_SECRET`.

**Admin (usuário `andre`, ID `user_3E2Hu1ehSTZmblJ6Z2wYN2QJTxa`):**

1. No [Clerk Dashboard](https://dashboard.clerk.com/) → **Users** → selecione o usuário → **Public metadata** → `{ "role": "admin" }`, **Save**.
2. Ou, com `CLERK_SECRET_KEY` em `.env.local`: `cd web && npm run clerk:grant-admin`
3. O seed Prisma também grava o usuário como `ADMIN` quando `npm run db:seed` roda com `DATABASE_URL` configurado.

Variáveis opcionais: `CLERK_ADMIN_USER_IDS`, `CLERK_ADMIN_USERNAMES` (ver `web/.env.example`).

## Clerk — checklist

- [x] `clerkMiddleware()` em `src/proxy.ts`
- [x] Matcher inclui `'/__clerk/(.*)'`
- [x] `<ClerkProvider>` dentro de `<body>`
- [x] `<Show>` em vez de `<SignedIn>` / `<SignedOut>`
- [x] Página `app/sign-in/[[...sign-in]]/page.tsx`

## Rotas públicas vs protegidas

**Públicas:** `/`, `/sign-in`, catálogo, APIs `/api/tracks`, `/api/courses`, webhooks Stripe.

**Protegidas (Clerk):** `/dashboard`, `/admin/*`, APIs de planejamento.

**Novas rotas:** `/dashboard` (área do aluno), `/api/health`, `/api/webhooks/clerk`, `/api/checkout`, `/api/webhooks/stripe`.

### Stripe (compra de curso)

1. Chaves em `web/.env.local`: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_APP_URL`
2. Webhook local: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`
3. Catálogo: módulo 1 de cada trilha (`purchasable`, R$ 199) — botão **Comprar** em `/treinamentos/[slug]`
4. Após pagamento: `checkout.session.completed` → matrícula em `enrollments`

## Próximas fases (roadmap padrão ouro)

1. ~~Seed Prisma + sync usuários Clerk → tabela `User`~~
2. ~~Pipeline RAG~~ (`features/ai`, coluna `embedding vector(1536)`, `POST /api/ai/tutor`, tutor no `/dashboard`)
3. ~~Stripe + webhooks de matrícula~~ (`features/commerce`)
4. ~~Pre-signed URLs (S3)~~ (`GET /api/library/[assetId]/download`, matrícula por trilha)
5. ~~Playwright E2E~~ (`e2e/commerce`, `e2e/ai-tutor`, `e2e/library-download`) + `vercel.json`

### RAG (tutor IA)

- Ingestão no seed: `npm run db:seed` indexa chunks das aulas demo
- API: `POST /api/ai/tutor` com `{ courseId, message }` (requer matrícula ativa)
- Pre-filtering: busca vetorial só dentro do `courseId` (e `organizationId` quando existir)

### Biblioteca (S3)

- Configure `S3_BUCKET`, credenciais AWS e faça upload dos zips em `library/<trilha>/catalog.zip`
- Download protegido por matrícula na trilha (`track_slug` em `library_assets`)

### Deploy

- **Local (testes):** `.\scripts\deploy-local.ps1` — ver [`docs/PLATFORM_TOOLS_ANALYSIS.md`](docs/PLATFORM_TOOLS_ANALYSIS.md)
- **Produção (Vercel):** `.\scripts\deploy-production.ps1 -ProductionUrl https://seu-dominio`
- Guia Vercel: [`web/DEPLOY.md`](web/DEPLOY.md) — Root Directory: `web`
- Após deploy: `npm run rag:reindex` (com `OPENAI_API_KEY`) para embeddings reais

### Pós-roadmap (operacional)

1. `OPENAI_API_KEY` em `web/.env.local` → `npm run rag:reindex`
2. Stripe: `stripe listen --forward-to localhost:3000/api/webhooks/stripe` → copie `whsec_…` para `STRIPE_WEBHOOK_SECRET` em `.env.local`
3. Prisma: `cd web && npm run db:generate` (roda no `postinstall`) — se `commerceOrder` falhar no webhook, reinicie `npm run dev`
3. S3: upload `library/<trilha>/catalog.zip` + envs AWS
4. Deploy Vercel conforme `DEPLOY.md`

## Referências

- [Clerk — Core concepts](https://clerk.com/docs/getting-started/core-concepts.md)
- [Clerk — Custom sign-in (Next.js)](https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page.md)
- Documento interno: *Padrão Ouro para Plataformas de Cursos Online*
