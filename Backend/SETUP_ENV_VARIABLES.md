# ⚙️ Configuration des Variables d'Environnement Vercel

## 🚨 IMPORTANT : Ces variables sont OBLIGATOIRES

Sans ces variables, vous obtiendrez une erreur 500 lors de l'authentification Google.

## 📋 Liste des Variables Requises

### 1. CLIENT_ID (Google OAuth)
- **Où trouver** : Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID
- **Format** : `123456789-abcdefghijklmnop.apps.googleusercontent.com`

### 2. CLIENT_SECRET (Google OAuth)
- **Où trouver** : Même endroit que CLIENT_ID (dans Google Cloud Console)
- **Format** : `GOCSPX-abcdefghijklmnopqrstuvwxyz`

### 3. SESSION_SECRET
- **Génération** : Utilisez cette commande dans PowerShell :
  ```powershell
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- **Exemple** : `gQTW+3M9gJBziUH+Vn3VdVZexKLxZdkj3ive99nLya8=`

## 🔧 Comment Ajouter les Variables dans Vercel

### Étape 1 : Accéder aux Variables d'Environnement

1. Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables

### Étape 2 : Ajouter Chaque Variable

Pour **chaque variable** :

1. **Cliquez sur** "Add New"
2. **Remplissez** :
   - **Key** : Le nom de la variable (ex: `CLIENT_ID`)
   - **Value** : La valeur de la variable
   - **Environments** : Cochez **Production**, **Preview**, et **Development**
3. **Cliquez sur** "Save"

Répétez pour les 3 variables.

### Étape 3 : Vérifier

Vous devriez voir ces 3 variables dans la liste :
```
✅ CLIENT_ID
✅ CLIENT_SECRET
✅ SESSION_SECRET
```

### Étape 4 : Redéployer

⚠️ **CRITIQUE** : Après avoir ajouté les variables, vous DEVEZ redéployer :

1. Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/deployments
2. Trouvez le **dernier déploiement**
3. Cliquez sur **...** (trois points)
4. Cliquez sur **Redeploy**
5. Cliquez sur **Redeploy** dans la confirmation

## 📍 Où Trouver CLIENT_ID et CLIENT_SECRET

### Si vous avez déjà un OAuth Client ID :

1. Allez sur : https://console.cloud.google.com/
2. **APIs & Services** → **Credentials**
3. Cliquez sur votre **OAuth 2.0 Client ID**
4. Copiez le **Client ID** (c'est votre `CLIENT_ID`)
5. Si vous ne voyez pas le **Client Secret**, vous devrez peut-être :
   - Créer un nouveau secret (le secret est masqué après création)
   - Ou utiliser un autre OAuth Client ID

### Si vous n'avez pas encore d'OAuth Client ID :

Consultez : `Backend/GUIDE_GOOGLE_OAUTH.md` pour créer un OAuth Client ID.

## ✅ Vérification

Après avoir ajouté les variables et redéployé :

1. **Testez le backend** :
   - Visitez : https://vrs2-backend-ngvat661b-simofaris2018-2330s-projects.vercel.app/
   - Vous devriez voir : `<a href="/auth/google/">Authenticate with Google</a>`

2. **Testez l'authentification** :
   - Cliquez sur le lien ou visitez directement : `/auth/google`
   - Vous devriez être redirigé vers Google (pas d'erreur 500)

## 🔍 Si l'Erreur 500 Persiste

1. **Vérifiez les logs** :
   - Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/deployments
   - Cliquez sur le dernier déploiement → **Functions** → `api/index.js` → **Logs**
   - Cherchez les messages commençant par `❌` pour voir l'erreur exacte

2. **Vérifiez que les variables sont bien définies** :
   - Retournez dans Settings → Environment Variables
   - Assurez-vous que les 3 variables sont présentes
   - Vérifiez qu'elles sont activées pour **Production**

3. **Vérifiez Google OAuth** :
   - L'URL de callback dans Google Console doit être :
     `https://vrs2-backend-ngvat661b-simofaris2018-2330s-projects.vercel.app/auth/google/callback`

## 📝 Variables Optionnelles

Ces variables peuvent être ajoutées plus tard :

```
USE_MOCK_DATA=true (pour tester avec des données fictives)
GEMINI_API_KEY=votre_cle (si vous utilisez Gemini pour le chatbot)
FRONTEND_URL=https://votre-frontend.vercel.app
BACKEND_URL=https://vrs2-backend-ngvat661b-simofaris2018-2330s-projects.vercel.app
```

---

**⚡ Récapitulatif Rapide :**

1. ✅ Ajouter `CLIENT_ID` dans Vercel
2. ✅ Ajouter `CLIENT_SECRET` dans Vercel  
3. ✅ Ajouter `SESSION_SECRET` dans Vercel (généré avec la commande Node.js)
4. ✅ Redéployer le backend
5. ✅ Tester `/auth/google`

