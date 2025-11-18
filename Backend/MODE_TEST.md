# Mode Test - Utilisation de données fictives

## 🧪 Mode Test (désactivé par défaut)

Par défaut, l'application utilise l'**API Google Business Profile réelle**. Vous pouvez toutefois activer un mode test qui s'appuie sur des **données fictives** pour tester l'application sans compte Google Business.

## ✅ Fonctionnalités disponibles en mode test

- ✅ Voir des établissements fictifs
- ✅ Ajouter/suivre des établissements
- ✅ Voir les avis des établissements
- ✅ Filtrer les avis (tous, répondus, non répondus)
- ✅ Rechercher des établissements

## 📊 Données fictives incluses

### 10 Établissements de test :
1. **Restaurant Le Gourmet** - Restaurant gastronomique
2. **Café Parisien** - Café et pâtisserie
3. **Hôtel Magnifique** - Hôtel de luxe
4. **Spa Relaxation** - Centre de bien-être
5. **Boutique Mode Élégante** - Boutique de vêtements
6. **Salon de Coiffure Modern** - Salon de coiffure
7. **Pizzeria Italiana** - Restaurant italien
8. **Salle de Sport Fitness Pro** - Salle de sport
9. **Clinique Vétérinaire Animaux** - Clinique vétérinaire
10. **Boulangerie Artisanale** - Boulangerie

### Avis fictifs inclus :
- **Plus de 10 000 avis par entreprise** (entre 10 000 et 15 000 avis aléatoirement)
- **Grande variété de commentaires** : positifs, négatifs, neutres
- **Différents types d'avis** :
  - Avis avec commentaires longs et détaillés
  - Avis avec commentaires courts
  - Avis avec emojis
  - Avis sans commentaires (ratings uniquement)
- **Réponses aux avis** : environ 35% des avis ont une réponse
- **Distribution des notes** :
  - 50% de 5 étoiles
  - 25% de 4 étoiles
  - 10% de 3 étoiles
  - 8% de 2 étoiles
  - 7% de 1 étoile
- **Dates variées** : avis répartis sur les 2 dernières années
- **Plus de 50 commentaires positifs différents**
- **Plus de 40 commentaires négatifs différents**
- **Plus de 30 commentaires neutres différents**

## 🔧 Comment activer le mode test

Pour utiliser les données fictives :

1. **Variable d'environnement**
   - Ajoutez dans votre fichier `.env` à la racine du dossier `backend` :
     ```
     USE_MOCK_DATA=true   # valeurs acceptées : true, 1, yes, on
     ```
   - Redémarrez le serveur backend.

2. **Sans fichier `.env`**
   - Exportez la variable d'environnement avant de lancer le serveur :
     ```bash
     set USE_MOCK_DATA=true # Windows PowerShell
     export USE_MOCK_DATA=true # macOS / Linux
     ```
   - Puis démarrez le backend.

## 🚀 Comment tester

1. **Connectez-vous** avec votre compte Google (via OAuth)
2. Les établissements fictifs apparaîtront automatiquement
3. Vous pouvez :
   - Cliquer sur "Suivre" pour ajouter des établissements à votre liste
   - Cliquer sur "Voir les avis" pour voir les avis fictifs
   - Utiliser les filtres pour trier les avis
   - Rechercher des établissements

## 📝 Notes importantes

- Les établissements suivis sont conservés même en mode test
- Les données sont générées en mémoire et seront perdues au redémarrage du serveur
- **⚠️ Temps de génération** : La génération de plus de 10 000 avis par entreprise peut prendre quelques secondes au démarrage du serveur (génération en batch optimisée)
- Le mode test est activé via la variable d'environnement `USE_MOCK_DATA=true`
- Les statistiques (rating moyen, nombre d'avis) sont calculées automatiquement à partir des avis générés

## 🔄 Retour à l'API réelle

Quand vous serez prêt à utiliser l'API Google Business Profile réelle :
1. Assurez-vous d'avoir un compte Google Business
2. Configurez OAuth dans Google Cloud Console
3. Activez l'API Google Business Profile
4. Désactivez le mode test (retirez `USE_MOCK_DATA` ou mettez-le à `false`)
5. Redémarrez le serveur backend

