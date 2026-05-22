<#
.SYNOPSIS
  Deploy local completo do Estúdio AEC (localhost) para testes.

.DESCRIPTION
  - Sincroniza web/.env.local a partir de defaults locais + scripts/deploy/secrets.local.env
  - Sobe PostgreSQL + pgvector (Docker)
  - npm install, Prisma migrate + seed
  - Opcional: RAG reindex, build de produção, servidor dev

.EXAMPLE
  .\scripts\deploy-local.ps1

.EXAMPLE
  .\scripts\deploy-local.ps1 -ProductionBuild -SkipDev
#>
[CmdletBinding()]
param(
    [string]$SecretsFile,
    [switch]$SkipDocker,
    [switch]$SkipInstall,
    [switch]$SkipMigrate,
    [switch]$SkipSeed,
    [switch]$SkipReindex,
    [switch]$SkipDev,
    [switch]$ProductionBuild,
    [switch]$OnlyEnv
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\deploy\Deploy-Common.ps1"

$RepoRoot = Get-StudioAecRoot
$WebDir = Join-Path $RepoRoot 'web'
$EnvLocal = Join-Path $WebDir '.env.local'
$ExampleEnv = Join-Path $RepoRoot '.env.example'

Write-Host ''
Write-Host '========================================' -ForegroundColor Magenta
Write-Host ' Estudio AEC - Deploy LOCAL (testes)' -ForegroundColor Magenta
Write-Host '========================================' -ForegroundColor Magenta

Test-DeployPrerequisites -RequireDocker:(-not $SkipDocker)

$secretsPath = Resolve-SecretsPath -ExplicitPath $SecretsFile -RepoRoot $RepoRoot
$secrets = Import-SecretsHashtable -Path $secretsPath
if (-not $secretsPath) {
    Write-DeployWarn 'No secrets file found. Copy scripts/deploy/secrets.local.env.example to scripts/deploy/secrets.local.env'
}

if (-not (Test-Path $EnvLocal) -and (Test-Path $ExampleEnv)) {
    Copy-Item $ExampleEnv $EnvLocal
    Write-DeployOk "Created $EnvLocal from .env.example"
}

$defaults = Get-LocalEnvDefaults
$merged = Merge-EnvFile -TargetPath $EnvLocal -Defaults $defaults -Secrets $secrets -OnlyFillMissing
Show-EnvHealthReport -Env $merged

if ($OnlyEnv) {
    Write-DeployOk 'Environment sync only (-OnlyEnv). Exiting.'
    exit 0
}

if (-not $SkipDocker) {
    Write-DeployStep 'Starting PostgreSQL + pgvector (Docker)'
    Push-Location $WebDir
    try {
        Invoke-CheckedCommand -Label 'docker compose up' -WorkingDirectory $WebDir `
            -FilePath 'docker' -ArgumentList @('compose', '-f', 'docker-compose.db.yml', 'up', '-d')
        Wait-PostgresDocker
        Write-DeployOk 'Database container ready (localhost:5432)'
    } finally {
        Pop-Location
    }
}

if (-not $SkipInstall) {
    Push-Location $WebDir
    try {
        Invoke-CheckedCommand -Label 'npm install' -WorkingDirectory $WebDir `
            -FilePath 'npm' -ArgumentList @('install')
    } finally {
        Pop-Location
    }
}

Push-Location $WebDir
try {
    Invoke-CheckedCommand -Label 'prisma generate' -WorkingDirectory $WebDir `
        -FilePath 'npm' -ArgumentList @('run', 'db:generate')

    if (-not $SkipMigrate) {
        Invoke-CheckedCommand -Label 'prisma migrate deploy' -WorkingDirectory $WebDir `
            -FilePath 'npm' -ArgumentList @('run', 'db:migrate')
    }

    if (-not $SkipSeed) {
        Invoke-CheckedCommand -Label 'prisma seed' -WorkingDirectory $WebDir `
            -FilePath 'npm' -ArgumentList @('run', 'db:seed')
    }

    if (-not $SkipReindex -and $merged['OPENAI_API_KEY'] -and -not (Is-PlaceholderValue $merged['OPENAI_API_KEY'])) {
        Invoke-CheckedCommand -Label 'RAG reindex (OpenAI embeddings)' -WorkingDirectory $WebDir `
            -FilePath 'npm' -ArgumentList @('run', 'rag:reindex')
    } elseif (-not $SkipReindex) {
        Write-DeployWarn 'Skipped rag:reindex - OPENAI_API_KEY not configured'
    }

    if ($ProductionBuild) {
        Invoke-CheckedCommand -Label 'next build (production)' -WorkingDirectory $WebDir `
            -FilePath 'npm' -ArgumentList @('run', 'build')
        if (-not $SkipDev) {
            Write-DeployStep 'Starting production server (next start)'
            Write-Host '    http://localhost:3000' -ForegroundColor Green
            npm run start
        }
    } elseif (-not $SkipDev) {
        Write-DeployStep 'Starting dev server (next dev)'
        Write-Host ''
        Write-Host '  App:     http://localhost:3000' -ForegroundColor Green
        Write-Host '  Health:  http://localhost:3000/api/health' -ForegroundColor Green
        Write-Host '  Sign-in: http://localhost:3000/sign-in' -ForegroundColor Green
        Write-Host ''
        Write-Host '  Stripe webhook (optional, another terminal):' -ForegroundColor Yellow
        Write-Host '    stripe listen --forward-to localhost:3000/api/webhooks/stripe' -ForegroundColor Yellow
        Write-Host '    Then update STRIPE_WEBHOOK_SECRET in secrets.local.env and re-run -OnlyEnv' -ForegroundColor Yellow
        Write-Host ''
        npm run dev
    }
} finally {
    Pop-Location
}

Show-PostDeployChecklist -BaseUrl 'http://localhost:3000'
