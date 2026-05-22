<#
.SYNOPSIS
  Deploy oficial do Estúdio AEC para usuários finais (Vercel + produção).

.DESCRIPTION
  - Valida segredos de produção (scripts/deploy/secrets.production.env ou -SecretsFile)
  - Sincroniza variáveis na Vercel (production)
  - Executa vercel deploy --prod (Root Directory deve ser web/ no projeto)
  - Migrações rodam no build via vercel.json (prisma migrate deploy)

.PARAMETER ProductionUrl
  URL pública (ex. https://www.estudioaec.com.br) — define NEXT_PUBLIC_APP_URL e webhooks.

.EXAMPLE
  .\scripts\deploy-production.ps1 -ProductionUrl https://www.estudioaec.com.br

.EXAMPLE
  .\scripts\deploy-production.ps1 -ProductionUrl https://app.example.com -DryRun
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [string]$ProductionUrl,
    [string]$SecretsFile,
    [switch]$SkipVercelEnvSync,
    [switch]$SkipDeploy,
    [switch]$RunPostDeployJobs,
    [switch]$DryRun
)

$ErrorActionPreference = 'Stop'
. "$PSScriptRoot\deploy\Deploy-Common.ps1"

$RepoRoot = Get-StudioAecRoot
$WebDir = Join-Path $RepoRoot 'web'
$ProdSecretsDefault = Join-Path $RepoRoot 'scripts\deploy\secrets.production.env'

Write-Host ''
Write-Host '========================================' -ForegroundColor Magenta
Write-Host ' Estudio AEC - Deploy PRODUCAO (Vercel)' -ForegroundColor Magenta
Write-Host '========================================' -ForegroundColor Magenta

Test-DeployPrerequisites -RequireVercel

$secretsPath = if ($SecretsFile) { $SecretsFile } elseif (Test-Path $ProdSecretsDefault) { $ProdSecretsDefault } else { $null }
if (-not $secretsPath) {
    throw @"
Production secrets file not found.
Create: scripts\deploy\secrets.production.env
(from scripts\deploy\secrets.local.env.example)
Required: DATABASE_URL (Neon + pgvector), Clerk, Stripe, OPENAI_API_KEY, AWS S3.
"@
}
$secretsPath = (Resolve-Path $secretsPath).Path
$secrets = Import-SecretsHashtable -Path $secretsPath

$defaults = Get-ProductionEnvDefaults -AppUrl $ProductionUrl
$prodEnvPreview = Merge-EnvFile -TargetPath (Join-Path $WebDir '.env.production.local') `
    -Defaults $defaults -Secrets $secrets
Show-EnvHealthReport -Env $prodEnvPreview

$requiredProd = @('DATABASE_URL', 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY', 'CLERK_SECRET_KEY', 'NEXT_PUBLIC_APP_URL')
$missingRequired = @()
foreach ($k in $requiredProd) {
    if (-not $prodEnvPreview[$k] -or (Is-PlaceholderValue $prodEnvPreview[$k])) {
        $missingRequired += $k
    }
}
if ($missingRequired.Count -gt 0) {
    throw "Missing required production variables: $($missingRequired -join ', ')"
}

if ($DryRun) {
    Write-DeployOk 'Dry run - env validated. No Vercel deploy executed.'
    Show-PostDeployChecklist -BaseUrl $ProductionUrl.TrimEnd('/')
    exit 0
}

Push-Location $WebDir
try {
    if (-not (Test-Path (Join-Path $WebDir '.vercel\project.json'))) {
        Write-DeployStep 'Linking Vercel project (first time)'
        Write-Host '    Follow prompts: set Root Directory to web if asked at repo root.' -ForegroundColor Yellow
        vercel link
        if ($LASTEXITCODE -ne 0) { throw 'vercel link failed' }
    }

    if (-not $SkipVercelEnvSync) {
        Push-VercelEnvFromHashtable -WebDir $WebDir -Env $prodEnvPreview -Target 'production'
        Push-VercelEnvFromHashtable -WebDir $WebDir -Env $prodEnvPreview -Target 'preview'
    }

    if (-not $SkipDeploy) {
        Write-DeployStep 'Deploying to Vercel (production)'
        vercel deploy --prod --yes
        if ($LASTEXITCODE -ne 0) { throw 'vercel deploy --prod failed' }
        Write-DeployOk 'Production deployment triggered'
    }

    if ($RunPostDeployJobs) {
        Write-DeployWarn 'Running post-deploy jobs against DATABASE_URL in secrets - PRODUCTION DATA'
        $confirm = Read-Host 'Type YES to run db:seed and rag:reindex on production DB'
        if ($confirm -ne 'YES') {
            Write-DeployWarn 'Skipped post-deploy jobs'
        } else {
            $env:DATABASE_URL = $prodEnvPreview['DATABASE_URL']
            foreach ($k in @('OPENAI_API_KEY', 'OPENAI_EMBEDDING_MODEL', 'OPENAI_CHAT_MODEL')) {
                if ($prodEnvPreview[$k]) { Set-Item -Path "env:$k" -Value $prodEnvPreview[$k] }
            }
            npm run db:seed
            if ($LASTEXITCODE -ne 0) { throw 'db:seed failed' }
            npm run rag:reindex
            if ($LASTEXITCODE -ne 0) { throw 'rag:reindex failed' }
            Write-DeployOk 'Post-deploy seed + RAG reindex completed'
        }
    }
} finally {
    Pop-Location
}

$base = $ProductionUrl.TrimEnd('/')
Show-PostDeployChecklist -BaseUrl $base
Write-Host ''
Write-Host 'Configure webhooks in dashboards:' -ForegroundColor Cyan
Write-Host "  Clerk:  $base/api/webhooks/clerk"
Write-Host "  Stripe: $base/api/webhooks/stripe"
Write-Host ''
Write-Host 'Vercel project: Root Directory = web | Region = gru1 (see web/vercel.json)' -ForegroundColor DarkGray
