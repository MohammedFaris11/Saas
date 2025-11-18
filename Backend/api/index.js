// Point d'entrée pour Vercel Serverless Functions
// Wrapper try-catch pour éviter les crashes au chargement du module
let app;
let init;

try {
    init = require("../src/server");
    
    // Initialiser l'app Express une seule fois (singleton)
    if (!app) {
        app = init(null, () => {
            console.log('Express app initialized for Vercel');
        });
    }
} catch (error) {
    console.error('❌ ERREUR lors du chargement du serveur:', error.message);
    console.error('Stack:', error.stack);
    // Créer une app Express minimale pour éviter le crash complet
    const express = require("express");
    app = express();
    app.use(express.json());
    app.get('*', (req, res) => {
        res.status(500).json({
            error: 'Server initialization failed',
            message: error.message
        });
    });
}

// Vercel exporte le handler
module.exports = async (req, res) => {
    try {
        // Initialiser si pas encore fait
        if (!app && init) {
            app = init(null, () => {
                console.log('Express app initialized for Vercel');
            });
        }
        
        if (!app) {
            return res.status(500).json({
                error: 'Server not initialized',
                message: 'Unable to initialize Express server'
            });
        }
        
        // Gérer la requête avec Express
        return app(req, res);
    } catch (error) {
        console.error('❌ ERREUR dans le handler Vercel:', error.message);
        console.error('Stack:', error.stack);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};

