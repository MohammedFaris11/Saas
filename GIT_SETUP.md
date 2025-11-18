# 🔄 Configuration Git et Push sur GitHub

## Étape 1 : Créer un repository sur GitHub

1. Allez sur https://github.com/new
2. Nom du repository : `VRS2` (ou le nom que vous voulez)
3. Description : "Gestion de Reviews Google Business - Next.js + Express"
4. Choisissez **Public** ou **Private**
5. **NE COCHEZ PAS** "Initialize this repository with a README"
6. Cliquez sur **Create repository**

## Étape 2 : Connecter votre repository local à GitHub

Après avoir créé le repository, GitHub vous donnera les commandes. Utilisez celles-ci :

### Si vous utilisez HTTPS :

```bash
cd c:\Users\MSI\Desktop\VRS2
git remote add origin https://github.com/VOTRE_USERNAME/VRS2.git
git branch -M main
git push -u origin main
```

### Si vous utilisez SSH :

```bash
cd c:\Users\MSI\Desktop\VRS2
git remote add origin git@github.com:VOTRE_USERNAME/VRS2.git
git branch -M main
git push -u origin main
```

⚠️ **Remplacez `VOTRE_USERNAME` par votre nom d'utilisateur GitHub**

## Étape 3 : Authentification GitHub

Lors du `git push`, GitHub vous demandera vos identifiants :

### Option 1 : Personal Access Token (Recommandé)
1. Allez sur https://github.com/settings/tokens
2. Cliquez sur **Generate new token (classic)**
3. Nom : "VRS2 Deploy"
4. Sélectionnez les scopes : `repo` (toutes les permissions repo)
5. Cliquez sur **Generate token**
6. **Copiez le token** (vous ne pourrez plus le voir après)
7. Utilisez ce token comme mot de passe lors du push

### Option 2 : GitHub CLI
```bash
gh auth login
git push -u origin main
```

## Étape 4 : Vérifier le push

1. Allez sur https://github.com/VOTRE_USERNAME/VRS2
2. Vous devriez voir tous vos fichiers

## 🚀 Étape 5 : Déployer sur Vercel via Git

Une fois le repository sur GitHub :

### Backend

1. Allez sur https://vercel.com/new
2. Cliquez sur **Import Git Repository**
3. Sélectionnez votre repository `VRS2`
4. **Root Directory** : Sélectionnez `Backend`
5. **Framework Preset** : Autre
6. **Install Command** : `npm install`
7. Cliquez sur **Deploy**

### Frontend

1. Créez un **nouveau projet** sur Vercel
2. Importez le même repository `VRS2`
3. **Root Directory** : Sélectionnez `Fontend/my-app`
4. **Framework Preset** : Next.js (détecté automatiquement)
5. Cliquez sur **Deploy**

## 📝 Configuration des Variables d'Environnement

Voir [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) pour les variables d'environnement nécessaires.

## ✅ Commandes Rapides

```bash
# Ajouter le remote (une seule fois)
git remote add origin https://github.com/VOTRE_USERNAME/VRS2.git

# Changer le nom de branche à main
git branch -M main

# Push initial
git push -u origin main

# Pour les futurs commits
git add .
git commit -m "Votre message de commit"
git push
```

---

**Besoin d'aide ?** Consultez [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) pour le guide complet de déploiement.

