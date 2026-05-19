# Estúdio AEC — Plataforma de Cursos

Plataforma de treinamentos Revit/BIM com área pública (trilhas, templates, bibliotecas, portfólio, orientações) e módulo administrativo (planejamento — lista, Gantt, workload). Stack: **React + Vite + TypeScript** no frontend e **ASP.NET Core 8** no backend.

## Estrutura

```
StudioAEC/
├── backend/                 # API C# (.NET 8) — BCrypt, JWT, rate limit, security headers
├── frontend/                # React + Vite + TS — design tokens, MVC enxuto
│   ├── public/images/       # Assets curados (brand, dimensões BIM, portfólio, disciplinas)
│   └── src/
│       ├── components/      # Layout, Header, Footer, Icon, Logo
│       ├── content/         # Dados de domínio (sem hardcoding nas Views)
│       ├── pages/           # Home, Treinamentos, Templates, Bibliotecas,
│       │                    # Orientações, Portfólio, Quem somos, Contato, Login
│       └── styles/          # tokens · global · layout · components · pages
├── docker-compose.yml       # Produção (nginx + API)
├── docker-compose.dev.yml   # Desenvolvimento (Vite + API)
└── .env.example             # Variáveis sensíveis (copie para .env)
```

## Credenciais de demonstração

| Perfil | E-mail                     | Senha       |
| ------ | -------------------------- | ----------- |
| Aluno  | aluno@estudioaec.com       | aluno123    |
| Admin  | admin@estudioaec.com       | admin123    |

Senhas armazenadas com **BCrypt (cost 11)** in-memory. Substituir pelo repositório persistente real antes de qualquer deploy público.

## Executar com Docker

### Preparar variáveis

```bash
cp .env.example .env
# edite JWT_KEY com pelo menos 32 caracteres (use: openssl rand -base64 48)
```

### Produção (simula site hospedado)

```bash
docker compose up --build
```

Acesse: <http://localhost> (porta configurável via `WEB_PORT` no `.env`).

### Desenvolvimento (hot-reload)

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Frontend: <http://localhost:5173>
- API: <http://localhost:8080>
- Swagger: <http://localhost:8080/swagger>

## Executar sem Docker

### Backend

```bash
cd backend/StudioAEC.Api
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

O Vite faz proxy de `/api` para `http://localhost:8080`.

## Páginas públicas

| Rota                  | Conteúdo                                                          |
| --------------------- | ----------------------------------------------------------------- |
| `/`                   | Home (hero, dimensões BIM, trilhas, cursos, depoimentos, CTA)     |
| `/treinamentos`       | Catálogo de trilhas + cursos com filtro por disciplina            |
| `/treinamentos/:slug` | Detalhe da trilha + cursos relacionados                           |
| `/templates`          | Templates Revit por disciplina + features do que vem dentro       |
| `/bibliotecas`        | Famílias e scripts Dynamo, filtro por categoria                   |
| `/orientacoes`        | Artigos técnicos + FAQ                                            |
| `/portfolio`          | Projetos modelados (filtro por categoria)                         |
| `/quem-somos`         | Sobre o estúdio + timeline + stack BIM                            |
| `/contato`            | Formulário de contato + meios de atendimento                      |
| `/login`              | Acesso à área do aluno                                            |
| `/admin/planejamento` | Lista · Gantt · Workload (somente Admin)                          |

## Design e UX

- **Sistema de design centralizado**: `src/styles/tokens.css` é fonte única de cor, tipografia, espaçamento e movimento — nada hardcoded nas Views.
- Tipografia: **DM Sans** (UI) + **Instrument Serif** (editorial) + **JetBrains Mono** (data/numerais).
- Paleta: deep ink + blueprint blue + amber accent — vocabulário visual de planta técnica.
- Acessibilidade: skip link, foco visível, `prefers-reduced-motion`, contraste AA, navegação por teclado.
- Responsivo: drawer mobile, grids fluidos, imagens otimizadas (`loading="lazy"`).

## Segurança

| Camada         | Medida                                                                            |
| -------------- | --------------------------------------------------------------------------------- |
| Senhas         | BCrypt cost 11, verify constante (mitiga enumeração por tempo)                    |
| JWT            | Chave validada (mín. 32 bytes), required em produção, expira em 8h, jti único    |
| API            | Rate limit `5 req/min` no login, validação de modelo, headers de segurança       |
| CORS           | Origens explícitas, métodos/headers explícitos (sem `AllowAny*`)                 |
| nginx          | CSP, HSTS, X-Frame-Options DENY, Permissions-Policy, COOP, cache imutável        |
| Container      | API roda como usuário não-root, healthcheck via `/health`                        |
| Docker compose | `JWT_KEY` obrigatório via `.env` em produção (`?` no compose falha sem ela)       |

## Arquitetura (MVC enxuto)

- **Model**: `backend/StudioAEC.Api/Models` e `frontend/src/content/*` para dados de domínio sem dependência de UI.
- **View**: Componentes em `src/components` e páginas em `src/pages`. Nenhuma regra de negócio nas Views.
- **Controller / Service**: Controllers .NET delegam para Services (`AuthService`, `CourseCatalogService`, `PlanningService`).

## Próximos passos sugeridos

- Persistência (PostgreSQL/SQL Server) substituindo dados em memória
- Integração Hotmart / pagamentos
- Upload de vídeos e progresso real do aluno
- Refresh tokens + revogação (atualmente token único de 8h)
- Logs estruturados (Serilog) + métricas (OpenTelemetry)
