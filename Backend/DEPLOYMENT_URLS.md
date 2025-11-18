# 🌐 URLs de Déploiement

## Backend

✅ **Déployé avec succès !**

- **URL de production** : https://vrs2-backend-dqk6z91ff-simofaris2018-2330s-projects.vercel.app
- **URL de dashboard** : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings
- **Projet** : vrs2-backend

## Prochaines étapes

### 1. Ajouter les Variables d'Environnement

Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables

Ajoutez ces variables :

```
CLIENT_ID=votre_client_id_google
CLIENT_SECRET=votre_client_secret_google
SESSION_SECRET=une_chaine_secrete_aleatoire_longue
USE_MOCK_DATA=true
```

Si vous utilisez Gemini :
```
GEMINI_API_KEY=votre_cle_gemini
```

**Important** : Après avoir ajouté les variables, allez dans **Deployments** et cliquez sur **Redeploy** pour appliquer les nouvelles variables.

### 2. Configurer Google OAuth

Allez sur : https://console.cloud.google.com/

1. **APIs & Services** → **Credentials**
2. Cliquez sur votre **OAuth 2.0 Client ID**
3. Dans **Authorized redirect URIs**, ajoutez :
   ```
   https://vrs2-backend-dqk6z91ff-simofaris2018-2330s-projects.vercel.app/auth/google/callback
   ```
4. Cliquez sur **Save**

### 3. Déployer le Frontend

Voir `DEPLOY_VERCEL.md` pour les instructions complètes.

Après avoir déployé le frontend, ajoutez ces variables au backend :
```
FRONTEND_URL=https://votre-frontend.vercel.app
BACKEND_URL=https://vrs2-backend-dqk6z91ff-simofaris2018-2330s-projects.vercel.app
```

Puis redéployez le backend.

