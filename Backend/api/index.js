// Point d'entrée pour Vercel Serverless Functions
const init = require("../src/server");

// Initialiser l'app Express une seule fois (singleton)
let app;

if (!app) {
    app = init(null, () => {
        console.log('Express app initialized for Vercel');
    });
}

// Vercel exporte le handler
module.exports = async (req, res) => {
    // Initialiser si pas encore fait
    if (!app) {
        app = init(null, () => {
            console.log('Express app initialized for Vercel');
        });
    }
    
    // Gérer la requête avec Express
    return app(req, res);
};

