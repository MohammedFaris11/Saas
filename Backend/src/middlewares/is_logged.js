


const isLoggedIn = (req, res, next) => {
    // Mode test : si USE_MOCK_DATA est activé et qu'il n'y a pas d'utilisateur,
    // créer un utilisateur mock pour permettre l'accès
    const TEST_MODE_VALUES = new Set(['true', '1', 'yes', 'on']);
    const USE_MOCK_DATA = (() => {
        const raw = process.env.USE_MOCK_DATA;
        if (!raw) return false;
        return TEST_MODE_VALUES.has(String(raw).trim().toLowerCase());
    })();

    if (req.user) {
        // Utilisateur authentifié réel
        return next();
    }

    if (USE_MOCK_DATA) {
        // Mode test : créer un utilisateur mock
        req.user = {
            id: 'demo-user',
            email: 'demo@example.com',
            displayName: 'Demo User',
            picture: undefined,
            accessToken: 'mock-token'
        };
        return next();
    }

    // Pas d'utilisateur et pas en mode test : refuser l'accès
    return res.sendStatus(401);
}

module.exports = {
    isLoggedIn
}