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
if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
    console.error('❌ ERREUR: CLIENT_ID ou CLIENT_SECRET non défini!');
    console.error('CLIENT_ID:', process.env.CLIENT_ID ? '✅ Défini' : '❌ Non défini');
    console.error('CLIENT_SECRET:', process.env.CLIENT_SECRET ? '✅ Défini' : '❌ Non défini');
    console.error('Veuillez ajouter ces variables dans Vercel: Settings → Environment Variables');
}

const callbackURL = getCallbackURL();
console.log('🔗 Callback URL configuré:', callbackURL);

try {
    passport.use(new GoogleStrategy({

         clientID:process.env.CLIENT_ID,
         clientSecret:process.env.CLIENT_SECRET,
         callbackURL: callbackURL,
         passReqToCallback:true
         },
     (request, accessToken, refreshToken, profile, done)=>{
          // Sauvegarder les tokens dans le profile pour accéder à Google Business Profile API
          profile.accessToken = accessToken;
          profile.refreshToken = refreshToken;
          return done(null, profile);
     }
    ));
    console.log('✅ Passport Google Strategy configuré avec succès');
} catch (error) {
    console.error('❌ ERREUR lors de la configuration de Passport:', error);
    throw error;
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

