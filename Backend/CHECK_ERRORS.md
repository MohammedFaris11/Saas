# 🔍 Comment Vérifier les Erreurs 500 sur Vercel

## Méthode 1 : Via Vercel Dashboard (Recommandé)

1. **Allez sur** : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend

2. **Cliquez sur** "Deployments"

3. **Trouvez** le dernier déploiement (celui qui a échoué)

4. **Cliquez sur** le déploiement pour voir les détails

5. **Cliquez sur** "Functions" dans la barre latérale

6. **Trouvez** `api/index.js` et cliquez dessus

7. **Regardez** l'onglet "Logs" pour voir l'erreur exacte

## Méthode 2 : Via Vercel CLI

```bash
cd Backend
vercel logs https://vrs2-backend-de61vfrr4-simofaris2018-2330s-projects.vercel.app
```

## Erreurs Communes et Solutions

### ❌ "CLIENT_ID is not defined" ou "CLIENT_SECRET is not defined"

**Solution** :
1. Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables
2. Ajoutez `CLIENT_ID` et `CLIENT_SECRET` depuis Google Cloud Console
3. Redéployez

### ❌ "SESSION_SECRET is not defined"

**Solution** :
1. Générer un secret : `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
2. Ajoutez-le dans les variables d'environnement Vercel
3. Redéployez

### ❌ "Cannot find module" ou "Error loading module"

**Solution** :
- Vérifiez que tous les packages sont dans `package.json`
- Exécutez `npm install` localement pour vérifier
- Redéployez

### ❌ "redirect_uri_mismatch"

**Solution** :
1. Allez sur Google Cloud Console
2. Vérifiez que l'URL de callback est : 
   `https://vrs2-backend-de61vfrr4-simofaris2018-2330s-projects.vercel.app/auth/google/callback`

## Variables d'Environnement Requises

Assurez-vous que ces 3 variables sont définies dans Vercel :

```
✅ CLIENT_ID=votre_client_id_google
✅ CLIENT_SECRET=votre_client_secret_google  
✅ SESSION_SECRET=gQTW+3M9gJBziUH+Vn3VdVZexKLxZdkj3ive99nLya8=
```

## Vérification Rapide

Pour tester si le backend répond :

1. Visitez : https://vrs2-backend-de61vfrr4-simofaris2018-2330s-projects.vercel.app/
2. Vous devriez voir : `<a href="/auth/google/">Authenticate with Google</a>`

Si cette page fonctionne, le backend répond mais il y a un problème avec OAuth.

## Après Avoir Corrigé

1. **Ajoutez/modifiez** les variables d'environnement
2. **Redéployez** le backend (Deployments → Redeploy)
3. **Testez** à nouveau

