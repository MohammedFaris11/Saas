# Activer le Mode Test pour "Add Location"

## ✅ Modifications apportées

Le middleware `isLoggedIn` a été modifié pour permettre l'accès en mode test même sans authentification réelle. Cela permet d'utiliser "Add Location" avec les données mock.

## 🔧 Configuration requise dans Vercel

Pour que "Add Location" fonctionne avec les données de test, vous **DEVEZ** ajouter la variable d'environnement suivante dans Vercel :

### Pour le Backend :

1. Allez sur : https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables

2. Ajoutez la variable suivante :
   ```
   USE_MOCK_DATA=true
   ```

3. **Redéployez** le backend après avoir ajouté la variable.

## 📊 Données de test disponibles

Une fois `USE_MOCK_DATA=true` activé, vous aurez accès à **10 entreprises de test** :

1. **Restaurant Le Gourmet** - 123 Rue de la Gastronomie, 75001 Paris
2. **Café Parisien** - 45 Avenue des Cafés, 75006 Paris
3. **Hôtel Magnifique** - 789 Boulevard de l'Hospitalité, 75008 Paris
4. **Spa Relaxation** - 321 Rue du Bien-être, 75016 Paris
5. **Boutique Mode Élégante** - 654 Avenue de la Mode, 75002 Paris
6. **Salon de Coiffure Modern** - 89 Rue de la Beauté, 75003 Paris
7. **Pizzeria Italiana** - 156 Boulevard Italie, 75011 Paris
8. **Salle de Sport Fitness Pro** - 234 Rue du Sport, 75012 Paris
9. **Clinique Vétérinaire Animaux** - 567 Avenue des Animaux, 75014 Paris
10. **Boulangerie Artisanale** - 78 Rue du Pain, 75015 Paris

Chaque entreprise a **plus de 10 000 avis** (entre 10 000 et 15 000) avec des commentaires variés (positifs, négatifs, neutres).

## 🎯 Comment utiliser "Add Location"

1. **Ouvrez le dashboard** : `/dashboard`
2. **Cliquez sur "Add Location"** (bouton bleu avec l'icône +)
3. **Recherchez** une des 10 entreprises dans la liste
4. **Cliquez sur "Add"** pour suivre une entreprise
5. Les entreprises suivies apparaîtront dans votre dashboard avec leurs reviews

## ⚠️ Notes importantes

- En mode test, l'authentification est simulée (utilisateur mock : `demo@example.com`)
- Les locations suivies sont stockées en mémoire (seront perdues après redéploiement)
- Les reviews sont générées dynamiquement avec des données variées
- Le mode test fonctionne avec le frontend en mode "skip login"

## 🔄 Activer/Désactiver le mode test

- **Activer** : Ajoutez `USE_MOCK_DATA=true` dans Vercel
- **Désactiver** : Retirez la variable ou mettez `USE_MOCK_DATA=false`
- **Important** : Redéployez toujours le backend après modification

