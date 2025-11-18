# Guide de configuration Google Business Profile API

Ce guide vous explique comment activer et configurer l'API Google Business Profile (anciennement Google My Business API) pour votre application Ansview.

## Étape 1 : Activer l'API Google Business Profile

1. **Accédez à Google Cloud Console**
   - Allez sur : https://console.cloud.google.com/
   - Sélectionnez votre projet (celui que vous avez créé pour OAuth)

2. **Activer l'API Google Business Profile**
   - Dans le menu latéral : "API et services" → "Bibliothèque"
   - Ou allez directement : https://console.cloud.google.com/apis/library
   - Recherchez "Google Business Profile API" ou "My Business API"
   - Cliquez sur "Google Business Profile API"
   - Cliquez sur "Activer" (Enable)

## Étape 2 : Mettre à jour les scopes OAuth

Les scopes nécessaires pour Google Business Profile sont déjà configurés dans votre code :
- `https://www.googleapis.com/auth/business.manage`

### Vérifier dans l'écran de consentement OAuth

1. Allez dans "API et services" → "Écran de consentement OAuth"
2. Cliquez sur "Modifier l'application"
3. Allez à l'étape "Scopes"
4. Vérifiez que ces scopes sont ajoutés :
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/business.manage` ← **Important pour Google Business**

## Étape 3 : Tester la connexion

1. **Redémarrer le serveur backend** après avoir activé l'API
2. **Se connecter à nouveau** via Google OAuth (pour obtenir les nouveaux scopes)
3. **Vérifier dans le dashboard** que les établissements apparaissent

## Structure des endpoints

### GET `/business/status`
Vérifie si l'utilisateur a connecté Google Business
```json
{
  "connected": true,
  "accountsCount": 1
}
```

### GET `/business/locations`
Récupère tous les établissements de l'utilisateur
```json
{
  "success": true,
  "locations": [...],
  "count": 3
}
```

### GET `/business/accounts`
Récupère les comptes Google Business
```json
{
  "success": true,
  "accounts": {...}
}
```

### GET `/business/locations/:locationId/reviews`
Récupère les avis d'un établissement spécifique

## Notes importantes

1. **Permissions requises** : L'utilisateur doit être propriétaire ou gestionnaire des établissements Google Business pour qu'ils apparaissent.

2. **Première connexion** : Lors de la première connexion avec les nouveaux scopes, Google demandera l'autorisation pour accéder aux données Business.

3. **Tokens OAuth** : Les tokens d'accès sont automatiquement sauvegardés dans la session pour permettre l'accès à l'API.

4. **Limites API** : Google Business Profile API a des limites de quota. Consultez la documentation Google pour les détails.

## Dépannage

### Erreur : "API not enabled"
- Assurez-vous d'avoir activé "Google Business Profile API" dans Google Cloud Console

### Erreur : "Insufficient permissions"
- Vérifiez que le scope `business.manage` est bien demandé
- Reconnectez-vous pour obtenir les nouveaux scopes

### Aucun établissement trouvé
- Vérifiez que vous êtes propriétaire/gestionnaire des établissements dans Google Business
- Assurez-vous que les établissements sont bien configurés dans Google Business Profile

### Token expiré
- Les tokens sont stockés dans la session. Si la session expire, reconnectez-vous.

## URLs utiles

- **Google Cloud Console** : https://console.cloud.google.com/
- **API Library** : https://console.cloud.google.com/apis/library
- **Documentation Google Business Profile API** : https://developers.google.com/my-business/content/overview

