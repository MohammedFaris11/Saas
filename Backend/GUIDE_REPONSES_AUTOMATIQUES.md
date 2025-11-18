# Guide - Réponses automatiques avec ChatGPT/Gemini

## 📋 Vue d'ensemble

Le système de réponses automatiques génère des réponses professionnelles aux avis Google Business selon les règles du cahier des charges.

## 🎯 Logique de réponse selon le cahier des charges

### ⭐⭐⭐⭐⭐ (5 étoiles)
- **Avec commentaire** : Réponse personnalisée basée sur le contenu de l'avis
- **Sans commentaire** : Réponse générique de remerciement

### ⭐⭐⭐⭐ (4 étoiles)
- **Avec commentaire** : Réponse personnalisée basée sur le contenu de l'avis
- **Sans commentaire** : Réponse générique de remerciement

### ⭐⭐⭐ (3 étoiles)
- **Avec ou sans commentaire** : Réponse générique neutre et ouverte à la discussion

### ⭐⭐ ou ⭐ (2 ou 1 étoile)
- **Avec commentaire** : Réponse personnalisée en reconnaissant les problèmes soulevés
- **Sans commentaire** : Réponse générique exprimant de la considération et ouverture au dialogue

## 🚀 Configuration

### Utiliser Google Gemini (par défaut)

Le système utilise **Google Gemini** pour générer les réponses automatiques.

1. **Ajouter la clé API Gemini dans `.env`** :
   ```
   GEMINI_API_KEY=votre_clé_api_gemini
   ```

2. **Obtenir une clé API Gemini** :
   - Allez sur : https://makersuite.google.com/app/apikey
   - Connectez-vous avec votre compte Google
   - Créez une nouvelle clé API
   - Copiez la clé et ajoutez-la dans votre fichier `.env`

3. **Redémarrer le serveur backend** après avoir ajouté la clé

✅ **Le système est configuré pour utiliser Gemini par défaut.**

## 📝 Format des réponses

Toutes les réponses commencent par :
- `"Bonjour [Prénom],"` si le prénom est disponible
- `"Bonjour,"` sinon

## 🎨 Utilisation dans l'interface

1. Cliquez sur **"Répondre"** sur un avis non répondu
2. Cliquez sur **"Réponse automatique"** (bouton violet avec icône ✨)
3. La réponse est générée automatiquement selon les règles du cahier des charges
4. Vous pouvez modifier la réponse générée avant de l'envoyer
5. Cliquez sur **"Envoyer la réponse"** pour publier

## 🔧 Endpoints API

### POST `/business/locations/:locationId/reviews/:reviewId/generate-reply`
Génère une réponse automatique pour un avis.

**Réponse** :
```json
{
  "success": true,
  "reply": "Bonjour Michel, Merci beaucoup pour votre avis positif...",
  "type": "personnalisée",
  "generated": true
}
```

### POST `/business/locations/:locationId/reviews/:reviewId/reply`
Envoie la réponse (automatique ou manuelle) à Google Business.

## 📊 Types de réponses

- `personnalisée` : Réponse adaptée au contenu de l'avis
- `générique` : Réponse standard de remerciement
- `neutre` : Réponse neutre ouverte au dialogue
- `générique considération` : Réponse pour avis négatif sans commentaire
- `fallback` : Réponse de secours si l'API échoue

## ⚠️ Notes importantes

1. Les réponses sont limitées à 350 caractères (limite Google Business)
2. Le système détecte automatiquement la langue de l'avis et répond dans la même langue
3. En cas d'erreur API, une réponse de fallback est générée
4. Vous pouvez toujours modifier la réponse générée avant de l'envoyer

