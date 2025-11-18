# 🚀 Déploiement Frontend - Instructions

## Réponses aux Questions Vercel

Quand Vercel CLI vous demande :

### 1. Set up and deploy?
- Répondez : **yes**

### 2. Which scope?
- Répondez : **simofaris2018-2330's projects** (ou le scope de votre choix)

### 3. Link to existing project?
- Répondez : **No** (pour créer un nouveau projet frontend)

### 4. What's your project's name?
- Tapez : **vrs2-frontend** (ou un autre nom de votre choix)

### 5. In which directory is your code located?
- Tapez : **.** (point, pour dire "le dossier actuel")

### 6. Want to override the settings?
- Répondez : **No** (Vercel détectera automatiquement Next.js)

## Variables d'Environnement à Ajouter

Après le déploiement, allez sur le Dashboard Vercel :

1. Allez dans votre projet frontend → **Settings** → **Environment Variables**
2. Ajoutez cette variable :
   ```
   NEXT_PUBLIC_API_URL=https://vrs2-backend-dqk6z91ff-simofaris2018-2330s-projects.vercel.app
   ```
3. **Important** : Redéployez après avoir ajouté la variable (Deployments → Redeploy)

## Après le Déploiement

1. **Notez l'URL du frontend** (ex: `https://vrs2-frontend.vercel.app`)

2. **Mettez à jour les variables du backend** :
   - Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables
   - Ajoutez :
     ```
     FRONTEND_URL=https://votre-frontend.vercel.app
     BACKEND_URL=https://vrs2-backend-dqk6z91ff-simofaris2018-2330s-projects.vercel.app
     ```
   - Redéployez le backend

## Tester l'Application

1. Visitez l'URL du frontend
2. Cliquez sur "Se connecter"
3. Testez l'authentification Google OAuth

