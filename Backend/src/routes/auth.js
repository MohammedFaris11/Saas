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

// Vérifier que les variables d'environnement sont définies
const hasClientId = !!process.env.CLIENT_ID;
const hasClientSecret = !!process.env.CLIENT_SECRET;

if (!hasClientId || !hasClientSecret) {
    console.error('❌ ERREUR: Variables d\'environnement manquantes!');
    console.error('CLIENT_ID:', hasClientId ? '✅ Défini' : '❌ NON DÉFINI');
    console.error('CLIENT_SECRET:', hasClientSecret ? '✅ Défini' : '❌ NON DÉFINI');
    console.error('📍 Veuillez ajouter ces variables dans Vercel:');
    console.error('   https://vercel.com/simofaris2018-2330s-projects/vrs2-backend/settings/environment-variables');
    console.error('⚠️  L\'authentification Google ne fonctionnera pas sans ces variables.');
} else {
    console.log('✅ Variables d\'environnement OAuth détectées');
}

const callbackURL = getCallbackURL();
console.log('🔗 Callback URL configuré:', callbackURL);

// Ne configurer Passport que si les variables sont définies
if (hasClientId && hasClientSecret) {
    try {
        passport.use(new GoogleStrategy({
             clientID: process.env.CLIENT_ID,
             clientSecret: process.env.CLIENT_SECRET,
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
        throw error;
    }
} else {
    console.warn('⚠️  Passport Google Strategy NON configuré - variables manquantes');
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

