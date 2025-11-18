const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth2').Strategy;
let dotenv = require('dotenv').config()

// Déterminer l'URL du callback dynamiquement
const getCallbackURL = () => {
    // En production (Vercel), utiliser l'URL de l'environnement
    if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}/auth/google/callback`;
    }
    // Si BACKEND_URL est défini, l'utiliser
    if (process.env.BACKEND_URL) {
        return `${process.env.BACKEND_URL}/auth/google/callback`;
    }
    // Sinon, utiliser localhost par défaut
    return process.env.CALLBACK_URL || "http://localhost:3001/auth/google/callback";
};

// Fonction pour configurer Passport de manière sécurisée
function configurePassport() {
    // Vérifier que les variables d'environnement sont définies et non vides
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;
    
    // Vérifications strictes
    const hasClientId = clientId && typeof clientId === 'string' && clientId.trim().length > 0;
    const hasClientSecret = clientSecret && typeof clientSecret === 'string' && clientSecret.trim().length > 0;

    // Logs détaillés pour debugging
    console.log('🔍 Vérification des variables d\'environnement OAuth...');
    console.log('CLIENT_ID existe:', !!clientId, typeof clientId, clientId ? `longueur: ${clientId.length}` : 'undefined');
    console.log('CLIENT_SECRET existe:', !!clientSecret, typeof clientSecret, clientSecret ? `longueur: ${clientSecret.length}` : 'undefined');

    if (!hasClientId || !hasClientSecret) {
        console.error('❌ ERREUR: Variables d\'environnement OAuth manquantes ou invalides!');
        console.error('CLIENT_ID:', hasClientId ? `✅ Défini (${clientId.substring(0, 10)}...)` : '❌ NON DÉFINI ou VIDE');
        console.error('CLIENT_SECRET:', hasClientSecret ? '✅ Défini (***)' : '❌ NON DÉFINI ou VIDE');
        console.error('📍 Vérifiez que les variables sont bien définies dans Vercel:');
        console.error('   https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables');
        console.error('⚠️  Le backend démarrera mais OAuth ne fonctionnera pas.');
        console.error('💡 Après avoir ajouté les variables, vous DEVEZ redéployer le backend.');
        return false;
    }

    console.log('✅ Variables d\'environnement OAuth détectées');
    console.log(`   CLIENT_ID: ${clientId.substring(0, 10)}...`);

    const callbackURL = getCallbackURL();
    console.log('🔗 Callback URL configuré:', callbackURL);

    // Configurer Passport avec vérification supplémentaire
    try {
        // Vérification finale avant de créer la stratégie
        if (!clientId || !clientSecret) {
            throw new Error('CLIENT_ID ou CLIENT_SECRET est null ou undefined');
        }

        passport.use(new GoogleStrategy({
             clientID: clientId.trim(),
             clientSecret: clientSecret.trim(),
             callbackURL: callbackURL,
             passReqToCallback: true
         },
         (request, accessToken, refreshToken, profile, done) => {
             // Sauvegarder les tokens dans le profile pour accéder à Google Business Profile API
             profile.accessToken = accessToken;
             profile.refreshToken = refreshToken;
             return done(null, profile);
         }
        ));
        console.log('✅ Passport Google Strategy configuré avec succès');
        return true;
    } catch (error) {
        console.error('❌ ERREUR lors de la configuration de Passport:', error.message);
        console.error('Stack:', error.stack);
        console.error('⚠️  Le backend démarre mais OAuth ne fonctionnera pas.');
        return false;
    }
}

// Configurer Passport de manière sécurisée (ne pas throw d'erreur)
const passportConfigured = configurePassport();

if (!passportConfigured) {
    console.warn('⚠️  Passport Google Strategy NON configuré - variables manquantes');
    console.warn('⚠️  Les routes /auth/google retourneront une erreur 500');
}

// Exporter un indicateur pour savoir si Passport est configuré
module.exports.isPassportConfigured = passportConfigured;


passport.serializeUser((user,done)=>{
     // Sauvegarder les informations essentielles de l'utilisateur avec les tokens
     done(null, {
         id: user.id,
         displayName: user.displayName,
         email: user.email,
         picture: user.picture,
         accessToken: user.accessToken,
         refreshToken: user.refreshToken
     });
})

passport.deserializeUser((user,done)=>{
     // Restaurer l'utilisateur avec ses tokens
     done(null, user);
})

