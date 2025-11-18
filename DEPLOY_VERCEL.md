# 🚀 Guide de Déploiement sur Vercel

Ce guide vous explique comment déployer votre application (frontend Next.js et backend Express) sur Vercel.

## 📋 Prérequis

- Compte Vercel (gratuit) : https://vercel.com/signup
- Compte Google Cloud avec OAuth configuré
- Git repository (GitHub, GitLab, ou Bitbucket)

## 🏗️ Architecture de Déploiement

```
Frontend (Next.js) → Vercel → https://votre-app.vercel.app
Backend (Express) → Vercel Serverless → https://votre-backend.vercel.app
```

## 📦 Étape 1 : Préparer le Backend

### 1.1 Structure du Backend

Le backend doit être dans le dossier `Backend/` avec :
- ✅ `api/index.js` - Point d'entrée pour Vercel
- ✅ `vercel.json` - Configuration Vercel
- ✅ `package.json` - Dépendances

### 1.2 Variables d'Environnement du Backend

Dans le dashboard Vercel, ajoutez ces variables d'environnement :

```env
# Google OAuth
CLIENT_ID=votre_client_id_google
CLIENT_SECRET=votre_client_secret_google

# Session
SESSION_SECRET=une_chaine_secrete_aleatoire_longue

# URLs (seront définies après déploiement)
FRONTEND_URL=https://votre-frontend.vercel.app
BACKEND_URL=https://votre-backend.vercel.app

# Optionnel : Gemini API pour le chatbot
GEMINI_API_KEY=votre_clé_gemini

# Mode test (optionnel)
USE_MOCK_DATA=false
```

## 📦 Étape 2 : Déployer le Backend

### 2.1 Via Vercel CLI

```bash
cd Backend
npm install -g vercel
vercel login
vercel
```

### 2.2 Via Vercel Dashboard

1. Allez sur https://vercel.com/new
2. Importez votre repository Git
3. **Root Directory** : Sélectionnez `Backend`
4. **Framework Preset** : Autre
5. **Build Command** : (laissez vide)
6. **Output Directory** : (laissez vide)
7. **Install Command** : `npm install`
8. Cliquez sur "Deploy"

### 2.3 Configuration des Variables d'Environnement

Après le déploiement :

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez toutes les variables d'environnement listées ci-dessus
3. **Important** : Après avoir récupéré l'URL du backend, ajoutez :
   - `BACKEND_URL=https://votre-backend.vercel.app`
   - `FRONTEND_URL=https://votre-frontend.vercel.app` (après déploiement du frontend)

4. Redéployez pour que les variables prennent effet

## 📦 Étape 3 : Préparer le Frontend

### 3.1 Variables d'Environnement du Frontend

Dans le dashboard Vercel (projet frontend), ajoutez :

```env
NEXT_PUBLIC_API_URL=https://votre-backend.vercel.app
```

### 3.2 Configuration Next.js

Le fichier `Fontend/my-app/next.config.ts` doit être présent (déjà configuré).

## 📦 Étape 4 : Déployer le Frontend

### 4.1 Via Vercel CLI

```bash
cd Fontend/my-app
vercel
```

### 4.2 Via Vercel Dashboard

1. Allez sur https://vercel.com/new
2. Importez votre repository Git (le même ou un autre)
3. **Root Directory** : Sélectionnez `Fontend/my-app`
4. **Framework Preset** : Next.js (détecté automatiquement)
5. Cliquez sur "Deploy"

### 4.3 Configuration des Variables d'Environnement

1. Allez dans **Settings** → **Environment Variables**
2. Ajoutez :
   ```env
   NEXT_PUBLIC_API_URL=https://votre-backend.vercel.app
   ```
3. Redéployez

## 🔐 Étape 5 : Configurer Google OAuth

### 5.1 Ajouter les URLs de Production

1. Allez dans [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Cliquez sur votre **OAuth 2.0 Client ID**
4. Dans **Authorized redirect URIs**, ajoutez :
   ```
   https://votre-backend.vercel.app/auth/google/callback
   ```
5. Cliquez sur **Save**

### 5.2 Mettre à Jour les Variables d'Environnement

Dans Vercel (backend) :
1. Mettez à jour `FRONTEND_URL` avec l'URL du frontend
2. Mettez à jour `BACKEND_URL` avec l'URL du backend
3. Redéployez

## ✅ Étape 6 : Vérifier le Déploiement

### 6.1 Tester le Backend

```bash
curl https://votre-backend.vercel.app/
# Devrait retourner : <a href="/auth/google/">Authenticate with Google</a>
```

### 6.2 Tester le Frontend

1. Visitez `https://votre-frontend.vercel.app`
2. Cliquez sur "Se connecter"
3. Testez l'authentification Google OAuth

## 🐛 Dépannage

### Problème : CORS Error

**Solution** : Vérifiez que `FRONTEND_URL` est correctement défini dans les variables d'environnement du backend.

### Problème : redirect_uri_mismatch

**Solution** : 
1. Vérifiez que l'URL dans Google Cloud Console correspond exactement à `https://votre-backend.vercel.app/auth/google/callback`
2. Vérifiez que `BACKEND_URL` ou `VERCEL_URL` est correctement défini

### Problème : Sessions ne fonctionnent pas

**Solution** : 
- Les sessions en mémoire ne persistent pas entre les fonctions serverless
- En production, considérez utiliser un store de sessions externe (Redis, MongoDB, etc.)
- Pour les tests, `USE_MOCK_DATA=true` fonctionne sans sessions

### Problème : Frontend ne peut pas contacter le backend

**Solution** :
1. Vérifiez que `NEXT_PUBLIC_API_URL` est défini dans le frontend
2. Vérifiez les logs Vercel pour les erreurs CORS
3. Assurez-vous que le backend accepte les requêtes depuis le frontend

## 📝 Notes Importantes

### Sessions en Production

⚠️ **Important** : Les sessions Express en mémoire ne persistent pas entre les invocations serverless sur Vercel. Pour la production :

1. **Option 1** : Utiliser un store externe (Redis, MongoDB)
2. **Option 2** : Utiliser JWT tokens au lieu de sessions
3. **Option 3** : Utiliser Vercel KV (store clé-valeur de Vercel)

### Mode Test

Si vous voulez tester avec des données mock :
- Définissez `USE_MOCK_DATA=true` dans les variables d'environnement du backend
- Les données seront générées en mémoire (10 entreprises, 10 000+ avis chacune)

### Domaines Personnalisés

Vercel permet d'ajouter des domaines personnalisés :
1. Allez dans **Settings** → **Domains**
2. Ajoutez votre domaine
3. Suivez les instructions DNS

## 🔄 Déploiements Automatiques

Par défaut, Vercel déploie automatiquement :
- Chaque push sur `main` → Production
- Chaque pull request → Preview

Pour désactiver : **Settings** → **Git** → **Ignore Build Step**

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions)
- [Next.js sur Vercel](https://vercel.com/docs/frameworks/nextjs)

## ✅ Checklist de Déploiement

- [ ] Backend déployé sur Vercel
- [ ] Variables d'environnement backend configurées
- [ ] Frontend déployé sur Vercel
- [ ] Variable `NEXT_PUBLIC_API_URL` configurée dans le frontend
- [ ] URLs OAuth configurées dans Google Cloud Console
- [ ] `FRONTEND_URL` et `BACKEND_URL` configurés dans le backend
- [ ] Test de connexion Google OAuth réussi
- [ ] Test de l'application complète réussi

---

**Bon déploiement ! 🚀**

