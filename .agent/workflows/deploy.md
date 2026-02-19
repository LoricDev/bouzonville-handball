---
description: Comment déployer l'application Next.js sur o2switch
---

# 🚀 Déploiement sur o2switch

## Pré-requis (une seule fois)

### 1. Configurer le script de déploiement

Ouvre `deploy.ps1` à la racine du projet et modifie les variables de configuration :

```powershell
$SSH_USER       = "ton-utilisateur-o2switch"
$SSH_HOST       = "ton-serveur.o2switch.net"
$REMOTE_APP_DIR = "~/bouzonville-handball"
```

### 2. Configurer le `.env`

Copie `.env.example` en `.env` et remplis avec les vraies valeurs :

```bash
cp .env.example .env
```

### 3. Configurer Node.js dans cPanel

1. cPanel → **Setup Node.js App** → **Create Application**
2. Node.js version : **20.x**
3. Application mode : **Production**
4. Application root : `bouzonville-handball`
5. Application startup file : `server.js`

### 4. Créer la base de données PostgreSQL

1. cPanel → **PostgreSQL Databases**
2. Créer la base, un utilisateur, et l'associer
3. Mettre l'URL dans le `.env` : `DATABASE_URL="postgresql://USER:PASS@localhost:5432/DB_NAME"`

### 5. Configurer Google OAuth

Dans la [Google Cloud Console](https://console.cloud.google.com/apis/credentials) :

- Origines JS autorisées : `https://tondomaine.com`
- URI de redirection : `https://tondomaine.com/api/auth/callback/google`

---

## Premier déploiement

// turbo

```powershell
.\deploy.ps1 -FirstDeploy
```

Cela va :

1. ✅ Build le projet (Next.js standalone)
2. ✅ Préparer la structure de fichiers dans `.deploy/`
3. ✅ Uploader sur o2switch via SCP
4. ✅ Installer Prisma + pousser le schéma BDD

Puis dans cPanel → Setup Node.js App → **Start** l'application.

---

## Déploiements suivants (mises à jour)

// turbo

```powershell
.\deploy.ps1
```

Puis dans cPanel → Setup Node.js App → **Restart** l'application.

---

## Options du script

| Flag           | Description                                                                     |
| -------------- | ------------------------------------------------------------------------------- |
| `-SkipBuild`   | Sauter le build si déjà fait                                                    |
| `-SkipUpload`  | Préparer le dossier `.deploy/` sans uploader (pour upload manuel via FileZilla) |
| `-FirstDeploy` | Premier déploiement : installe Prisma et pousse le schéma BDD                   |

### Exemples

```powershell
# Déploiement complet
.\deploy.ps1

# Premier déploiement (avec setup BDD)
.\deploy.ps1 -FirstDeploy

# Juste préparer les fichiers (upload manuel)
.\deploy.ps1 -SkipUpload

# Re-uploader sans rebuild
.\deploy.ps1 -SkipBuild
```

---

## Dossier `.deploy/`

Le script crée un dossier `.deploy/` contenant la structure prête à uploader :

```
.deploy/
├── server.js           ← Point d'entrée Next.js
├── node_modules/       ← Dépendances (standalone)
├── package.json
├── .env
├── prisma/
│   └── schema.prisma
├── public/
│   └── images/...
└── .next/
    └── static/         ← Assets CSS/JS compilés
```

---

## Dépannage

### L'app ne démarre pas

- Vérifie les logs dans cPanel → Setup Node.js App → **Log**
- Vérifie que `server.js` est bien le startup file
- Vérifie que le `.env` est présent sur le serveur

### Erreur de base de données

- Vérifie `DATABASE_URL` dans le `.env`
- Lance `npx prisma db push` via SSH

### Erreur NextAuth

- Vérifie `AUTH_SECRET` et `AUTH_URL` dans le `.env`
- Vérifie les URLs OAuth dans Google Cloud Console
