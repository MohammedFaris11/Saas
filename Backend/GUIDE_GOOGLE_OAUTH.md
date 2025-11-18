# Guide de configuration Google OAuth 2.0

Ce guide vous explique comment créer un projet dans Google Cloud Console et configurer l'authentification OAuth pour votre application.

## Étape 1 : Créer un projet dans Google Cloud Console

1. **Accédez à Google Cloud Console**
   - Allez sur : https://console.cloud.google.com/
   - Connectez-vous avec votre compte Google

2. **Créer un nouveau projet**
   - Cliquez sur le sélecteur de projet en haut (à côté de "Google Cloud")
   - Cliquez sur "Nouveau projet" (New Project)
   - Donnez un nom à votre projet (ex: "Ansview App")
   - Cliquez sur "Créer" (Create)
   - Attendez quelques secondes que le projet soit créé

## Étape 2 : Activer l'API Google OAuth 2.0

1. **Dans votre projet, allez dans "API et services"**
   - Dans le menu latéral, cliquez sur "API et services" → "Bibliothèque"
   - Ou allez directement : https://console.cloud.google.com/apis/library

2. **Rechercher et activer l'API**
   - Recherchez "Google+ API" ou "Google Identity API"
   - Cliquez sur "Google+ API" ou "Identity Toolkit API"
   - Cliquez sur "Activer" (Enable)

## Étape 3 : Configurer l'écran de consentement OAuth

1. **Aller dans "Écran de consentement OAuth"**
   - Dans le menu latéral : "API et services" → "Écran de consentement OAuth"
   - Ou : https://console.cloud.google.com/apis/credentials/consent

2. **Choisir le type d'utilisateur**
   - Sélectionnez "Externe" (pour tester avec n'importe quel compte Google)
   - Cliquez sur "Créer"

3. **Remplir les informations de l'application (Étape 1 - Informations sur l'application)**
   - **Nom de l'application** : Ansview (ou le nom que vous voulez)
   - **Email de support utilisateur** : Votre email
   - **Email des développeurs** : Votre email (ajoutez-vous comme développeur)
   - Cliquez sur "Enregistrer et continuer"

4. **Configurer les scopes (Étape 2 - Scopes)**
   
   **Option A : Si vous voyez une liste de scopes**
   - Vous verrez une page avec des scopes déjà disponibles
   - Les scopes suivants sont généralement déjà sélectionnés par défaut :
     - `userinfo.email` ou `https://www.googleapis.com/auth/userinfo.email`
     - `userinfo.profile` ou `https://www.googleapis.com/auth/userinfo.profile`
     - `openid`
   - Si ces scopes sont déjà là, vous pouvez continuer sans rien changer
   - Cliquez sur "Enregistrer et continuer"
   
   **Option B : Si vous ne voyez pas de liste de scopes**
   - **PAS DE PROBLÈME !** Les scopes sont déjà configurés dans votre code (dans `auth.js`)
   - Votre code demande déjà `scope:['email','profile']`
   - Google ajoutera automatiquement les scopes nécessaires lors de la première connexion
   - Cliquez simplement sur "Enregistrer et continuer" ou "Passer cette étape"

5. **Ajouter les utilisateurs de test (Étape 3 - Utilisateurs de test)**
   - Si vous êtes en mode test (application externe en mode test)
   - Ajoutez les emails Google qui pourront tester l'application
   - **Important** : Ajoutez votre propre email pour pouvoir tester
   - Cliquez sur "Enregistrer et continuer"

6. **Résumé (Étape 4 - Résumé)**
   - Vérifiez les informations
   - Cliquez sur "Retour au tableau de bord" ou "Terminer"

**Note importante sur les scopes :**
- Les scopes `email` et `profile` sont des scopes de base et sont généralement disponibles par défaut
- Ils sont déjà configurés dans votre code (`backend/src/routes/auth.js` ligne 10: `scope:['email','profile']`)
- Si vous ne trouvez pas l'option pour les ajouter, Google les ajoutera automatiquement lors de la première connexion d'un utilisateur

## Étape 4 : Créer les identifiants OAuth 2.0

1. **Aller dans "Identifiants"**
   - Dans le menu : "API et services" → "Identifiants"
   - Ou : https://console.cloud.google.com/apis/credentials

2. **Créer un ID client OAuth 2.0**
   - Cliquez sur "Créer des identifiants" → "ID client OAuth 2.0"
   
3. **Configurer l'ID client**
   - **Type d'application** : "Application Web"
   - **Nom** : "Ansview Web Client" (ou le nom que vous voulez)
   
4. **Configurer les URI de redirection autorisés**
   - **URI de redirection autorisés** : Ajoutez ces URLs :
     ```
     http://localhost:3001/auth/google/callback
     ```
   - **Important** : Pour la production, ajoutez aussi votre URL de production
   - **Note** : Le backend utilise le port 3001 pour éviter le conflit avec Next.js (port 3000)
   
5. **Créer l'ID client**
   - Cliquez sur "Créer"
   - **IMPORTANT** : Une fenêtre s'ouvre avec votre **Client ID** et **Client Secret**
   - **Copiez ces valeurs immédiatement** (vous ne pourrez plus voir le secret plus tard)

## Étape 5 : Configurer votre application

1. **Créer le fichier .env**
   - Dans le dossier `backend`, créez un fichier `.env`
   - Copiez le contenu de `.env.example` :

2. **Remplir les valeurs dans .env**
   ```env
   CLIENT_ID=votre_client_id_copié_ici
   CLIENT_SECRET=votre_client_secret_copié_ici
   SESSION_SECRET=une_chaine_aleatoire_secrete_ici
   ```

3. **Exemple de fichier .env**
   ```env
   CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
   CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
   SESSION_SECRET=ma_super_secret_session_key_12345
   ```

## Étape 6 : Vérifier la configuration

1. **Vérifier que le fichier .env existe** dans `backend/.env`
2. **Vérifier que les valeurs sont correctes**
3. **Redémarrer le serveur backend** pour que les variables d'environnement soient chargées

## URLs importantes

- **Google Cloud Console** : https://console.cloud.google.com/
- **Identifiants OAuth** : https://console.cloud.google.com/apis/credentials
- **Écran de consentement** : https://console.cloud.google.com/apis/credentials/consent
- **Bibliothèque d'API** : https://console.cloud.google.com/apis/library

## Pour la production

Quand vous déployez en production, vous devrez :
1. Ajouter votre URL de production dans les "URI de redirection autorisés"
2. Mettre à jour le `callbackURL` dans `backend/src/routes/auth.js`
3. Utiliser `https://` au lieu de `http://`
4. Changer `secure: true` dans la configuration de session (dans `server.js`)

## Dépannage

- **Erreur "redirect_uri_mismatch"** : 
  - Vérifiez que l'URL dans Google Cloud Console correspond exactement à celle dans le code
  - L'URL doit être : `http://localhost:3001/auth/google/callback` (port 3001)
  - Pour corriger :
    1. Allez dans Google Cloud Console → APIs & Services → Credentials
    2. Cliquez sur votre OAuth 2.0 Client ID
    3. Dans "Authorized redirect URIs", ajoutez ou modifiez : `http://localhost:3001/auth/google/callback`
    4. Cliquez sur "Save"
    5. Attendez quelques minutes pour que les changements prennent effet
- **Erreur "invalid_client"** : Vérifiez que le CLIENT_ID et CLIENT_SECRET sont corrects dans votre fichier `.env`
- **Le secret n'est plus visible** : Vous devrez créer un nouveau Client Secret dans Google Console

