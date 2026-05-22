# Shared helpers for StudioAEC deploy scripts (local + production).
#Requires -Version 5.1

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-StudioAecRoot {
    $root = $PSScriptRoot
    while ($root -and -not (Test-Path (Join-Path $root 'web\package.json'))) {
        $parent = Split-Path $root -Parent
        if ($parent -eq $root) { break }
        $root = $parent
    }
    if (-not (Test-Path (Join-Path $root 'web\package.json'))) {
        throw 'Could not locate repository root (expected web\package.json).'
    }
    return $root
}

function Write-DeployStep([string]$Message) {
    Write-Host ''
    Write-Host "==> $Message" -ForegroundColor Cyan
}

function Write-DeployOk([string]$Message) {
    Write-Host "    OK: $Message" -ForegroundColor Green
}

function Write-DeployWarn([string]$Message) {
    Write-Host "    WARN: $Message" -ForegroundColor Yellow
}

function Write-DeployErr([string]$Message) {
    Write-Host "    ERROR: $Message" -ForegroundColor Red
}

function Test-CommandExists([string]$Name) {
    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Invoke-CheckedCommand {
    param(
        [string]$Label,
        [string]$WorkingDirectory,
        [string]$FilePath,
        [string[]]$ArgumentList
    )
    Write-DeployStep $Label
    & $FilePath @ArgumentList
    if ($LASTEXITCODE -ne 0) {
        throw "Command failed ($Label): $FilePath $($ArgumentList -join ' ')"
    }
}

function Read-EnvDictionary {
    param([string]$Path)
    $dict = @{}
    if (-not (Test-Path $Path)) { return $dict }
    Get-Content $Path -Encoding UTF8 | ForEach-Object {
        $line = $_.Trim()
        if (-not $line -or $line.StartsWith('#')) { return }
        $idx = $line.IndexOf('=')
        if ($idx -lt 1) { return }
        $key = $line.Substring(0, $idx).Trim()
        $value = $line.Substring($idx + 1).Trim()
        if ($value.StartsWith('"') -and $value.EndsWith('"')) {
            $value = $value.Substring(1, $value.Length - 2)
        }
        $dict[$key] = $value
    }
    return $dict
}

function Is-PlaceholderValue([string]$Value) {
    if ([string]::IsNullOrWhiteSpace($Value)) { return $true }
    $placeholders = @(
        'pk_test_...', 'sk_test_...', 'rk_test_...', 'whsec_...',
        'postgresql://user:password@', 'mude-esta-chave', '...'
    )
    foreach ($p in $placeholders) {
        if ($Value -like "*$p*") { return $true }
    }
    return $false
}

function Merge-EnvFile {
    param(
        [string]$TargetPath,
        [hashtable]$Defaults,
        [hashtable]$Secrets,
        [switch]$OnlyFillMissing
    )

    $existing = Read-EnvDictionary -Path $TargetPath
    $merged = @{}
    foreach ($k in $Defaults.Keys) { $merged[$k] = $Defaults[$k] }
    foreach ($k in $existing.Keys) {
        if (-not (Is-PlaceholderValue $existing[$k])) {
            $merged[$k] = $existing[$k]
        }
    }
    foreach ($k in $Secrets.Keys) {
        if ([string]::IsNullOrWhiteSpace($Secrets[$k])) { continue }
        if ($OnlyFillMissing -and $merged.ContainsKey($k) -and -not (Is-PlaceholderValue $merged[$k])) {
            continue
        }
        $merged[$k] = $Secrets[$k]
    }

    $lines = @(
        '# Generated/updated by StudioAEC deploy script - do not commit',
        "# $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')",
        ''
    )
    $order = @(
        'DATABASE_URL',
        'NEXT_PUBLIC_CLERK_SIGN_IN_URL',
        'NEXT_PUBLIC_CLERK_SIGN_UP_URL',
        'NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL',
        'NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL',
        'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
        'CLERK_SECRET_KEY',
        'CLERK_WEBHOOK_SECRET',
        'CLERK_ADMIN_USER_IDS',
        'CLERK_ADMIN_USERNAMES',
        'CLERK_ADMIN_USER_ID',
        'CLERK_ADMIN_EMAIL',
        'CLERK_ADMIN_NAME',
        'NEXT_PUBLIC_APP_URL',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        'STRIPE_RESTRICTED_KEY',
        'STRIPE_SECRET_KEY',
        'STRIPE_WEBHOOK_SECRET',
        'OPENAI_API_KEY',
        'OPENAI_EMBEDDING_MODEL',
        'OPENAI_CHAT_MODEL',
        'AWS_ACCESS_KEY_ID',
        'AWS_SECRET_ACCESS_KEY',
        'AWS_REGION',
        'S3_BUCKET',
        'S3_LIBRARY_PREFIX',
        'S3_PRESIGN_EXPIRES_SECONDS',
        'AI_GATEWAY_API_KEY',
        'PRISMA_SERVICE_TOKEN'
    )
    $written = @{}
    foreach ($key in $order) {
        if ($merged.ContainsKey($key) -and $merged[$key]) {
            $lines += "$key=$($merged[$key])"
            $written[$key] = $true
        }
    }
    foreach ($key in ($merged.Keys | Sort-Object)) {
        if (-not $written[$key] -and $merged[$key]) {
            $lines += "$key=$($merged[$key])"
        }
    }

    $dir = Split-Path $TargetPath -Parent
    if ($dir -and -not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    Set-Content -Path $TargetPath -Value ($lines -join "`n") -Encoding UTF8
    return $merged
}

function Get-LocalEnvDefaults {
    return @{
        DATABASE_URL = 'postgresql://studioaec:studioaec@localhost:5432/studioaec?schema=public'
        NEXT_PUBLIC_CLERK_SIGN_IN_URL = '/sign-in'
        NEXT_PUBLIC_CLERK_SIGN_UP_URL = '/sign-up'
        NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL = '/dashboard'
        NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL = '/dashboard'
        NEXT_PUBLIC_APP_URL = 'http://localhost:3000'
        OPENAI_EMBEDDING_MODEL = 'text-embedding-3-small'
        OPENAI_CHAT_MODEL = 'gpt-4o-mini'
        AWS_REGION = 'sa-east-1'
        S3_LIBRARY_PREFIX = 'library'
        S3_PRESIGN_EXPIRES_SECONDS = '300'
    }
}

function Get-ProductionEnvDefaults {
    param([string]$AppUrl)
    if ([string]::IsNullOrWhiteSpace($AppUrl)) {
        throw 'ProductionUrl is required for production deploy (e.g. https://app.estudioaec.com.br).'
    }
    $url = $AppUrl.TrimEnd('/')
    return @{
        NEXT_PUBLIC_CLERK_SIGN_IN_URL = '/sign-in'
        NEXT_PUBLIC_CLERK_SIGN_UP_URL = '/sign-up'
        NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL = '/dashboard'
        NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL = '/dashboard'
        NEXT_PUBLIC_APP_URL = $url
        OPENAI_EMBEDDING_MODEL = 'text-embedding-3-small'
        OPENAI_CHAT_MODEL = 'gpt-4o-mini'
        AWS_REGION = 'sa-east-1'
        S3_LIBRARY_PREFIX = 'library'
        S3_PRESIGN_EXPIRES_SECONDS = '300'
    }
}

function Resolve-SecretsPath {
    param([string]$ExplicitPath, [string]$RepoRoot)
    if ($ExplicitPath) {
        if (-not (Test-Path $ExplicitPath)) { throw "Secrets file not found: $ExplicitPath" }
        return (Resolve-Path $ExplicitPath).Path
    }
    $candidates = @(
        (Join-Path $RepoRoot 'scripts\deploy\secrets.local.env'),
        (Join-Path $RepoRoot 'scripts\deploy\secrets.production.env')
    )
    foreach ($c in $candidates) {
        if (Test-Path $c) { return $c }
    }
    return $null
}

function Import-SecretsHashtable {
    param([string]$Path)
    if (-not $Path) { return @{} }
    $dict = Read-EnvDictionary -Path $Path
    $ht = @{}
    foreach ($k in $dict.Keys) { $ht[$k] = $dict[$k] }
    return $ht
}

function Test-DeployPrerequisites {
    param(
        [switch]$RequireDocker,
        [switch]$RequireVercel
    )
    $missing = @()
    if (-not (Test-CommandExists 'node')) { $missing += 'Node.js (node)' }
    if (-not (Test-CommandExists 'npm')) { $missing += 'npm' }
    if ($RequireDocker -and -not (Test-CommandExists 'docker')) { $missing += 'Docker' }
    if ($RequireVercel -and -not (Test-CommandExists 'vercel')) { $missing += 'Vercel CLI (npm i -g vercel)' }
    if ($missing.Count -gt 0) {
        throw "Missing prerequisites: $($missing -join ', ')"
    }
}

function Wait-PostgresDocker {
    param([int]$MaxSeconds = 90)
    $deadline = (Get-Date).AddSeconds($MaxSeconds)
    while ((Get-Date) -lt $deadline) {
        docker exec studioaec-db pg_isready -U studioaec -d studioaec 2>$null | Out-Null
        if ($LASTEXITCODE -eq 0) { return }
        Start-Sleep -Seconds 2
    }
    throw 'PostgreSQL container did not become ready in time (studioaec-db).'
}

function Show-EnvHealthReport {
    param([hashtable]$Env)
    $checks = @(
        @{ Key = 'DATABASE_URL'; Label = 'PostgreSQL' },
        @{ Key = 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY'; Label = 'Clerk (public)' },
        @{ Key = 'CLERK_SECRET_KEY'; Label = 'Clerk (secret)' },
        @{ Key = 'CLERK_WEBHOOK_SECRET'; Label = 'Clerk webhook' },
        @{ Key = 'STRIPE_RESTRICTED_KEY'; Label = 'Stripe RAK' },
        @{ Key = 'STRIPE_SECRET_KEY'; Label = 'Stripe secret (fallback)' },
        @{ Key = 'STRIPE_WEBHOOK_SECRET'; Label = 'Stripe webhook' },
        @{ Key = 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'; Label = 'Stripe (public)' },
        @{ Key = 'OPENAI_API_KEY'; Label = 'OpenAI (tutor RAG)' },
        @{ Key = 'AWS_ACCESS_KEY_ID'; Label = 'AWS S3' }
    )
    Write-DeployStep 'Environment checklist'
    foreach ($c in $checks) {
        $val = $Env[$c.Key]
        $ok = -not (Is-PlaceholderValue $val)
        if ($c.Key -eq 'STRIPE_SECRET_KEY' -and $ok) { continue }
        if ($c.Key -eq 'STRIPE_SECRET_KEY' -and $Env['STRIPE_RESTRICTED_KEY'] -and -not (Is-PlaceholderValue $Env['STRIPE_RESTRICTED_KEY'])) {
            Write-DeployOk "$($c.Label) (via STRIPE_RESTRICTED_KEY)"
            continue
        }
        if ($ok) { Write-DeployOk $c.Label } else { Write-DeployWarn "$($c.Label) - not set or placeholder" }
    }
}

function Push-VercelEnvFromHashtable {
    param(
        [string]$WebDir,
        [hashtable]$Env,
        [ValidateSet('production', 'preview', 'development')]
        [string]$Target = 'production'
    )
    if (-not (Test-CommandExists 'vercel')) {
        throw 'Vercel CLI is required. Install: npm install -g vercel'
    }
    Write-DeployStep "Syncing Vercel environment variables ($Target)"
    Push-Location $WebDir
    try {
        foreach ($key in ($Env.Keys | Sort-Object)) {
            if ($key -like 'VERCEL*') { continue }
            $value = $Env[$key]
            if ([string]::IsNullOrWhiteSpace($value) -or (Is-PlaceholderValue $value)) { continue }
            vercel env rm $key $Target --yes 2>$null | Out-Null
            $value | vercel env add $key $Target 2>&1 | Out-Null
            if ($LASTEXITCODE -ne 0) {
                Write-DeployWarn "Could not set Vercel env: $key (set manually in dashboard)"
            } else {
                Write-Host "    set $key" -ForegroundColor DarkGray
            }
        }
    } finally {
        Pop-Location
    }
}

function Show-PostDeployChecklist {
    param([string]$BaseUrl)
    Write-Host ''
    Write-Host 'Post-deploy checklist:' -ForegroundColor Cyan
    Write-Host "  - Health: $BaseUrl/api/health (database: connected)"
    Write-Host "  - Sign-in: $BaseUrl/sign-in"
    Write-Host "  - Clerk webhook: $BaseUrl/api/webhooks/clerk"
    Write-Host "  - Stripe webhook: $BaseUrl/api/webhooks/stripe"
    Write-Host '  - Admin: /admin/planejamento (role admin no Clerk)'
    Write-Host '  - Optional: npm run rag:reindex (with production DATABASE_URL)'
}
