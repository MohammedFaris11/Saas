# 🚨 CORRECTION URGENTE : Erreur 500

## ❌ Erreur Actuelle

```
TypeError: OAuth2Strategy requires a clientID option
```

Cela signifie que **CLIENT_ID** et **CLIENT_SECRET** ne sont **PAS définis** dans les variables d'environnement Vercel.

## ✅ Solution IMMÉDIATE

### Étape 1 : Ajouter les Variables d'Environnement

Allez sur : **https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables**

Ajoutez ces 3 variables **MAINTENANT** :

#### Variable 1 : CLIENT_ID
- **Key** : `CLIENT_ID`
- **Value** : Votre Client ID Google (depuis Google Cloud Console)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 2 : CLIENT_SECRET
- **Key** : `CLIENT_SECRET`
- **Value** : Votre Client Secret Google (depuis Google Cloud Console)
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

#### Variable 3 : SESSION_SECRET
- **Key** : `SESSION_SECRET`
- **Value** : `gQTW+3M9gJBziUH+Vn3VdVZexKLxZdkj3ive99nLya8=`
- **Environments** : ✅ Production, ✅ Preview, ✅ Development

### Étape 2 : Redéployer le Backend

**⚠️ CRITIQUE** : Après avoir ajouté les variables, vous DEVEZ redéployer :

1. Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/deployments
2. Cliquez sur **...** (trois points) du dernier déploiement
3. Cliquez sur **Redeploy**
4. Cliquez sur **Redeploy** dans la confirmation

**OU** via CLI :
```bash
cd Backend
vercel --prod
```

### Étape 3 : Vérifier

Après le redéploiement, visitez :
https://vrs2-backend-r2comumfq-simofaris2018-2330s-projects.vercel.app/

Vous devriez voir : `<a href="/auth/google/">Authenticate with Google</a>`

## 📍 Où Trouver CLIENT_ID et CLIENT_SECRET

1. Allez sur : https://console.cloud.google.com/
2. **APIs & Services** → **Credentials**
3. Cliquez sur votre **OAuth 2.0 Client ID**
4. Copiez le **Client ID** → C'est votre `CLIENT_ID`
5. Si vous ne voyez pas le **Client Secret**, vous devrez peut-être :
   - Créer un nouveau secret
   - Ou utiliser un autre OAuth Client ID

## ⚠️ Important

- **GEMINI_API_KEY** est optionnel (pour le chatbot)
- **CLIENT_ID**, **CLIENT_SECRET**, et **SESSION_SECRET** sont **OBLIGATOIRES**

Sans ces 3 variables, le backend crashera avec l'erreur que vous voyez.

## ✅ Checklist

- [ ] CLIENT_ID ajouté dans Vercel
- [ ] CLIENT_SECRET ajouté dans Vercel
- [ ] SESSION_SECRET ajouté dans Vercel
- [ ] Backend redéployé
- [ ] Backend testé (visitez la racine `/`)

---

**Après avoir ajouté les variables et redéployé, l'erreur devrait être résolue !** ✅

