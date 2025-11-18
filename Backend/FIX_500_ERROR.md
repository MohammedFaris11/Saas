# 🔧 Fix : Erreur 500 sur /auth/google

## Problème

Quand vous cliquez sur "Sign in with Google", vous obtenez une erreur 500 : `FUNCTION_INVOCATION_FAILED` sur le backend.

## Causes Probables

1. **Variables d'environnement manquantes** (le plus probable)
2. **Problème de configuration Passport.js**
3. **Problème avec les sessions**

## Solution Étape par Étape

### 1. Vérifier les Variables d'Environnement

Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables

**Vérifiez que ces variables sont bien définies :**

```
CLIENT_ID=votre_client_id_google
CLIENT_SECRET=votre_client_secret_google
SESSION_SECRET=une_chaine_secrete_aleatoire_longue
```

⚠️ **IMPORTANT** : 
- `CLIENT_ID` et `CLIENT_SECRET` doivent être vos identifiants Google OAuth
- `SESSION_SECRET` doit être une chaîne aléatoire longue (ex: `openssl rand -base64 32`)

### 2. Vérifier les Logs Vercel

Pour voir les erreurs détaillées :

1. Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend
2. Cliquez sur **Deployments**
3. Cliquez sur le dernier déploiement
4. Cliquez sur **Functions** → Trouvez `api/index.js`
5. Regardez les **Logs** pour voir l'erreur exacte

### 3. Redéployer après Ajout des Variables

Après avoir ajouté/modifié les variables d'environnement :

1. Allez sur **Deployments**
2. Trouvez le dernier déploiement
3. Cliquez sur **...** (trois points)
4. Cliquez sur **Redeploy**
5. Cliquez sur **Redeploy** dans la confirmation

### 4. Vérifier la Configuration Google OAuth

Assurez-vous que dans Google Cloud Console :

1. Allez sur : https://console.cloud.google.com/
2. **APIs & Services** → **Credentials**
3. Vérifiez que votre **OAuth 2.0 Client ID** a bien cette URL dans **Authorized redirect URIs** :
   ```
   https://vrs2-backend-dqk6z91ff-simofaris2018-2330s-projects.vercel.app/auth/google/callback
   ```

## Erreurs Communes

### Erreur : "CLIENT_ID is not defined"
**Solution** : Ajoutez `CLIENT_ID` dans les variables d'environnement Vercel

### Erreur : "redirect_uri_mismatch"
**Solution** : Vérifiez que l'URL de callback dans Google Console correspond exactement à celle du backend

### Erreur : "Session store is not configured"
**Solution** : Les sessions en mémoire fonctionnent mais peuvent avoir des problèmes. Pour la production, considérez utiliser un store externe.

## Test Rapide

Pour tester si le backend fonctionne :

1. Visitez : https://vrs2-backend-dqk6z91ff-simofaris2018-2330s-projects.vercel.app/
2. Vous devriez voir : `<a href="/auth/google/">Authenticate with Google</a>`

Si cette page fonctionne mais `/auth/google` ne fonctionne pas, le problème est probablement lié à Passport.js ou aux variables d'environnement.

## Mode Debug

Pour activer plus de logs, vous pouvez temporairement ajouter dans `Backend/src/routes/auth.js` :

```javascript
console.log('CLIENT_ID:', process.env.CLIENT_ID ? 'Defined' : 'UNDEFINED');
console.log('CLIENT_SECRET:', process.env.CLIENT_SECRET ? 'Defined' : 'UNDEFINED');
```

Puis redéployez et vérifiez les logs.

---

**Après avoir ajouté les variables d'environnement et redéployé, l'erreur devrait être résolue !**

