# 🚀 Démarrage Rapide - Push sur GitHub

## Étape 1 : Créer le Repository sur GitHub

1. Ouvrez votre navigateur et allez sur : **https://github.com/new**

2. Remplissez le formulaire :
   - **Repository name** : `VRS2`
   - **Description** : `Gestion de Reviews Google Business`
   - Choisissez **Public** ou **Private**
   - **⚠️ IMPORTANT** : Ne cochez PAS "Initialize this repository with a README"
   - Cliquez sur **Create repository**

3. **Copiez l'URL** que GitHub affiche (exemple : `https://github.com/VOTRE_USERNAME/VRS2.git`)

## Étape 2 : Exécuter le Script

Dans PowerShell (dans le dossier VRS2), exécutez :

```powershell
.\push-to-github.ps1
```

Le script vous demandera :
1. L'URL de votre repository GitHub (collez celle que vous avez copiée)
2. Si vous voulez push maintenant (répondez `o` pour oui)

## Étape 3 : Authentification GitHub

Quand GitHub demande vos identifiants :

### Option A : Personal Access Token (Recommandé)

1. Si vous n'avez pas encore de token, créez-en un :
   - Allez sur : https://github.com/settings/tokens
   - Cliquez sur **Generate new token (classic)**
   - Nom : `VRS2 Deploy`
   - Sélectionnez la durée (ex: 90 jours)
   - Cochez le scope : `repo` (toutes les permissions repo)
   - Cliquez sur **Generate token**
   - **Copiez le token** (vous ne pourrez plus le voir après !)

2. Lors du push :
   - **Username** : Votre nom d'utilisateur GitHub
   - **Password** : Collez le token que vous venez de créer

### Option B : GitHub CLI

Si vous avez GitHub CLI installé :
```powershell
gh auth login
git push -u origin main
```

## Étape 4 : Vérifier

Après le push réussi :
- Allez sur https://github.com/VOTRE_USERNAME/VRS2
- Vous devriez voir tous vos fichiers !

## ✅ C'est fait !

Votre code est maintenant sur GitHub. Passez au déploiement Vercel :
- Consultez `DEPLOY_VERCEL.md` pour les instructions complètes

---

**Besoin d'aide ?** 
- Vérifiez que vous avez créé le repository sur GitHub avant d'exécuter le script
- Vérifiez que vous utilisez un Personal Access Token pour l'authentification

