# Configuration Google Gemini pour Ansview

## 🎯 Configuration rapide

Le système Ansview utilise **Google Gemini** pour générer les réponses automatiques aux avis Google Business.

## 📝 Étapes de configuration

### 1. Obtenir une clé API Gemini

1. Allez sur : https://makersuite.google.com/app/apikey
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Create API Key"**
4. Copiez la clé API générée

### 2. Configurer la clé dans le projet

Ajoutez la clé dans votre fichier `.env` à la racine du dossier `backend` :

```env
GEMINI_API_KEY=votre_clé_api_ici
```

### 3. Redémarrer le serveur

Après avoir ajouté la clé, redémarrez le serveur backend :

```bash
cd backend
npm start
```

Vous devriez voir dans les logs :
```
✅ Service de réponses automatiques initialisé avec Gemini
```

## 🔍 Vérification

Pour vérifier que Gemini fonctionne :

1. Connectez-vous à l'application
2. Sélectionnez un établissement
3. Cliquez sur "Répondre" sur un avis
4. Cliquez sur "Réponse automatique"
5. La réponse devrait être générée automatiquement

## ⚙️ Modèle utilisé

Le système utilise :
- **Modèle** : `gemini-2.0-flash`
- **Temperature** : 0.7 (équilibre créativité/cohérence)
- **Max tokens** : 200 (limite pour garder les réponses concises)

## 🛠️ Dépannage

### Erreur : "GEMINI_API_KEY non définie"
- Vérifiez que la clé est bien dans le fichier `.env`
- Vérifiez qu'il n'y a pas d'espaces autour de la clé
- Redémarrez le serveur

### Erreur : "Invalid API key"
- Vérifiez que la clé est correcte
- Assurez-vous que la clé n'a pas expiré
- Créez une nouvelle clé si nécessaire

### Les réponses ne sont pas générées
- Vérifiez les logs du serveur pour voir les erreurs
- Vérifiez votre quota API Gemini
- Le système utilise automatiquement des réponses de fallback si Gemini échoue

## 📚 Documentation Gemini

- **Documentation officielle** : https://ai.google.dev/docs
- **API Reference** : https://ai.google.dev/api
- **Console API** : https://makersuite.google.com/app/apikey

## ✅ Le système est maintenant configuré pour utiliser Gemini !

