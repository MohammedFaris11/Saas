# 🚀 Étapes de Déploiement Vercel - Backend

## Configuration lors du déploiement

Quand Vercel CLI vous demande :

### 1. Link to existing project?
- Répondez : **No** (pour créer un nouveau projet)

### 2. What's your project's name?
- Répondez : `vrs2-backend` (ou le nom que vous voulez)

### 3. In which directory is your code located?
- Répondez : **.** (point, pour dire "le dossier actuel")

### 4. Want to override the settings?
- Répondez : **No** (sauf si vous voulez modifier)

## Variables d'environnement à ajouter

Après le déploiement, allez sur le Dashboard Vercel et ajoutez ces variables dans **Settings** → **Environment Variables** :

### Variables requises :
```
CLIENT_ID=votre_client_id_google
CLIENT_SECRET=votre_client_secret_google
SESSION_SECRET=une_chaine_secrete_aleatoire_longue
```

### Variables optionnelles :
```
USE_MOCK_DATA=true
GEMINI_API_KEY=votre_cle_gemini
```

### Variables à ajouter APRÈS avoir déployé le frontend :
```
FRONTEND_URL=https://votre-frontend.vercel.app
BACKEND_URL=https://votre-backend.vercel.app
```

## Après le déploiement

1. **Notez l'URL du backend** : `https://votre-backend.vercel.app`
2. **Configurez Google OAuth** :
   - Allez sur https://console.cloud.google.com/
   - APIs & Services → Credentials
   - Ajoutez l'URL de callback : `https://votre-backend.vercel.app/auth/google/callback`

## Prochaines étapes

1. Déployez le Frontend (voir DEPLOY_STEPS.md dans Fontend/my-app)
2. Ajoutez `FRONTEND_URL` et `BACKEND_URL` dans les variables d'environnement
3. Redéployez le backend pour que les variables prennent effet

