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

// Vérifier que les variables d'environnement sont définies et non vides
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const hasClientId = clientId && typeof clientId === 'string' && clientId.trim().length > 0;
const hasClientSecret = clientSecret && typeof clientSecret === 'string' && clientSecret.trim().length > 0;

if (!hasClientId || !hasClientSecret) {
    console.error('❌ ERREUR: Variables d\'environnement OAuth manquantes!');
    console.error('CLIENT_ID:', hasClientId ? `✅ Défini (${clientId.substring(0, 10)}...)` : '❌ NON DÉFINI ou VIDE');
    console.error('CLIENT_SECRET:', hasClientSecret ? '✅ Défini (***)' : '❌ NON DÉFINI ou VIDE');
    console.error('📍 Veuillez ajouter ces variables dans Vercel:');
    console.error('   https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables');
    console.error('⚠️  L\'authentification Google ne fonctionnera pas sans ces variables.');
    console.error('💡 Le backend continuera de fonctionner, mais /auth/google retournera une erreur.');
} else {
    console.log('✅ Variables d\'environnement OAuth détectées');
    console.log(`   CLIENT_ID: ${clientId.substring(0, 10)}...`);
}

const callbackURL = getCallbackURL();
console.log('🔗 Callback URL configuré:', callbackURL);

// Ne configurer Passport que si les variables sont définies et valides
if (hasClientId && hasClientSecret) {
    try {
        passport.use(new GoogleStrategy({
             clientID: clientId,
             clientSecret: clientSecret,
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
    } catch (error) {
        console.error('❌ ERREUR lors de la configuration de Passport:', error);
        console.error('Stack:', error.stack);
        // Ne pas throw l'erreur - permettre au serveur de démarrer même si OAuth n'est pas configuré
        console.error('⚠️  Le serveur démarre mais OAuth ne fonctionnera pas.');
    }
} else {
    console.warn('⚠️  Passport Google Strategy NON configuré - variables manquantes');
    console.warn('⚠️  Les routes /auth/google retourneront une erreur 500');
}


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

