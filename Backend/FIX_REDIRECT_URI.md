# 🔧 Correction de l'erreur redirect_uri_mismatch

## Problème
L'erreur `redirect_uri_mismatch` apparaît car l'URL de callback dans Google Cloud Console ne correspond pas à celle utilisée dans le code.

## Solution rapide

### Étape 1 : Accéder à Google Cloud Console
1. Allez sur : https://console.cloud.google.com/
2. Sélectionnez votre projet "Ansview" (ou le nom de votre projet)

### Étape 2 : Modifier les URI de redirection
1. Dans le menu latéral, allez dans : **APIs & Services** → **Credentials**
2. Cliquez sur votre **OAuth 2.0 Client ID** (celui que vous utilisez pour Ansview)

### Étape 3 : Mettre à jour l'URI de redirection
1. Dans la section **"Authorized redirect URIs"**, vous verrez probablement :
   - `http://localhost:3000/auth/google/callback` ❌ (ancien port)

2. **Modifiez ou ajoutez** cette URL :
   ```
   http://localhost:3001/auth/google/callback
   ```
   ✅ (nouveau port - port 3001)

3. **Supprimez** l'ancienne URL avec le port 3000 si elle existe

4. Cliquez sur **"Save"** (Enregistrer)

### Étape 4 : Attendre la propagation
- Les changements peuvent prendre **1-2 minutes** pour être effectifs
- Si l'erreur persiste, attendez quelques minutes et réessayez

### Étape 5 : Tester
1. Redémarrez votre serveur backend si nécessaire
2. Essayez de vous connecter avec Google OAuth
3. L'erreur devrait être résolue

## Vérification

Assurez-vous que :
- ✅ L'URL dans Google Cloud Console est : `http://localhost:3001/auth/google/callback`
- ✅ L'URL dans `Backend/src/routes/auth.js` ligne 9 est : `http://localhost:3001/auth/google/callback`
- ✅ Les deux URLs correspondent **exactement** (même casse, même port, même chemin)

## Note importante
Le backend utilise maintenant le **port 3001** pour éviter le conflit avec Next.js qui utilise le port 3000.

