# VRS2 - Gestion de Reviews Google Business

Application complète pour gérer et répondre automatiquement aux avis Google Business.

## 🏗️ Architecture

- **Frontend** : Next.js 16 avec TypeScript
- **Backend** : Express.js avec Serverless Functions pour Vercel
- **Authentification** : Google OAuth 2.0
- **API** : Google Business Profile API

## 📁 Structure du Projet

```
VRS2/
├── Backend/          # API Express (Serverless pour Vercel)
│   ├── api/          # Point d'entrée Vercel
│   ├── src/          # Code source
│   └── vercel.json   # Configuration Vercel
├── Fontend/          # Application Next.js
│   └── my-app/       # Application Next.js
└── DEPLOY_VERCEL.md  # Guide de déploiement
```

## 🚀 Déploiement Rapide

### Prérequis
- Compte Vercel (gratuit) : https://vercel.com
- Compte Google Cloud avec OAuth configuré

### Étapes

1. **Créer un repository GitHub/GitLab**
   ```bash
   git remote add origin https://github.com/votre-username/VRS2.git
   git branch -M main
   git push -u origin main
   ```

2. **Déployer le Backend sur Vercel**
   - Allez sur https://vercel.com/new
   - Importez votre repo Git
   - Root Directory : `Backend`
   - Ajoutez les variables d'environnement (voir DEPLOY_VERCEL.md)

3. **Déployer le Frontend sur Vercel**
   - Créez un nouveau projet Vercel
   - Root Directory : `Fontend/my-app`
   - Ajoutez : `NEXT_PUBLIC_API_URL=https://votre-backend.vercel.app`

4. **Configurer Google OAuth**
   - Ajoutez l'URL de callback dans Google Cloud Console
   - `https://votre-backend.vercel.app/auth/google/callback`

## 📚 Documentation

- [Guide de déploiement Vercel](DEPLOY_VERCEL.md)
- [Configuration Google OAuth](Backend/GUIDE_GOOGLE_OAUTH.md)
- [Mode Test (données mock)](Backend/MODE_TEST.md)

## 🛠️ Développement Local

### Backend
```bash
cd Backend
npm install
npm start
```

### Frontend
```bash
cd Fontend/my-app
npm install
npm run dev
```

## 📝 Variables d'Environnement

### Backend
- `CLIENT_ID` - Google OAuth Client ID
- `CLIENT_SECRET` - Google OAuth Client Secret
- `SESSION_SECRET` - Secret pour les sessions
- `FRONTEND_URL` - URL du frontend (production)
- `BACKEND_URL` - URL du backend (production)
- `GEMINI_API_KEY` - Clé API Gemini (optionnel)
- `USE_MOCK_DATA` - Activer les données mock (true/false)

### Frontend
- `NEXT_PUBLIC_API_URL` - URL de l'API backend

## 📄 Licence

ISC

