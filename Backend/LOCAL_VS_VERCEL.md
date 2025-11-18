# 🔄 Différence entre Développement Local et Vercel

## 📁 Structure des Fichiers

### Développement Local
- **Fichier** : `Backend/index.js`
- **Usage** : Pour tester en local avec `npm start`
- **Port** : 3001 (par défaut)
- **Command** : `node index.js` ou `npm start`

### Déploiement Vercel
- **Fichier** : `Backend/api/index.js`
- **Usage** : Point d'entrée pour Vercel Serverless Functions
- **Port** : Géré automatiquement par Vercel
- **Déploiement** : Automatique via `vercel --prod`

## 🔍 Différences Clés

### index.js (Local)
```javascript
const init = require("./src/server");

function main() {
    const PORT = process.env.PORT || 3001;
    let app = init(PORT, (port) => {
        console.log("app listening on port " + port)
    });
}

main();
```
- ✅ Démarre un serveur Express avec `app.listen()`
- ✅ Utilise un port fixe (3001)
- ✅ Utilisé pour le développement local

### api/index.js (Vercel)
```javascript
const init = require("../src/server");

let app;

module.exports = async (req, res) => {
    if (!app) {
        app = init(null, () => {
            console.log('Express app initialized for Vercel');
        });
    }
    return app(req, res);
};
```
- ✅ Exporte une fonction serverless (handler)
- ✅ Pas de `app.listen()` (géré par Vercel)
- ✅ Utilisé pour le déploiement Vercel

## 🧪 Tester le Backend

### En Local
```bash
cd Backend
npm start
# Le serveur démarre sur http://localhost:3001
```

### Sur Vercel
- **URL** : https://vrs2-backend-qe2lvsq9w-simofaris2018-2330s-projects.vercel.app/
- **Test** : Visitez l'URL dans votre navigateur
- **Attendu** : `<a href="/auth/google/">Authenticate with Google</a>`

## ⚙️ Variables d'Environnement

### Local (.env)
Créez un fichier `.env` dans `Backend/` :
```env
CLIENT_ID=votre_client_id
CLIENT_SECRET=votre_client_secret
SESSION_SECRET=une_chaine_secrete
```

### Vercel
Ajoutez les variables dans :
https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables

## 🔧 Commandes

### Développement Local
```bash
cd Backend
npm install
npm start
```

### Déploiement Vercel
```bash
cd Backend
vercel --prod
```

## 📝 Notes

- **index.js** est uniquement pour le développement local
- **api/index.js** est utilisé par Vercel automatiquement
- Vercel ignore `index.js` et utilise `api/index.js`
- Les deux fichiers utilisent le même `src/server.js`

## ✅ Vérification

Pour vérifier que le backend Vercel fonctionne :

1. Visitez : https://vrs2-backend-qe2lvsq9w-simofaris2018-2330s-projects.vercel.app/
2. Vous devriez voir : `<a href="/auth/google/">Authenticate with Google</a>`
3. Si vous voyez cette page, le backend fonctionne ! ✅

## ❌ Si vous voyez une erreur 500

Consultez :
- `Backend/SETUP_ENV_VARIABLES.md` - Pour configurer les variables d'environnement
- `Backend/FIX_500_ERROR.md` - Pour diagnostiquer les erreurs

