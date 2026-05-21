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

### 2. Instalar e rodar

```bash
cd web
npm install
npm run dev
```

Acesse: <http://localhost:3000>

- Sign-in customizado: <http://localhost:3000/sign-in>
- Catálogo: `/treinamentos`, `/templates`, `/bibliotecas`, etc.
- Admin (autenticado): `/admin/planejamento`

### 3. Banco de dados (opcional no MVP)

Sem `DATABASE_URL`, o catálogo usa **seed in-memory** (mesmos dados da API .NET legada).

Com PostgreSQL:

```bash
# Habilitar pgvector na instância
# CREATE EXTENSION IF NOT EXISTS vector;

npx prisma migrate dev
```

## Clerk — checklist

- [x] `clerkMiddleware()` em `src/proxy.ts`
- [x] Matcher inclui `'/__clerk/(.*)'`
- [x] `<ClerkProvider>` dentro de `<body>`
- [x] `<Show>` em vez de `<SignedIn>` / `<SignedOut>`
- [x] Página `app/sign-in/[[...sign-in]]/page.tsx`

## Rotas públicas vs protegidas

**Públicas:** `/`, `/sign-in`, catálogo, APIs `/api/tracks`, `/api/courses`, webhooks Stripe.

**Protegidas (Clerk):** `/admin/*`, demais APIs.

## Próximas fases (roadmap padrão ouro)

1. Seed Prisma + sync usuários Clerk → tabela `User`
2. Pipeline RAG (chunks + embeddings pgvector) com pre-filtering por matrícula
3. Stripe + webhooks de matrícula
4. Pre-signed URLs (S3) para biblioteca de downloads
5. Playwright E2E + deploy Vercel

## Referências

- [Clerk — Core concepts](https://clerk.com/docs/getting-started/core-concepts.md)
- [Clerk — Custom sign-in (Next.js)](https://clerk.com/docs/nextjs/guides/development/custom-sign-in-or-up-page.md)
- Documento interno: *Padrão Ouro para Plataformas de Cursos Online*
