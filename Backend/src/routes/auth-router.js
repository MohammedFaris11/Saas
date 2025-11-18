const { Router } = require("express");
const router = Router()
const service = require("../services/auth-services")
const passport = require("passport")

const {isLoggedIn} = require("../middlewares/is_logged");
router.get('/protected',isLoggedIn,(req,res)=>{
     res.send("hello"+req.user.displayName)
})

// Endpoint pour vérifier l'état de connexion
router.get('/status', (req, res) => {
    if (req.user) {
        res.json({ 
            isAuthenticated: true, 
            user: {
                displayName: req.user.displayName,
                email: req.user.email,
                picture: req.user.picture
            },
            hasBusinessAccess: !!req.user.accessToken
        });
    } else {
        res.json({ isAuthenticated: false });
    }
});

router.get('/google', (req, res, next) => {
    // Vérifier que les variables d'environnement sont définies
    if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
        console.error('❌ Tentative d\'authentification Google sans variables d\'environnement');
        return res.status(500).json({
            success: false,
            error: 'Configuration OAuth manquante. CLIENT_ID et CLIENT_SECRET doivent être définis dans les variables d\'environnement Vercel.'
        });
    }
    passport.authenticate("google", {
        scope: ['email', 'profile', 'https://www.googleapis.com/auth/business.manage']
    })(req, res, next);
})


// Déterminer l'URL du frontend dynamiquement
const getFrontendURL = () => {
    // Si FRONTEND_URL est défini, l'utiliser
    if (process.env.FRONTEND_URL) {
        return process.env.FRONTEND_URL;
    }
    // Sinon, utiliser localhost par défaut
    return "http://localhost:3000";
};

router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: `${getFrontendURL()}/login` }), 
    (req, res) => {
      // Les établissements suivis sont conservés car ils sont stockés par userId (email)
      // Seul le token d'accès est mis à jour pour le nouveau compte connecté
      // Redirect to the desired page after successful authentication
      // Ajouter un paramètre pour indiquer qu'on vient de se reconnecter
      res.redirect(`${getFrontendURL()}/dashboard?reconnected=true`); // Your front-end URL
    }
  );
router.get('/logout', (req, res, next) => {
     req.logout((err) => {
         if (err) {
             return next(err); // Gère l'erreur proprement
         }
         req.session.destroy(() => {
             res.json({ success: true, message: "Déconnexion réussie" }); // Envoie la réponse après la destruction de session
         });
     });
 });
 

router.get('/failure',(req,res)=>{
     res.send('something went wrong');
});

// Stockage en mémoire des préférences utilisateur (à remplacer par une base de données en production)
const userSettings = new Map(); // Map<email, settings>

/**
 * Récupère les informations utilisateur et ses préférences
 */
router.get('/settings', isLoggedIn, (req, res) => {
    try {
        const userEmail = req.user?.email;
        
        if (!userEmail) {
            return res.status(400).json({
                success: false,
                error: 'Email utilisateur non disponible'
            });
        }

        // Récupérer les settings de l'utilisateur (ou valeurs par défaut)
        const settings = userSettings.get(userEmail) || {
            company: '',
            timezone: 'America/New_York',
            language: 'en',
            emailNotifications: true,
            autoApproveResponses: false,
            weeklySummary: true
        };

        res.json({
            success: true,
            user: {
                displayName: req.user.displayName,
                email: req.user.email,
                picture: req.user.picture
            },
            settings: settings
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des settings:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la récupération des settings'
        });
    }
});

/**
 * Met à jour les préférences utilisateur
 */
router.put('/settings', isLoggedIn, (req, res) => {
    try {
        const userEmail = req.user?.email;
        
        if (!userEmail) {
            return res.status(400).json({
                success: false,
                error: 'Email utilisateur non disponible'
            });
        }

        const { company, timezone, language, emailNotifications, autoApproveResponses, weeklySummary } = req.body;

        // Récupérer les settings existants ou créer de nouveaux
        const currentSettings = userSettings.get(userEmail) || {};
        
        // Mettre à jour les settings
        const updatedSettings = {
            ...currentSettings,
            company: company !== undefined ? company : currentSettings.company,
            timezone: timezone !== undefined ? timezone : currentSettings.timezone,
            language: language !== undefined ? language : (currentSettings.language || 'en'),
            emailNotifications: emailNotifications !== undefined ? emailNotifications : currentSettings.emailNotifications,
            autoApproveResponses: autoApproveResponses !== undefined ? autoApproveResponses : currentSettings.autoApproveResponses,
            weeklySummary: weeklySummary !== undefined ? weeklySummary : currentSettings.weeklySummary,
            updatedAt: new Date().toISOString()
        };

        // Sauvegarder les settings
        userSettings.set(userEmail, updatedSettings);

        res.json({
            success: true,
            message: 'Settings mis à jour avec succès',
            settings: updatedSettings
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des settings:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la mise à jour des settings'
        });
    }
});

module.exports = router;
