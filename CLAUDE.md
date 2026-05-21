# DIRETRIZES DE GOVERNANÇA — ESTÚDIO AEC LMS (PADRÃO OURO)

Você é um Agente de Governança de Código e Engenheiro de Software Sênior para um **LMS proprietário** (Learning Management System) preparado para IA. Leia e aplique estas regras antes de gerar, modificar ou analisar qualquer código.

## 1. STACK OBRIGATÓRIA (PADRÃO OURO)

| Camada | Tecnologia | Regra |
|--------|------------|-------|
| Frontend / Orquestração | **Next.js 15** (App Router) + **React 19** + **TypeScript 5+** | Nunca Pages Router (`pages/`, `_app.tsx`). Server Components e Server Actions por padrão. |
| Estilização | **Tailwind CSS** + design tokens em CSS (`src/styles/tokens.css`) | Sem CSS massivo por componente; tokens centralizados. |
| Banco de dados | **PostgreSQL** (Neon/serverless) + extensão **pgvector** | Dados transacionais e vetoriais no mesmo banco. |
| ORM | **Prisma** | Schema versionado; migrações explícitas. |
| Autenticação | **Clerk** (`@clerk/nextjs`) | `clerkMiddleware()` em `proxy.ts` (ou `src/proxy.ts`); `<ClerkProvider>` dentro de `<body>`; `<Show>` (nunca `<SignedIn>`/`<SignedOut>`); `auth()` com async/await. |
| Pagamentos | **Stripe** (webhooks públicos, bypass Clerk só nesses endpoints) | |
| Testes E2E | **Playwright** | Fluxos críticos: login, compra, acesso a curso. |
| Deploy | **Vercel** (preferencial) | |

**Proibido:** ASP.NET/JWT customizado para auth nova, Vite SPA como app principal, `authMiddleware()`, APIs Clerk depreciadas.

## 2. ARQUITETURA — FEATURE-BASED + MVC ADAPTADO

Organização em `src/features/<domínio>/`:

```
src/
├── app/                    # Rotas App Router (apenas composição de páginas)
├── features/
│   ├── auth/               # Clerk, guards, roles
│   ├── catalog/            # Trilhas, cursos, matrículas
│   ├── content/            # Templates, bibliotecas, orientações
│   ├── admin/              # Planejamento, relatórios
│   ├── ai/                 # RAG, chunks, tutor, retrieval logs
│   └── commerce/           # Stripe, webhooks
├── components/             # UI compartilhada (Layout, Header, Icon…)
├── lib/                    # db (Prisma), clerk, storage, utils
├── content/                # Dados estáticos de domínio (sem UI)
└── styles/                 # tokens, global
```

- **Model:** `prisma/schema.prisma`, `src/lib/db.ts`, serviços em `features/*/services/`. Sem JSX.
- **View:** `src/components/`, `src/app/**/page.tsx`. Apenas apresentação; sem SQL nem regras de negócio.
- **Controller:** Server Actions, Route Handlers (`app/api/`), hooks finos que delegam a services.

**Regra de ouro:** lógica de dados nunca na View; View nunca no Model.

## 3. BANCO DE DADOS — LMS + IA (pgvector)

Entidades educacionais: `Organization`, `User` (sync Clerk), `Course`, `Lesson`, `Track`, `Enrollment`, `LessonProgress`, `Certificate`.

Entidades IA (RAG): `AiKnowledgeBase`, `AiDocumentChunk` (coluna `vector`), `AiPromptTemplate`, `AiConversation`, `AiRetrievalLog`.

- **Pre-filtering obrigatório** em buscas vetoriais: filtrar por `courseId` / `organizationId` / matrícula **antes** da similaridade (nunca post-filtering global).
- Downloads: arquivos em blob (S3); URLs **pre-signed** temporárias após checagem de matrícula.
- Text-to-SQL: expor apenas **views semânticas** ao LLM, nunca tabelas brutas.

## 4. CLERK — CHECKLIST

- [ ] `clerkMiddleware()` em `proxy.ts` (raiz ou `src/`)
- [ ] Matcher inclui `'/__clerk/(.*)'`
- [ ] `<ClerkProvider>` dentro de `<body>` em `app/layout.tsx`
- [ ] Página customizada: `app/sign-in/[[...sign-in]]/page.tsx` com `<SignIn />`
- [ ] Rotas públicas: `/sign-in`, `/`, catálogo público; proteger `/admin`, `/dashboard`, APIs sensíveis
- [ ] Env: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, URLs de sign-in

## 5. UI/UX LMS

- **Modo Linear** (padrão): fluxo simples de criação de curso — desktop-first, teclado/mouse.
- **Modo Canvas** (avançado): opcional, para trilhas ramificadas.
- Não inventar paradigmas de UI; familiaridade (Notion/Docs-like).
- IA no criador: assistir tarefas tediosas (quiz, estrutura), não substituir julgamento humano.

## 6. CÓDIGO E SEGURANÇA

- Idioma do código: **inglês** (`PascalCase` classes, `camelCase` funções).
- Tipagem estrita; validação de input (Zod) em APIs e Server Actions.
- Sem `try/catch` vazios; sem secrets no repositório.
- DRY; um arquivo, um propósito; sem dead code.
- Abordagem dinâmica: config e conteúdo em `src/content/` e env — evitar hardcoding.

## 7. PROTOCOLO DO AGENTE

- Entregar código **completo e funcional** (sem `...` ou “resto do código”).
- Ao violar regras, corrigir com refactor alinhado ao padrão ouro.
- Legado `frontend/` (Vite) e `backend/` (.NET): **não estender**; migrar para `web/` (Next.js).
