# Deploy — Estúdio AEC (Vercel)

App Next.js em `web/`. Configure o **Root Directory** do projeto Vercel como `web`.

## 1. Banco (Neon recomendado)

1. Crie um projeto PostgreSQL com extensão **pgvector**.
2. Rode no SQL console:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

3. Copie `DATABASE_URL` para as envs da Vercel.

## 2. Variáveis de ambiente (Vercel)

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `DATABASE_URL` | Sim | Postgres (Neon) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Sim | Clerk |
| `CLERK_SECRET_KEY` | Sim | Clerk |
| `CLERK_WEBHOOK_SECRET` | Sim | Webhook `/api/webhooks/clerk` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Sim | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Sim | `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL` | Sim | `/dashboard` |
| `NEXT_PUBLIC_APP_URL` | Sim | URL de produção (`https://…`) |
| `STRIPE_RESTRICTED_KEY` | Compras (preferencial) | `rk_test_…` — Checkout no servidor |
| `STRIPE_SECRET_KEY` | Compras (fallback) | `sk_test_…` se a RAK não tiver permissão |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Compras | `pk_test_…` |
| `STRIPE_WEBHOOK_SECRET` | Compras | Endpoint `/api/webhooks/stripe` |
| `AI_GATEWAY_API_KEY` | Opcional | Vercel AI Gateway (`vck_…`) |
| `OPENAI_API_KEY` | Tutor IA | Embeddings + chat |
| `OPENAI_EMBEDDING_MODEL` | Opcional | `text-embedding-3-small` |
| `OPENAI_CHAT_MODEL` | Opcional | `gpt-4o-mini` |
| `AWS_ACCESS_KEY_ID` | Biblioteca | S3 |
| `AWS_SECRET_ACCESS_KEY` | Biblioteca | S3 |
| `S3_BUCKET` | Biblioteca | Bucket |
| `AWS_REGION` | Opcional | ex. `sa-east-1` |
| `S3_LIBRARY_PREFIX` | Opcional | `library` |

**Nunca** commite chaves no repositório. Use apenas o painel da Vercel ou `.env.local` local.

## 3. Webhooks em produção

| Serviço | URL | Eventos |
|---------|-----|---------|
| Clerk | `https://SEU_DOMINIO/api/webhooks/clerk` | `user.created`, `user.updated`, `user.deleted` |
| Stripe | `https://SEU_DOMINIO/api/webhooks/stripe` | `checkout.session.completed`, `checkout.session.expired` |

## 4. Build

O `vercel.json` executa `prisma migrate deploy` antes do `next build`.

Se o banco estiver no **Prisma Data Platform** (Postgres gerenciado), defina na Vercel/CI o service token do workspace (ex. `studio-aec`) como `PRISMA_SERVICE_TOKEN` para o `prisma migrate deploy` autenticar. Localmente, `DATABASE_URL` em `.env.local` + `npm run db:generate` (ou `postinstall`) bastam; reinicie `npm run dev` após gerar o client.

Após o primeiro deploy com `DATABASE_URL`:

```bash
# Localmente, apontando DATABASE_URL de produção (cuidado):
cd web
npm run db:seed
npm run rag:reindex
```

Ou rode seed/reindex via job one-off na Vercel / CI.

## 5. Pós-deploy

- [ ] Sign-in em `/sign-in`
- [ ] `/api/health` com `database: connected`
- [ ] Compra teste (Stripe modo teste)
- [ ] Tutor no `/dashboard` com matrícula ativa
- [ ] Download biblioteca com objeto no S3
