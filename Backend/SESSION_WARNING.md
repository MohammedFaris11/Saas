# ⚠️ Warning : MemoryStore Session Store

## Warning Actuel

```
Warning: connect.session() MemoryStore is not designed for a production environment, 
as it will leak memory, and will not scale past a single process.
```

## 🔍 Explication

Ce warning est **normal** pour les Serverless Functions de Vercel. Il apparaît car :

1. **MemoryStore** stocke les sessions en mémoire
2. Sur Vercel, chaque invocation serverless est un nouveau processus
3. Les sessions ne persistent pas entre les invocations

## ✅ Est-ce un Problème ?

**Pour le développement et les tests** : **Non**, ce n'est pas un problème critique.

**Pour la production** : C'est acceptable si :
- Vous utilisez `USE_MOCK_DATA=true` (données mock)
- Vous n'avez pas besoin de sessions persistantes
- Vous voulez tester rapidement

**Pour la production réelle** : Vous devriez utiliser un store externe.

## 💡 Solutions (Optionnelles)

### Option 1 : Utiliser Vercel KV (Recommandé pour Vercel)

```bash
npm install @vercel/kv connect-redis
```

### Option 2 : Utiliser MongoDB Session Store

```bash
npm install connect-mongo
```

### Option 3 : Utiliser JWT au lieu de Sessions

Utiliser des tokens JWT au lieu de sessions basées sur cookies.

## 📝 Pour Maintenant

**Vous pouvez ignorer ce warning** pour l'instant. Votre application fonctionne correctement.

- ✅ L'authentification Google fonctionne
- ✅ Les données mock sont générées (10 entreprises, 10 000+ avis chacune)
- ✅ Le backend répond correctement

Le warning n'affecte pas la fonctionnalité de base de l'application.

## 🔄 Si Vous Voulez Corriger Plus Tard

Consultez la documentation Vercel pour implémenter un store de sessions externe quand vous serez prêt pour la production.

---

**Note** : Pour les tests et le développement, ce warning est acceptable et n'affecte pas le fonctionnement de l'application.

