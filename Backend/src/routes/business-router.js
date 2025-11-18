const { Router } = require("express");
const router = Router();
const GoogleBusinessService = require("../services/google-business-service");
const MockBusinessService = require("../services/mock-business-service");
const AutoReplyService = require("../services/auto-reply-service");
const { isLoggedIn } = require("../middlewares/is_logged");

// Stockage en mémoire des établissements suivis par utilisateur (à remplacer par une base de données en production)
const followedLocations = new Map(); // Map<userId, Set<locationId>>
const userLocationsCache = new Map(); // Map<userId, Map<locationId, { locationName, accountName, title?, address? }>>
const locationsListCache = new Map(); // Map<userId, { timestamp: number, locations: any[] }>

const CACHE_TTL_MS = 2 * 60 * 1000; // 2 minutes de cache pour limiter les appels API

function getOrCreateUserLocationCache(userId) {
    if (!userLocationsCache.has(userId)) {
        userLocationsCache.set(userId, new Map());
    }
    return userLocationsCache.get(userId);
}

function extractAccountName(locationName) {
    if (!locationName) return undefined;
    const parts = locationName.split('/');
    if (parts.length >= 2 && parts[0] === 'accounts') {
        return `${parts[0]}/${parts[1]}`;
    }
    if (parts.length >= 4 && parts[2] === 'locations') {
        return `${parts[0]}/${parts[1]}`;
    }
    return undefined;
}

function cacheLocationsForUser(userId, locations = []) {
    const cache = getOrCreateUserLocationCache(userId);
    locations.forEach(loc => {
        const rawId = loc.locationId || (typeof loc.name === 'string' ? loc.name.split('/').pop() : null) || loc.name;
        if (!rawId) {
            return;
        }
        const locationName = loc.name || `locations/${rawId}`;
        const accountName = loc.accountName || extractAccountName(locationName);
        const address = loc.address || (loc.storefrontAddress?.addressLines ? loc.storefrontAddress.addressLines.join(', ') : undefined);
        const title = loc.title || loc.businessName || loc.storefrontName || loc.locationName || loc.name;

        cache.set(rawId, {
            locationId: rawId,
            locationName,
            accountName,
            title,
            address
        });
    });
    return cache;
}

function getCachedLocationMetadata(userId, locationId) {
    return userLocationsCache.get(userId)?.get(locationId);
}

function isCacheEntryValid(entry) {
    if (!entry) {
        return false;
    }
    return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

function getCachedLocationsList(userId) {
    const entry = locationsListCache.get(userId);
    if (isCacheEntryValid(entry)) {
        return entry.locations;
    }
    return null;
}

function setCachedLocationsList(userId, locations) {
    locationsListCache.set(userId, {
        timestamp: Date.now(),
        locations: Array.isArray(locations) ? locations : []
    });
    cacheLocationsForUser(userId, locations);
}

function invalidateLocationsCache(userId) {
    locationsListCache.delete(userId);
}

async function resolveLocationMetadata(req, businessService, locationId) {
    const userId = getUserId(req);
    let metadata = getCachedLocationMetadata(userId, locationId);

    if (metadata) {
        return metadata;
    }

    try {
        const cached = getCachedLocationsList(userId);
        let allLocations = cached;

        if (!allLocations) {
            allLocations = await businessService.getAllLocations();
            setCachedLocationsList(userId, allLocations);
        } else {
            cacheLocationsForUser(userId, allLocations);
        }

        const cache = cacheLocationsForUser(userId, allLocations);
        metadata = cache.get(locationId);
        if (metadata) {
            return metadata;
        }
    } catch (error) {
        console.error(`Erreur lors de la résolution de l'établissement ${locationId} pour ${userId}:`, error);
    }

    return {
        locationId,
        locationName: `locations/${locationId}`,
        accountName: undefined
    };
}

// Mode test : utiliser des données mock au lieu de l'API Google Business réelle
// Activez-le en définissant USE_MOCK_DATA=true dans votre fichier .env
const TEST_MODE_VALUES = new Set(['true', '1', 'yes', 'on']);
const USE_MOCK_DATA = (() => {
    const raw = process.env.USE_MOCK_DATA;
    if (raw === undefined || raw === null) {
        return false;
    }
    return TEST_MODE_VALUES.has(String(raw).trim().toLowerCase());
})();

// Partager une instance unique du service mock pour conserver des données stables entre les requêtes
const sharedMockBusinessService = USE_MOCK_DATA ? new MockBusinessService() : null;

// Fonction pour obtenir un identifiant utilisateur stable
// Utilise l'email de la session actuelle, mais pourrait être amélioré pour supporter plusieurs comptes
function getUserId(req) {
    return req.user?.email || req.user?.id || 'anonymous';
}

// Fonction pour obtenir le service Business approprié (mock ou réel)
function getBusinessService(req) {
    if (USE_MOCK_DATA) {
        return sharedMockBusinessService;
    } else {
        if (!req.user || !req.user.accessToken) {
            throw new Error('Token d\'accès non disponible. Veuillez vous reconnecter.');
        }
        return new GoogleBusinessService(req.user.accessToken);
    }
}

/**
 * Récupère tous les établissements Google Business de l'utilisateur connecté
 */
router.get('/locations', isLoggedIn, async (req, res) => {
    try {
        const businessService = getBusinessService(req);
        const userId = getUserId(req);

        let locations = getCachedLocationsList(userId);

        if (!locations) {
            locations = await businessService.getAllLocations();
            setCachedLocationsList(userId, locations);
        } else {
            cacheLocationsForUser(userId, locations);
        }

        // Ajouter l'état "suivi" pour chaque établissement
        const followed = followedLocations.get(userId) || new Set();
        
        const locationsWithStatus = locations.map(loc => {
            const locationId = loc.name?.split('/').pop() || loc.name;
            // Mapper l'adresse depuis storefrontAddress
            let address = loc.address;
            if (!address && loc.storefrontAddress && loc.storefrontAddress.addressLines) {
                address = loc.storefrontAddress.addressLines.join(', ');
            }
            return {
                ...loc,
                locationId: locationId,
                reviewCount: loc.totalReviewCount || loc.reviewCount || 0, // Mapper totalReviewCount vers reviewCount
                address: address, // Mapper l'adresse
                isFollowed: followed.has(locationId)
            };
        });

        res.json({
            success: true,
            locations: locationsWithStatus,
            count: locationsWithStatus.length
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des établissements:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la récupération des établissements'
        });
    }
});

/**
 * Récupère uniquement les établissements suivis par l'utilisateur
 */
router.get('/locations/followed', isLoggedIn, async (req, res) => {
    try {
        const userId = getUserId(req);
        const followed = followedLocations.get(userId) || new Set();

        if (followed.size === 0) {
            return res.json({
                success: true,
                locations: [],
                count: 0
            });
        }

        const businessService = getBusinessService(req);
        let allLocations = getCachedLocationsList(userId);

        if (!allLocations) {
            allLocations = await businessService.getAllLocations();
            setCachedLocationsList(userId, allLocations);
        } else {
            cacheLocationsForUser(userId, allLocations);
        }

        // Filtrer pour ne garder que les établissements suivis
        const followedLocationsList = allLocations.filter(loc => {
            const locationId = loc.name?.split('/').pop() || loc.name;
            return followed.has(locationId);
        }).map(loc => {
            // Mapper l'adresse depuis storefrontAddress
            let address = loc.address;
            if (!address && loc.storefrontAddress && loc.storefrontAddress.addressLines) {
                address = loc.storefrontAddress.addressLines.join(', ');
            }
            return {
                ...loc,
                locationId: loc.name?.split('/').pop() || loc.name,
                reviewCount: loc.totalReviewCount || loc.reviewCount || 0, // Mapper totalReviewCount vers reviewCount
                address: address, // Mapper l'adresse
                isFollowed: true
            };
        });

        res.json({
            success: true,
            locations: followedLocationsList,
            count: followedLocationsList.length
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des établissements suivis:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la récupération des établissements suivis'
        });
    }
});

/**
 * Ajouter un établissement à la liste des suivis
 * Un utilisateur peut suivre plusieurs établissements
 */
router.post('/locations/:locationId/follow', isLoggedIn, async (req, res) => {
    try {
        const { locationId } = req.params;
        const userId = getUserId(req);

        let metadata = getCachedLocationMetadata(userId, locationId);
        if (!metadata) {
            try {
                const businessService = getBusinessService(req);
                let allLocations = getCachedLocationsList(userId);
                if (!allLocations) {
                    allLocations = await businessService.getAllLocations();
                    setCachedLocationsList(userId, allLocations);
                } else {
                    cacheLocationsForUser(userId, allLocations);
                }
                const cache = cacheLocationsForUser(userId, allLocations);
                metadata = cache.get(locationId);
            } catch (fetchError) {
                console.error(`Erreur lors de l'actualisation du cache des établissements pour ${userId}:`, fetchError);
            }
        }

        if (!metadata) {
            return res.status(404).json({
                success: false,
                error: 'Établissement introuvable ou non accessible avec ce compte'
            });
        }

        // Initialiser le Set pour cet utilisateur s'il n'existe pas
        if (!followedLocations.has(userId)) {
            followedLocations.set(userId, new Set());
        }

        const userFollowedSet = followedLocations.get(userId);
        
        // Vérifier si l'établissement est déjà suivi
        if (userFollowedSet.has(locationId)) {
            return res.json({
                success: true,
                message: 'Cet établissement est déjà suivi',
                locationId: locationId,
                alreadyFollowed: true
            });
        }

        // Ajouter l'établissement au Set (permet plusieurs établissements par compte)
        userFollowedSet.add(locationId);

        invalidateLocationsCache(userId);

        res.json({
            success: true,
            message: 'Établissement ajouté avec succès',
            locationId: locationId,
            locationName: metadata.locationName,
            totalFollowed: userFollowedSet.size,
            alreadyFollowed: false
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'établissement:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de l\'ajout de l\'établissement'
        });
    }
});

/**
 * Retirer un établissement de la liste des suivis
 * L'utilisateur peut toujours avoir d'autres établissements suivis
 */
router.delete('/locations/:locationId/follow', isLoggedIn, async (req, res) => {
    try {
        const { locationId } = req.params;
        const userId = getUserId(req);

        let removed = false;
        if (followedLocations.has(userId)) {
            const userFollowedSet = followedLocations.get(userId);
            removed = userFollowedSet.delete(locationId);
            
            // Si plus aucun établissement suivi, on peut garder le Set vide ou le supprimer
            // On garde le Set vide pour permettre de réajouter facilement
        }

        invalidateLocationsCache(userId);

        const remainingCount = followedLocations.get(userId)?.size || 0;

        res.json({
            success: true,
            message: removed ? 'Établissement retiré avec succès' : 'Établissement non trouvé dans la liste',
            locationId: locationId,
            totalFollowed: remainingCount,
            removed: removed
        });
    } catch (error) {
        console.error('Erreur lors du retrait de l\'établissement:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors du retrait de l\'établissement'
        });
    }
});

/**
 * Déconnecter complètement Google Business (retirer tous les établissements)
 * Un utilisateur peut avoir plusieurs établissements, cette action les retire tous
 */
router.post('/disconnect', isLoggedIn, async (req, res) => {
    try {
        const userId = getUserId(req);
        
        // Compter combien d'établissements étaient suivis avant la suppression
        const previousCount = followedLocations.get(userId)?.size || 0;
        
        // Retirer tous les établissements suivis pour cet utilisateur
        followedLocations.delete(userId);
        userLocationsCache.delete(userId);
        invalidateLocationsCache(userId);

        res.json({
            success: true,
            message: `${previousCount} établissement${previousCount > 1 ? 's' : ''} déconnecté${previousCount > 1 ? 's' : ''} avec succès`,
            removedCount: previousCount
        });
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la déconnexion'
        });
    }
});

/**
 * Récupère les comptes Google Business de l'utilisateur
 */
router.get('/accounts', isLoggedIn, async (req, res) => {
    try {
        const businessService = getBusinessService(req);
        const accounts = await businessService.getAccounts();

        res.json({
            success: true,
            accounts: accounts
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des comptes:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la récupération des comptes'
        });
    }
});

/**
 * Récupère les avis pour un établissement spécifique
 */
router.get('/locations/:locationId/reviews', isLoggedIn, async (req, res) => {
    try {
        const { locationId } = req.params;
        const businessService = getBusinessService(req);
        const metadata = await resolveLocationMetadata(req, businessService, locationId);
        const reviews = await businessService.getReviews(metadata.locationName);

        res.json({
            success: true,
            reviews: reviews,
            count: reviews.length
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des avis:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la récupération des avis'
        });
    }
});

/**
 * Générer une réponse automatique pour un avis
 */
router.post('/locations/:locationId/reviews/:reviewId/generate-reply', isLoggedIn, async (req, res) => {
    try {
        const { locationId, reviewId } = req.params;

        // Récupérer l'avis
        const businessService = getBusinessService(req);
        const metadata = await resolveLocationMetadata(req, businessService, locationId);
        const reviews = await businessService.getReviews(metadata.locationName);
        
        const review = reviews.find(r => 
            (r.reviewId || r.name?.split('/').pop()) === reviewId
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Avis non trouvé'
            });
        }

        // Générer la réponse automatique
        const autoReply = await AutoReplyService.generateAutoReply(review);

        res.json({
            success: true,
            reply: autoReply.reply,
            type: autoReply.type,
            generated: autoReply.generated
        });
    } catch (error) {
        console.error('Erreur lors de la génération de la réponse automatique:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la génération de la réponse automatique'
        });
    }
});

/**
 * Répondre à un avis
 */
router.post('/locations/:locationId/reviews/:reviewId/reply', isLoggedIn, async (req, res) => {
    try {
        const { locationId, reviewId } = req.params;
        const { comment } = req.body;

        if (!comment || !comment.trim()) {
            return res.status(400).json({
                success: false,
                error: 'Le commentaire de réponse est requis'
            });
        }

        const businessService = getBusinessService(req);
        const metadata = await resolveLocationMetadata(req, businessService, locationId);

        if (USE_MOCK_DATA) {
            // En mode mock, mettre à jour la review avec la réponse
            const reviews = await businessService.getReviews(metadata.locationName);
            
            const review = reviews.find(r => 
                (r.reviewId || r.name?.split('/').pop()) === reviewId
            );

            if (review) {
                // Mettre à jour la review avec la réponse
                review.reply = {
                    comment: comment.trim(),
                    updateTime: new Date().toISOString()
                };
            }

            return res.json({
                success: true,
                message: 'Réponse envoyée avec succès',
                reply: {
                    comment: comment.trim(),
                    updateTime: new Date().toISOString()
                }
            });
        }

        // Pour l'API réelle, utiliser Google Business Profile API
        if (!req.user || !req.user.accessToken) {
            return res.status(401).json({
                success: false,
                error: 'Token d\'accès non disponible. Veuillez vous reconnecter.'
            });
        }

        const reviewName = `${metadata.locationName}/reviews/${reviewId}`;

        // Utiliser l'API Google Business Profile pour répondre
        const { google } = require('googleapis');
        
        const mybusiness = google.mybusiness({
            version: 'v4',
            auth: businessService.oauth2Client
        });

        const response = await mybusiness.accounts.locations.reviews.updateReply({
            name: reviewName,
            requestBody: {
                reply: {
                    comment: comment.trim()
                }
            }
        });

        res.json({
            success: true,
            message: 'Réponse envoyée avec succès',
            reply: response.data.reply
        });
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la réponse:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de l\'envoi de la réponse'
        });
    }
});

/**
 * Récupère les données d'analytics basées sur les reviews réelles
 */
router.get('/analytics', isLoggedIn, async (req, res) => {
    try {
        const userId = getUserId(req);
        const followedSet = followedLocations.get(userId);
        
        if (!followedSet || followedSet.size === 0) {
            return res.json({
                success: true,
                analytics: {
                    totalReviews: 0,
                    averageRating: 0,
                    responseRate: 0,
                    pendingReviews: 0,
                    sentimentDistribution: {
                        positive: 0,
                        neutral: 0,
                        negative: 0
                    },
                    reviewsTrend: [],
                    responseRateTrend: [],
                    sentimentStats: [],
                    sentimentData: []
                }
            });
        }

        const businessService = getBusinessService(req);
        let locationCache = userLocationsCache.get(userId);

        if (!locationCache || locationCache.size === 0) {
            try {
                let allLocations = getCachedLocationsList(userId);
                if (!allLocations) {
                    allLocations = await businessService.getAllLocations();
                    setCachedLocationsList(userId, allLocations);
                } else {
                    cacheLocationsForUser(userId, allLocations);
                }
                locationCache = cacheLocationsForUser(userId, allLocations);
            } catch (cacheError) {
                console.error(`Erreur lors du chargement du cache des établissements pour ${userId}:`, cacheError);
                locationCache = getOrCreateUserLocationCache(userId);
            }
        }

        const allReviews = [];
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        // Récupérer toutes les reviews des locations suivies
        for (const locationId of followedSet) {
            try {
                const metadata = locationCache?.get(locationId);
                const locationName = metadata?.locationName || `locations/${locationId}`;
                const reviews = await businessService.getReviews(locationName);
                allReviews.push(...reviews.map(r => ({
                    ...r,
                    locationId: locationId
                })));
            } catch (err) {
                console.error(`Erreur lors de la récupération des reviews pour ${locationId}:`, err);
            }
        }

        // Calculer les statistiques de base
        const totalReviews = allReviews.length;
        let totalRating = 0;
        let ratedCount = 0;
        let repliedCount = 0;
        const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };

        // Grouper les reviews par date (7 derniers jours)
        const reviewsByDate = {};
        const responseRateByWeek = {};

        allReviews.forEach(review => {
            const rating = review.starRating ? parseInt(review.starRating) : 0;
            const reviewDate = review.createTime ? new Date(review.createTime) : new Date(review.updateTime || Date.now());
            
            // Calculer la moyenne
            if (rating > 0) {
                totalRating += rating;
                ratedCount++;
            }

            // Calculer le sentiment
            if (rating >= 4) {
                sentimentCounts.positive++;
            } else if (rating === 3) {
                sentimentCounts.neutral++;
            } else if (rating > 0) {
                sentimentCounts.negative++;
            }

            // Compter les réponses
            if (review.reply && review.reply.comment) {
                repliedCount++;
            }

            // Grouper par jour (7 derniers jours)
            if (reviewDate >= sevenDaysAgo) {
                const dateKey = reviewDate.toISOString().split('T')[0];
                if (!reviewsByDate[dateKey]) {
                    reviewsByDate[dateKey] = { total: 0, replied: 0 };
                }
                reviewsByDate[dateKey].total++;
                if (review.reply && review.reply.comment) {
                    reviewsByDate[dateKey].replied++;
                }
            }

            // Grouper par semaine (5 dernières semaines)
            if (reviewDate >= thirtyDaysAgo) {
                const weekNumber = Math.floor((now - reviewDate) / (7 * 24 * 60 * 60 * 1000));
                if (weekNumber < 5) {
                    if (!responseRateByWeek[weekNumber]) {
                        responseRateByWeek[weekNumber] = { total: 0, replied: 0 };
                    }
                    responseRateByWeek[weekNumber].total++;
                    if (review.reply && review.reply.comment) {
                        responseRateByWeek[weekNumber].replied++;
                    }
                }
            }
        });

        // Calculer la moyenne
        const averageRating = ratedCount > 0 ? totalRating / ratedCount : 0;

        // Calculer le taux de réponse
        const responseRate = totalReviews > 0 ? Math.round((repliedCount / totalReviews) * 100) : 0;

        // Calculer les reviews en attente
        const pendingReviews = totalReviews - repliedCount;

        // Formater les données de tendance (7 derniers jours)
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const reviewsTrend = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dateKey = date.toISOString().split('T')[0];
            const dayData = reviewsByDate[dateKey] || { total: 0, replied: 0 };
            reviewsTrend.push({
                date: daysOfWeek[date.getDay()],
                reviews: dayData.total,
                replied: dayData.replied
            });
        }

        // Formater les données de taux de réponse (5 dernières semaines)
        const responseRateTrend = [];
        for (let i = 4; i >= 0; i--) {
            const weekData = responseRateByWeek[i] || { total: 0, replied: 0 };
            const rate = weekData.total > 0 ? Math.round((weekData.replied / weekData.total) * 100) : 0;
            responseRateTrend.push({
                week: `Week ${5 - i}`,
                rate: rate
            });
        }

        // Calculer les statistiques de sentiment
        const totalSentiment = sentimentCounts.positive + sentimentCounts.neutral + sentimentCounts.negative;
        const sentimentStats = [
            {
                label: "Positive",
                value: sentimentCounts.positive,
                percentage: totalSentiment > 0 ? (sentimentCounts.positive / totalSentiment) * 100 : 0
            },
            {
                label: "Neutral",
                value: sentimentCounts.neutral,
                percentage: totalSentiment > 0 ? (sentimentCounts.neutral / totalSentiment) * 100 : 0
            },
            {
                label: "Negative",
                value: sentimentCounts.negative,
                percentage: totalSentiment > 0 ? (sentimentCounts.negative / totalSentiment) * 100 : 0
            }
        ];

        // Données pour le graphique en camembert
        const sentimentData = [
            { name: "Positive (4-5★)", value: sentimentCounts.positive },
            { name: "Neutral (3★)", value: sentimentCounts.neutral },
            { name: "Negative (1-2★)", value: sentimentCounts.negative }
        ];

        res.json({
            success: true,
            analytics: {
                totalReviews,
                averageRating: parseFloat(averageRating.toFixed(1)),
                responseRate,
                pendingReviews,
                sentimentDistribution: sentimentCounts,
                reviewsTrend,
                responseRateTrend,
                sentimentStats,
                sentimentData
            }
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des analytics:', error);
        res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors de la récupération des analytics'
        });
    }
});

/**
 * Vérifie si l'utilisateur a connecté Google Business
 */
router.get('/status', isLoggedIn, async (req, res) => {
    try {
        // En mode mock, on simule toujours une connexion réussie
        if (USE_MOCK_DATA) {
            const userId = getUserId(req);
            const followedSet = followedLocations.get(userId);
            const followedCount = followedSet ? followedSet.size : 0;
            
            return res.json({
                connected: true,
                accountsCount: 1,
                followedLocationsCount: followedCount,
                followedLocationIds: followedSet ? Array.from(followedSet) : [],
                message: followedCount > 0 
                    ? `Vous suivez ${followedCount} établissement${followedCount > 1 ? 's' : ''} (Mode test)`
                    : 'Aucun établissement suivi pour le moment (Mode test)',
                isMockMode: true
            });
        }

        if (!req.user || !req.user.accessToken) {
            return res.json({
                connected: false,
                message: 'Aucun token d\'accès disponible'
            });
        }

        // Tester la connexion en récupérant les comptes
        const businessService = getBusinessService(req);
        const accounts = await businessService.getAccounts();

        const userId = getUserId(req);
        const followedSet = followedLocations.get(userId);
        const followedCount = followedSet ? followedSet.size : 0;
        const followedIds = followedSet ? Array.from(followedSet) : [];

        res.json({
            connected: true,
            accountsCount: accounts.accounts ? accounts.accounts.length : 0,
            followedLocationsCount: followedCount,
            followedLocationIds: followedIds,
            message: followedCount > 0 
                ? `Vous suivez ${followedCount} établissement${followedCount > 1 ? 's' : ''}`
                : 'Aucun établissement suivi pour le moment'
        });
    } catch (error) {
        res.json({
            connected: false,
            error: error.message
        });
    }
});

module.exports = router;
