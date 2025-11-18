# 🔧 Fix : URL de l'API pointe vers localhost

## Problème

Quand vous cliquez sur "Sign in with Google", vous êtes redirigé vers `http://localhost:3001/auth/google` au lieu de l'URL de production Vercel.

## Solution

### 1. Ajouter la Variable d'Environnement dans Vercel

1. Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-frontend/settings/environment-variables

2. Cliquez sur **Add New**

3. Ajoutez cette variable :
   - **Key** : `NEXT_PUBLIC_API_URL`
   - **Value** : `https://vrs2-backend-dqk6z91ff-simofaris2018-2330s-projects.vercel.app`
   - **Environments** : Cochez **Production**, **Preview**, et **Development**

4. Cliquez sur **Save**

### 2. Redéployer le Frontend

⚠️ **IMPORTANT** : Après avoir ajouté la variable, vous devez redéployer le frontend pour que la variable prenne effet.

**Option A : Via Vercel Dashboard**
1. Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-frontend/deployments
2. Trouvez le dernier déploiement
3. Cliquez sur les **...** (trois points)
4. Cliquez sur **Redeploy**
5. Cliquez sur **Redeploy** dans la confirmation

**Option B : Via Vercel CLI**
```bash
cd Fontend/my-app
vercel --prod
```

### 3. Vérifier que la Variable est Bien Appliquée

Après le redéploiement :
1. Visitez votre site frontend
2. Ouvrez la console du navigateur (F12)
3. Tapez dans la console : `console.log(process.env.NEXT_PUBLIC_API_URL)`
4. Vous devriez voir : `https://vrs2-backend-dqk6z91ff-simofaris2018-2330s-projects.vercel.app`

**Note** : Les variables d'environnement Next.js sont injectées au moment du build. Si vous modifiez une variable, vous devez redéployer pour qu'elle soit prise en compte.

## Pourquoi cela se produit ?

Next.js compile les variables d'environnement commençant par `NEXT_PUBLIC_` au moment du build. Si vous ajoutez ou modifiez une variable après le déploiement, elle ne sera pas disponible jusqu'au prochain build/deploy.

## Vérification Rapide

Pour vérifier rapidement quelle URL est utilisée :
1. Ouvrez la console du navigateur sur votre site frontend
2. Tapez : `window.location.href = '/api/auth/status'` (ne pas exécuter, juste voir)
3. Ou inspectez le réseau dans DevTools pour voir les requêtes API

---

**Après avoir ajouté la variable et redéployé, le problème devrait être résolu !**

