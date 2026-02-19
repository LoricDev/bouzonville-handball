# ==============================================================================
# 🚀 Script de déploiement - Bouzonville Handball → o2switch
# ==============================================================================
# Usage : .\deploy.ps1
# Pré-requis : Node.js, npm, ssh/scp accessibles dans le PATH
# ==============================================================================

param(
    [switch]$SkipBuild,      # Passer le build si déjà fait : .\deploy.ps1 -SkipBuild
    [switch]$SkipUpload,     # Préparer sans uploader       : .\deploy.ps1 -SkipUpload
    [switch]$FirstDeploy     # Premier déploiement (Prisma)  : .\deploy.ps1 -FirstDeploy
)

# ── CONFIGURATION ─────────────────────────────────────────────────────────────
# ⚠️  MODIFIE CES VALEURS avec tes infos o2switch

$SSH_USER       = "ton-utilisateur-o2switch"          # Ex: "abcd1234"
$SSH_HOST       = "ton-serveur.o2switch.net"           # Ex: "myaccount.o2switch.net"
$SSH_PORT       = 22                                    # Port SSH (22 par défaut)
$REMOTE_APP_DIR = "~/bouzonville-handball"              # Dossier de l'app sur o2switch
$NODE_VERSION   = "20"                                  # Version Node.js sur o2switch

# ── VARIABLES LOCALES ─────────────────────────────────────────────────────────

$PROJECT_ROOT   = $PSScriptRoot
$BUILD_DIR      = "$PROJECT_ROOT\.next"
$STANDALONE_DIR = "$BUILD_DIR\standalone"
$STATIC_DIR     = "$BUILD_DIR\static"
$DEPLOY_DIR     = "$PROJECT_ROOT\.deploy"

# ── FONCTIONS UTILITAIRES ────────────────────────────────────────────────────

function Write-Step($step, $message) {
    Write-Host ""
    Write-Host "[$step] $message" -ForegroundColor Cyan
    Write-Host ("─" * 60) -ForegroundColor DarkGray
}

function Write-Success($message) {
    Write-Host "  ✅ $message" -ForegroundColor Green
}

function Write-Warning($message) {
    Write-Host "  ⚠️  $message" -ForegroundColor Yellow
}

function Write-Error($message) {
    Write-Host "  ❌ $message" -ForegroundColor Red
}

function Test-CommandExists($command) {
    $null -ne (Get-Command $command -ErrorAction SilentlyContinue)
}

# ── VÉRIFICATIONS ─────────────────────────────────────────────────────────────

Write-Host ""
Write-Host "🏐 Bouzonville Handball - Déploiement o2switch" -ForegroundColor Magenta
Write-Host ("═" * 60) -ForegroundColor Magenta

# Vérifier les outils nécessaires
Write-Step "0" "Vérifications préalables"

if (-not (Test-CommandExists "node")) {
    Write-Error "Node.js n'est pas installé ou pas dans le PATH"
    exit 1
}
Write-Success "Node.js $(node --version)"

if (-not (Test-CommandExists "npm")) {
    Write-Error "npm n'est pas installé ou pas dans le PATH"
    exit 1
}
Write-Success "npm $(npm --version)"

if (-not (Test-CommandExists "scp")) {
    Write-Warning "scp non trouvé. L'upload sera désactivé."
    Write-Warning "Installe OpenSSH ou utilise Git Bash pour scp/ssh."
    $SkipUpload = $true
}

# Vérifier le fichier .env
if (-not (Test-Path "$PROJECT_ROOT\.env")) {
    Write-Warning "Fichier .env non trouvé ! Copie .env.example en .env et remplis les valeurs."
}

# ── ÉTAPE 1 : BUILD ──────────────────────────────────────────────────────────

if (-not $SkipBuild) {
    Write-Step "1" "Build de l'application Next.js"

    Push-Location $PROJECT_ROOT

    Write-Host "  → npm install..." -ForegroundColor Gray
    npm install 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "npm install a échoué"
        Pop-Location
        exit 1
    }
    Write-Success "Dépendances installées"

    Write-Host "  → npx prisma generate..." -ForegroundColor Gray
    npx prisma generate 2>&1 | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Prisma generate a échoué"
        Pop-Location
        exit 1
    }
    Write-Success "Client Prisma généré"

    Write-Host "  → next build (standalone)..." -ForegroundColor Gray
    npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Le build a échoué !"
        Pop-Location
        exit 1
    }
    Write-Success "Build terminé avec succès"

    Pop-Location
} else {
    Write-Step "1" "Build ignoré (-SkipBuild)"
    if (-not (Test-Path $STANDALONE_DIR)) {
        Write-Error "Aucun build standalone trouvé dans $STANDALONE_DIR"
        Write-Error "Lance d'abord : .\deploy.ps1 (sans -SkipBuild)"
        exit 1
    }
}

# ── ÉTAPE 2 : PRÉPARER LE DOSSIER DE DÉPLOIEMENT ────────────────────────────

Write-Step "2" "Préparation du dossier de déploiement"

# Nettoyer l'ancien dossier de déploiement
if (Test-Path $DEPLOY_DIR) {
    Remove-Item -Recurse -Force $DEPLOY_DIR
}
New-Item -ItemType Directory -Path $DEPLOY_DIR | Out-Null

# Copier le standalone (server.js + node_modules + .next compilé)
Write-Host "  → Copie du standalone..." -ForegroundColor Gray
Copy-Item -Recurse "$STANDALONE_DIR\*" -Destination $DEPLOY_DIR
Write-Success "Standalone copié"

# Copier les fichiers statiques dans .next/static
Write-Host "  → Copie des fichiers statiques..." -ForegroundColor Gray
if (Test-Path $STATIC_DIR) {
    $destStatic = "$DEPLOY_DIR\.next\static"
    if (-not (Test-Path $destStatic)) {
        New-Item -ItemType Directory -Path $destStatic -Force | Out-Null
    }
    Copy-Item -Recurse "$STATIC_DIR\*" -Destination $destStatic
    Write-Success "Fichiers statiques copiés"
} else {
    Write-Warning "Dossier .next/static non trouvé"
}

# Copier le dossier public
Write-Host "  → Copie du dossier public..." -ForegroundColor Gray
if (Test-Path "$PROJECT_ROOT\public") {
    Copy-Item -Recurse "$PROJECT_ROOT\public" -Destination "$DEPLOY_DIR\public"
    Write-Success "Dossier public copié"
} else {
    Write-Warning "Dossier public non trouvé"
}

# Copier prisma (pour les migrations sur le serveur)
Write-Host "  → Copie du schéma Prisma..." -ForegroundColor Gray
if (Test-Path "$PROJECT_ROOT\prisma") {
    Copy-Item -Recurse "$PROJECT_ROOT\prisma" -Destination "$DEPLOY_DIR\prisma"
    Write-Success "Schéma Prisma copié"
}

# Copier le .env
if (Test-Path "$PROJECT_ROOT\.env") {
    Copy-Item "$PROJECT_ROOT\.env" -Destination "$DEPLOY_DIR\.env"
    Write-Success ".env copié"
} else {
    Write-Warning ".env non trouvé — pense à le créer sur le serveur !"
}

# Copier le package.json (pour prisma sur le serveur)
Copy-Item "$PROJECT_ROOT\package.json" -Destination "$DEPLOY_DIR\package.json"
Write-Success "package.json copié"

# Taille du dossier
$deploySize = (Get-ChildItem -Recurse $DEPLOY_DIR | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Success ("Dossier de déploiement prêt ({0:N1} MB)" -f $deploySize)

# ── ÉTAPE 3 : UPLOAD SUR O2SWITCH ────────────────────────────────────────────

if (-not $SkipUpload) {
    Write-Step "3" "Upload vers o2switch ($SSH_USER@$SSH_HOST)"

    # Vérifier que la config SSH est renseignée
    if ($SSH_USER -eq "ton-utilisateur-o2switch") {
        Write-Error "Configure d'abord les variables SSH en haut du script !"
        Write-Warning "Modifie SSH_USER, SSH_HOST et REMOTE_APP_DIR dans deploy.ps1"
        Write-Host ""
        Write-Host "  Le dossier de déploiement est prêt dans : .deploy/" -ForegroundColor Yellow
        Write-Host "  Tu peux l'uploader manuellement via FileZilla." -ForegroundColor Yellow
        exit 1
    }

    Write-Host "  → Création du dossier distant..." -ForegroundColor Gray
    ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" "mkdir -p $REMOTE_APP_DIR"

    Write-Host "  → Upload des fichiers (cela peut prendre quelques minutes)..." -ForegroundColor Gray
    scp -r -P $SSH_PORT "$DEPLOY_DIR\*" "${SSH_USER}@${SSH_HOST}:${REMOTE_APP_DIR}/"

    if ($LASTEXITCODE -ne 0) {
        Write-Error "L'upload a échoué"
        Write-Warning "Vérifie tes identifiants SSH et la connexion"
        exit 1
    }
    Write-Success "Upload terminé"

    # ── ÉTAPE 4 : COMMANDES POST-DÉPLOIEMENT ─────────────────────────────────

    Write-Step "4" "Configuration sur le serveur"

    if ($FirstDeploy) {
        Write-Host "  → Premier déploiement : installation de Prisma + migration..." -ForegroundColor Gray
        ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" @"
cd $REMOTE_APP_DIR
export PATH=/opt/alt/alt-nodejs$NODE_VERSION/root/usr/bin:`$PATH
npm install prisma @prisma/client --save
npx prisma generate
npx prisma db push
echo '✅ Prisma configuré'
"@
    } else {
        Write-Host "  → Regénération du client Prisma..." -ForegroundColor Gray
        ssh -p $SSH_PORT "$SSH_USER@$SSH_HOST" @"
cd $REMOTE_APP_DIR
export PATH=/opt/alt/alt-nodejs$NODE_VERSION/root/usr/bin:`$PATH
npx prisma generate
echo '✅ Client Prisma regénéré'
"@
    }

    Write-Success "Configuration serveur terminée"

    # ── ÉTAPE 5 : REDÉMARRAGE ─────────────────────────────────────────────────

    Write-Step "5" "Redémarrage de l'application"
    Write-Warning "⚡ Redémarre l'application manuellement :"
    Write-Host ""
    Write-Host "  1. Va dans cPanel → Setup Node.js App" -ForegroundColor White
    Write-Host "  2. Clique sur le bouton 'Restart' de ton application" -ForegroundColor White
    Write-Host ""
    Write-Host "  Ou via SSH :" -ForegroundColor Gray
    Write-Host "  ssh $SSH_USER@$SSH_HOST" -ForegroundColor Gray
    Write-Host "  cd $REMOTE_APP_DIR && touch tmp/restart.txt" -ForegroundColor Gray

} else {
    Write-Step "3" "Upload ignoré (-SkipUpload)"
    Write-Host ""
    Write-Host "  📁 Le dossier de déploiement est prêt dans :" -ForegroundColor Yellow
    Write-Host "     $DEPLOY_DIR" -ForegroundColor White
    Write-Host ""
    Write-Host "  Tu peux l'uploader manuellement via FileZilla/WinSCP" -ForegroundColor Yellow
    Write-Host "  vers le dossier : $REMOTE_APP_DIR" -ForegroundColor Yellow
}

# ── TERMINÉ ───────────────────────────────────────────────────────────────────

Write-Host ""
Write-Host ("═" * 60) -ForegroundColor Magenta
Write-Host "🎉 Déploiement terminé !" -ForegroundColor Green
Write-Host ("═" * 60) -ForegroundColor Magenta
Write-Host ""
