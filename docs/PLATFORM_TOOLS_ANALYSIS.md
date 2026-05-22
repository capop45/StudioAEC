# Análise das ferramentas da plataforma — Estúdio AEC

Documento de referência para deploy (`scripts/deploy-local.ps1`, `scripts/deploy-production.ps1`).

## 1. Aplicação principal (`web/`)

| Domínio | Feature | Função | Integração externa |
|---------|---------|--------|-------------------|
| **Auth** | `features/auth` | Login, sync usuário → Postgres, roles admin | Clerk (`CLERK_*`, webhook `/api/webhooks/clerk`) |
| **Catálogo** | `features/catalog` | Trilhas, cursos, matrículas, dashboard aluno | PostgreSQL (Prisma) |
| **Commerce** | `features/commerce` | Checkout Stripe, pedidos, matrícula pós-pagamento | Stripe (`STRIPE_*`, webhook `/api/webhooks/stripe`) |
| **Content** | `features/content` | Download biblioteca (ZIP) | AWS S3 presigned (`S3_*`, `AWS_*`) |
| **AI / RAG** | `features/ai` | Tutor por curso, chunks pgvector, retrieval log | OpenAI (`OPENAI_*`), opcional AI Gateway |
| **Admin** | `features/admin` | Planejamento editorial | Clerk role `admin` |
| **Marketing** | `features/marketing` | Painel Reddit AEC, export persona/CSV, matriz de ferramentas | Reddit API pública (sem API key); playbook em `docs/MARKETING_REDDIT_STRATEGY.md` |
| **Legal** | `features/legal` | Termos, privacidade, aviso de cookies | Conteúdo estático `src/content/legal.ts` |

**Legado (não estender):** `frontend/` (Vite), `backend/` (.NET).

## 2. Scripts npm operacionais (`web/package.json`)

| Script | Uso no deploy |
|--------|----------------|
| `db:up` / `db:down` | Postgres local (Docker) — **deploy-local** |
| `db:migrate` | Migrações — local e Vercel build |
| `db:seed` | Catálogo demo + admin — local; opcional produção (`-RunPostDeployJobs`) |
| `db:generate` | Client Prisma — pós-`npm install` |
| `rag:reindex` | Embeddings reais — requer `OPENAI_API_KEY` |
| `clerk:grant-admin` | Metadata admin no Clerk |
| `s3:upload-demo-zip` | Upload demo biblioteca |
| `test:e2e` | Playwright (fluxos críticos) |

## 3. Matriz de marketing (ferramentas externas)

Definidas em `web/src/content/marketing/tools.ts` — **não são dependências de runtime** do LMS; servem ao playbook Admin → Marketing:

- **Integrada na plataforma:** busca Reddit (`reddit_native`, API pública).
- **Manuais / export CSV:** SparkToro, GummySearch, SEMrush, Meta Ad Library, Klaviyo, etc. (28+ ferramentas em 12 categorias).
- **Automação:** apenas fluxo Reddit no painel admin; demais ferramentas exigem export manual conforme `exportHint`.

## 4. Variáveis de ambiente por capacidade

| Capacidade | Variáveis | Obrigatório local | Obrigatório produção |
|------------|-----------|-------------------|----------------------|
| Core | `DATABASE_URL` | Sim (Docker) | Sim (Neon + `CREATE EXTENSION vector`) |
| Auth | `NEXT_PUBLIC_CLERK_*`, `CLERK_SECRET_KEY` | Sim (login real) | Sim |
| Sync usuários | `CLERK_WEBHOOK_SECRET` | Opcional local | Sim |
| Checkout | `STRIPE_*`, `NEXT_PUBLIC_STRIPE_*`, `NEXT_PUBLIC_APP_URL` | Para testar compra | Sim |
| Tutor IA | `OPENAI_*` | Opcional | Recomendado |
| Biblioteca | `AWS_*`, `S3_*` | Para download real | Sim |
| Admin seed | `CLERK_ADMIN_*` | Opcional | Opcional |
| Prisma Cloud | `PRISMA_SERVICE_TOKEN` | Não | Se usar Prisma Data Platform |
| AI Gateway | `AI_GATEWAY_API_KEY` | Opcional | Opcional |

Health check: `GET /api/health` reporta flags `clerk`, `stripe`, `stripeWebhook`, `s3`, `openai`.

## 5. Infraestrutura de deploy

| Ambiente | Destino | Build |
|----------|---------|-------|
| **Local** | `localhost:3000` | `next dev` ou `next build` + `next start` |
| **Produção** | Vercel (`gru1`) | `prisma migrate deploy && npm run build` (`web/vercel.json`) |

## 6. Uso dos scripts PowerShell

### Local (testes completos)

```powershell
# 1) Copiar segredos
Copy-Item scripts\deploy\secrets.local.env.example scripts\deploy\secrets.local.env
# Editar secrets.local.env com chaves reais

# 2) Deploy completo
.\scripts\deploy-local.ps1

# Apenas sincronizar .env.local
.\scripts\deploy-local.ps1 -OnlyEnv

# Build de produção local (sem dev)
.\scripts\deploy-local.ps1 -ProductionBuild -SkipDev
```

### Produção (usuário final)

```powershell
Copy-Item scripts\deploy\secrets.local.env.example scripts\deploy\secrets.production.env
# Preencher DATABASE_URL (Neon), chaves live/test de produção, S3, etc.

.\scripts\deploy-production.ps1 -ProductionUrl https://seu-dominio.com.br

# Validar segredos sem publicar
.\scripts\deploy-production.ps1 -ProductionUrl https://seu-dominio.com.br -DryRun
```

Ver também: `web/DEPLOY.md`, `README.md`.
