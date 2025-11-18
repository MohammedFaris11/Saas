const express = require("express");
const AuthRouter = require("./routes/auth-router")
const ChatbotRouter = require("./routes/chatbot.route");
const BusinessRouter = require("./routes/business-router");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require('./routes/auth');

function init(port, callback) {
    const app = express();
    
    // Déterminer les origines CORS autorisées (dev vs production)
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:5173"
    ].filter(Boolean); // Filtrer les valeurs null/undefined
    
    // Configuration CORS pour permettre les requêtes depuis le frontend (Next.js)
    app.use(cors({
        origin: allowedOrigins.length > 0 ? allowedOrigins : ["http://localhost:3000"],
        credentials: true
    }));
    
    // Détecter si on est en production (Vercel)
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
    
    // Configuration de session améliorée
    app.use(session({
        secret: process.env.SESSION_SECRET || "cats",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: isProduction, // HTTPS en production
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 24 heures
            sameSite: isProduction ? 'none' : 'lax' // Pour CORS en production
        }
    }));
    
    app.use(express.static('public'));
    app.use(passport.initialize())
    app.use(passport.session());

    app.use(express.json());
    


     app.get('/',(req,res)=>{
          res.send('<a href="/auth/google/">Authenticate with Google</a>')
     })

     app.use('/auth',AuthRouter);
     app.use('/chatbot', ChatbotRouter);
     app.use('/business', BusinessRouter);



    // Pour Vercel, ne pas appeler app.listen()
    if (port && callback) {
        app.listen(port, callback(port));
    }


    return app;
}
module.exports = init;
