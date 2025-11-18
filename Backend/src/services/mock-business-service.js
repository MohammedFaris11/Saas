/**
 * Service de données mock pour tester l'application sans compte Google Business réel
 * Utilisez ce service en mode développement/test
 */

class MockBusinessService {
    constructor() {
        // Données mock d'établissements - 10 entreprises différentes
        this.mockLocations = [
            {
                name: "locations/100000001",
                locationId: "100000001",
                title: "Restaurant Le Gourmet",
                rating: 4.7,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5"
                },
                storefrontAddress: {
                    addressLines: ["123 Rue de la Gastronomie", "75001 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            },
            {
                name: "locations/100000002",
                locationId: "100000002",
                title: "Café Parisien",
                rating: 4.3,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1559339352-11d035aa65de"
                },
                storefrontAddress: {
                    addressLines: ["45 Avenue des Cafés", "75006 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            },
            {
                name: "locations/100000003",
                locationId: "100000003",
                title: "Hôtel Magnifique",
                rating: 4.8,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1527751171053-6ac5ec50000b"
                },
                storefrontAddress: {
                    addressLines: ["789 Boulevard de l'Hospitalité", "75008 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            },
            {
                name: "locations/100000004",
                locationId: "100000004",
                title: "Spa Relaxation",
                rating: 4.5,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874"
                },
                storefrontAddress: {
                    addressLines: ["321 Rue du Bien-être", "75016 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            },
            {
                name: "locations/100000005",
                locationId: "100000005",
                title: "Boutique Mode Élégante",
                rating: 4.4,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1441986300917-64674bd600d8"
                },
                storefrontAddress: {
                    addressLines: ["654 Avenue de la Mode", "75002 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            },
            {
                name: "locations/100000006",
                locationId: "100000006",
                title: "Salon de Coiffure Modern",
                rating: 4.6,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1562322140-8baeececf3df"
                },
                storefrontAddress: {
                    addressLines: ["89 Rue de la Beauté", "75003 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            },
            {
                name: "locations/100000007",
                locationId: "100000007",
                title: "Pizzeria Italiana",
                rating: 4.5,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1513104890138-7c749659a591"
                },
                storefrontAddress: {
                    addressLines: ["156 Boulevard Italie", "75011 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            },
            {
                name: "locations/100000008",
                locationId: "100000008",
                title: "Salle de Sport Fitness Pro",
                rating: 4.2,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"
                },
                storefrontAddress: {
                    addressLines: ["234 Rue du Sport", "75012 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            },
            {
                name: "locations/100000009",
                locationId: "100000009",
                title: "Clinique Vétérinaire Animaux",
                rating: 4.9,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1551601651-2a8555f1a136"
                },
                storefrontAddress: {
                    addressLines: ["567 Avenue des Animaux", "75014 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            },
            {
                name: "locations/100000010",
                locationId: "100000010",
                title: "Boulangerie Artisanale",
                rating: 4.7,
                totalReviewCount: 0,
                primaryPhoto: {
                    photoUri: "https://images.unsplash.com/photo-1509440159596-0249088772ff"
                },
                storefrontAddress: {
                    addressLines: ["78 Rue du Pain", "75015 Paris", "France"]
                },
                accountName: "accounts/111111111111",
                accountDisplayName: "Mon Compte Business"
            }
        ];

        // Générer des reviews pour chaque location (plus de 10 000 par entreprise)
        console.log('Génération de plus de 10 000 avis par entreprise...');
        this.mockReviews = this.generateMockReviews();
        
        // Mettre à jour les statistiques des locations basées sur les reviews générées
        this.updateLocationStats();
        console.log('Génération terminée !');
    }

    /**
     * Génère des reviews mock (plus de 10 000 par location)
     */
    generateMockReviews() {
        const reviews = {};
        
        // Listes étendues de noms
        const firstNames = [
            "Michel", "Sophie", "Thomas", "Lucie", "Pierre", "Amélie", "Marc", "Isabelle",
            "Marie", "Jean", "Emma", "Robert", "Sarah", "David", "Claire", "Paul",
            "Julie", "Nicolas", "Camille", "Antoine", "Laura", "Julien", "Marine", "Alexandre",
            "Céline", "Maxime", "Émilie", "Vincent", "Caroline", "Olivier", "Audrey", "Sébastien",
            "Nathalie", "Romain", "Valérie", "Guillaume", "Stéphanie", "Fabien", "Catherine", "Laurent",
            "Patricia", "Jérôme", "Sylvie", "Christophe", "Nadine", "François", "Brigitte", "Philippe",
            "Monique", "Pascal", "Chantal", "Thierry", "Martine", "Didier", "Françoise", "Gérard",
            "Alex", "Léa", "Louis", "Chloé", "Hugo", "Manon", "Lucas", "Emma", "Léo", "Lola",
            "Noah", "Anna", "Ethan", "Zoé", "Marius", "Inès", "Gabriel", "Éva", "Raphaël", "Léonie",
            "Nathan", "Julia", "Timothée", "Louise", "Benjamin", "Charlotte", "Mathis", "Alice",
            "Arthur", "Mia", "Jules", "Éléonore", "Adam", "Agathe", "Antonin", "Apolline"
        ];
        
        const lastNames = [
            "Dupont", "Martin", "Bernard", "Dubois", "Lambert", "Rousseau", "Lefebvre", "Moreau",
            "Claire", "Dupuis", "Petit", "Wilson", "Chen", "Laurent", "Garcia", "Rodriguez",
            "Lopez", "Gonzalez", "Martinez", "Perez", "Sanchez", "Ramirez", "Torres", "Flores",
            "Rivera", "Gomez", "Diaz", "Cruz", "Morales", "Ortiz", "Gutierrez", "Chavez",
            "Ramos", "Reyes", "Mendoza", "Vargas", "Castillo", "Jimenez", "Moreno", "Alvarez",
            "Romero", "Herrera", "Medina", "Aguilar", "Garza", "Castro", "Vazquez", "Fernandez",
            "Simon", "Michel", "Leroy", "Roux", "David", "Bertrand", "Morel", "Fournier",
            "Girard", "Bonnet", "Dupuis", "Lambert", "Fontaine", "Rousseau", "Vincent", "Muller",
            "Lefevre", "Faure", "Andre", "Mercier", "Blanc", "Guerin", "Boyer", "Garnier"
        ];

        // Commentaires positifs très variés (50+ exemples)
        const positiveComments = [
            "Excellent service et qualité exceptionnelle. Je recommande vivement !",
            "Expérience parfaite, tout était au rendez-vous. Nous reviendrons certainement.",
            "Très satisfait de notre visite. Le personnel est attentionné et professionnel.",
            "Un véritable plaisir ! Tout était parfait, de l'accueil au service.",
            "Service impeccable et qualité au rendez-vous. Je recommande sans hésitation.",
            "Très bon établissement avec un personnel sympathique et compétent.",
            "Expérience exceptionnelle, nous avons été ravis de notre visite.",
            "Excellent rapport qualité-prix. Nous avons passé un excellent moment.",
            "Service de qualité et ambiance agréable. Parfait pour se détendre.",
            "Très satisfait, tout était parfait. Nous reviendrons avec plaisir.",
            "⭐⭐⭐⭐⭐ Incroyable ! Je n'ai jamais été aussi bien accueilli. À refaire absolument !",
            "Super expérience ! Le staff est aux petits soins et l'ambiance est géniale. Merci beaucoup !",
            "Parfait du début à la fin. Qualité irréprochable, je recommande les yeux fermés.",
            "Wow ! Dépassé toutes mes attentes. Service au top, équipe adorable. 10/10 !",
            "Excellente découverte ! Tout était parfait, je reviendrai très bientôt.",
            "Service client exemplaire ! Très professionnel et à l'écoute. Bravo !",
            "Qualité premium, prix raisonnable. Un véritable coup de cœur !",
            "Lieu magnifique avec un service irréprochable. Une expérience à vivre !",
            "Très bonne adresse ! L'équipe est passionnée et ça se sent.",
            "Exceptionnel ! Je n'hésiterai pas à revenir et à recommander à mes amis.",
            "Parfait pour une sortie en famille. Les enfants ont adoré !",
            "Un moment de pur bonheur. Merci pour cette expérience mémorable.",
            "Service rapide et efficace. Qualité constante à chaque visite.",
            "Ambiance chaleureuse et accueil impeccable. On se sent comme chez soi !",
            "Produits de qualité supérieure. Le meilleur rapport qualité-prix du quartier.",
            "Équipe dynamique et à l'écoute. Une adresse à retenir !",
            "Lieu moderne et design. Service au top, je recommande !",
            "Expérience unique ! Tout était parfait, du début à la fin.",
            "Très professionnel. Service rapide et de qualité. Parfait !",
            "Un must ! Je reviens régulièrement, toujours aussi satisfait.",
            "Qualité exceptionnelle, prix corrects. Que demander de plus ?",
            "Service client de niveau supérieur. Très impressionné !",
            "Excellent ! L'équipe est compétente et toujours de bonne humeur.",
            "Un vrai plaisir à chaque visite. Service irréprochable !",
            "Parfait pour une pause détente. Ambiance zen et service au top.",
            "Je recommande vivement ! Service impeccable et produits de qualité.",
            "Super accueil, équipe souriante. Une belle expérience !",
            "Qualité remarquable à chaque visite. Fidèle client depuis 2 ans.",
            "Service personnalisé et attentionné. On reviendra avec plaisir !",
            "Excellent établissement ! Tout est pensé pour le bien-être des clients.",
            "Un véritable bijou ! Qualité et service au rendez-vous.",
            "Parfait ! Rien à redire, tout était excellent.",
            "Service rapide et efficace. Qualité constante.",
            "Très bon établissement ! Je recommande sans hésitation.",
            "Expérience formidable ! Merci pour ce moment de qualité.",
            "Super ! L'équipe est à l'écoute et très professionnelle.",
            "Qualité premium pour un prix raisonnable. Parfait !",
            "Un coup de cœur ! Je reviendrai très bientôt.",
            "Service exemplaire. Une adresse à retenir absolument !"
        ];

        // Commentaires neutres variés (30+ exemples)
        const neutralComments = [
            "Correct sans plus. Le service était acceptable mais rien d'exceptionnel.",
            "Bien mais pourrait être amélioré. Certains points sont à revoir.",
            "Expérience moyenne. Rien de mauvais mais rien d'exceptionnel non plus.",
            "Correct pour le prix. Le service était correct mais pas exceptionnel.",
            "Bien mais il y a de la marge d'amélioration. Service correct.",
            "Moyen. Certains aspects sont bien, d'autres moins.",
            "Correct sans être exceptionnel. Service acceptable.",
            "Bien mais pourrait être mieux. Certains détails à améliorer.",
            "Pas mal, sans plus. Le service était correct mais pas extraordinaire.",
            "Assez bien. Rien de spécial à signaler, positif comme négatif.",
            "Correct. Service standard, ni plus ni moins.",
            "Acceptable. Rien à redire mais rien à vanter non plus.",
            "Moyen +. Correct mais avec de la marge d'amélioration.",
            "Bien sans être exceptionnel. Service correct.",
            "OK. Rien de spécial, service correct.",
            "Standard. Service correct pour le prix payé.",
            "Pas mal du tout. Rien d'exceptionnel mais correct.",
            "Correct pour ce que c'est. Service acceptable.",
            "Bien. Rien de négatif mais rien de mémorable non plus.",
            "Moyennement satisfait. Service correct.",
            "Assez correct. Service standard.",
            "OK sans plus. Service acceptable.",
            "Correct. Rien de spécial à mentionner.",
            "Bien mais pas exceptionnel. Service correct.",
            "Moyen. Service acceptable.",
            "Correct sans être remarquable.",
            "Service standard, ni bon ni mauvais.",
            "Acceptable. Rien de spécial."
        ];

        // Commentaires négatifs variés (40+ exemples)
        const negativeComments = [
            "Service décevant. L'attente était trop longue et le personnel peu attentionné.",
            "Déçu par la qualité. Le service ne correspondait pas à nos attentes.",
            "Service très lent et accueil froid. Dommage car le potentiel est là.",
            "Pas à la hauteur de nos attentes. Le service laissait à désirer.",
            "Décevant. Le service était médiocre et l'accueil peu chaleureux.",
            "Service insuffisant. Nous avons été déçus par la qualité.",
            "Pas satisfait. Le service ne correspondait pas à ce qui était annoncé.",
            "Décevant pour le prix demandé. Le service était moyen.",
            "Service très lent. Attente interminable pour un service moyen.",
            "Personnel peu aimable. Accueil froid et service bâclé.",
            "Qualité en dessous des attentes. Service médiocre.",
            "Très déçu. Le service ne correspondait pas aux avis lus.",
            "Service désorganisé. Attente trop longue pour un résultat moyen.",
            "Personnel peu professionnel. Service décevant.",
            "Pas à la hauteur. Qualité médiocre pour le prix demandé.",
            "Service insuffisant. Nous ne reviendrons pas.",
            "Très décevant. Attente interminable et service moyen.",
            "Personnel peu attentionné. Service bâclé.",
            "Qualité médiocre. Service en dessous des standards.",
            "Déçu par l'expérience. Service pas à la hauteur.",
            "Service très lent. Personnel peu réactif.",
            "Pas satisfait du tout. Service décevant.",
            "Très mauvais service. Nous ne recommandons pas.",
            "Service catastrophique. Attente trop longue.",
            "Personnel désagréable. Service médiocre.",
            "Qualité en dessous de zéro. Service inexistant.",
            "Très déçu. Service pas professionnel.",
            "Service bâclé. Personnel peu compétent.",
            "Pas à la hauteur des attentes. Service décevant.",
            "Service très mauvais. Nous ne reviendrons jamais.",
            "Personnel impoli. Service désastreux.",
            "Qualité décevante. Service médiocre.",
            "Service lent et inefficace. Très déçu.",
            "Personnel peu aimable. Service en dessous de la moyenne.",
            "Pas satisfait. Service pas professionnel.",
            "Service désorganisé. Très mauvais.",
            "Personnel peu attentionné. Service médiocre.",
            "Qualité médiocre. Service décevant.",
            "Service pas à la hauteur. Très déçu.",
            "Personnel désagréable. Service mauvais."
        ];

        // Réponses templates variées
        const replyTemplates = [
            "Merci pour votre retour ! Nous sommes ravis que vous ayez apprécié votre visite.",
            "Merci beaucoup pour votre avis positif ! Nous espérons vous revoir bientôt.",
            "Nous vous remercions pour votre commentaire. Votre satisfaction est notre priorité.",
            "Merci pour votre retour. Nous sommes heureux d'avoir répondu à vos attentes.",
            "Nous vous remercions pour votre avis. Nous sommes ravis de votre satisfaction.",
            "Merci pour votre commentaire. Nous apprécions votre retour et espérons vous revoir.",
            "Nous vous remercions pour votre avis. Votre satisfaction est importante pour nous.",
            "Merci pour votre retour positif. Nous sommes heureux d'avoir pu vous satisfaire.",
            "Merci pour votre avis ! Votre retour nous permet d'améliorer nos services.",
            "Nous vous remercions pour votre commentaire. À très bientôt !"
        ];

        // Pour chaque location
        for (const location of this.mockLocations) {
            const locationId = location.locationId;
            const locationReviews = [];
            
            // Générer entre 10 000 et 15 000 reviews par entreprise
            const numReviews = Math.floor(Math.random() * 5001) + 10000; // 10000-15000
            
            console.log(`Génération de ${numReviews} avis pour ${location.title}...`);
            
            // Générer les reviews par batch pour optimiser
            const batchSize = 1000;
            const numBatches = Math.ceil(numReviews / batchSize);
            
            for (let batch = 0; batch < numBatches; batch++) {
                const batchStart = batch * batchSize;
                const batchEnd = Math.min(batchStart + batchSize, numReviews);
                
                for (let i = batchStart; i < batchEnd; i++) {
                    // Générer un nom aléatoire
                    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                    const displayName = `${firstName} ${lastName}`;
                    
                    // Générer un rating (distribution réaliste mais variée selon le type)
                    let starRating;
                    const ratingRand = Math.random();
                    
                    // Distribution : 50% de 5 étoiles, 25% de 4 étoiles, 10% de 3 étoiles, 8% de 2 étoiles, 7% de 1 étoile
                    if (ratingRand < 0.5) {
                        starRating = 5;
                    } else if (ratingRand < 0.75) {
                        starRating = 4;
                    } else if (ratingRand < 0.85) {
                        starRating = 3;
                    } else if (ratingRand < 0.93) {
                        starRating = 2;
                    } else {
                        starRating = 1;
                    }
                    
                    // Générer un commentaire (75% avec commentaire, 25% sans)
                    let comment = "";
                    if (Math.random() < 0.75) {
                        if (starRating >= 4) {
                            comment = positiveComments[Math.floor(Math.random() * positiveComments.length)];
                        } else if (starRating === 3) {
                            comment = neutralComments[Math.floor(Math.random() * neutralComments.length)];
                        } else {
                            comment = negativeComments[Math.floor(Math.random() * negativeComments.length)];
                        }
                    }
                    
                    // Générer une date aléatoire sur les 2 dernières années
                    const twoYearsAgo = Date.now() - (2 * 365 * 24 * 60 * 60 * 1000);
                    const randomTime = twoYearsAgo + Math.random() * (Date.now() - twoYearsAgo);
                    const createTime = new Date(randomTime).toISOString();
                    
                    // Générer une réponse (35% avec réponse, 65% sans)
                    let reply = null;
                    if (Math.random() < 0.35) {
                        reply = {
                            comment: replyTemplates[Math.floor(Math.random() * replyTemplates.length)],
                            updateTime: new Date(randomTime + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
                        };
                    }
                    
                    locationReviews.push({
                        reviewId: `rev_${locationId}_${i + 1}`,
                        name: `locations/${locationId}/reviews/rev_${locationId}_${i + 1}`,
                        reviewer: {
                            displayName: displayName,
                            profilePhotoUrl: null
                        },
                        starRating: starRating.toString(),
                        comment: comment,
                        createTime: createTime,
                        updateTime: createTime,
                        reply: reply
                    });
                }
                
                // Afficher la progression
                if ((batch + 1) % 5 === 0 || batch === numBatches - 1) {
                    const currentProgress = Math.min(batchStart + batchSize, numReviews);
                    console.log(`  Progression: ${currentProgress}/${numReviews} avis générés`);
                }
            }
            
            // Trier par date (plus récent en premier)
            locationReviews.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
            
            reviews[locationId] = locationReviews;
            console.log(`✓ ${location.title}: ${locationReviews.length} avis générés`);
        }
        
        return reviews;
    }

    /**
     * Met à jour les statistiques des locations basées sur les reviews générées
     */
    updateLocationStats() {
        for (const location of this.mockLocations) {
            const locationId = location.locationId;
            const reviews = this.mockReviews[locationId] || [];
            
            if (reviews.length > 0) {
                // Calculer la moyenne des ratings
                let totalRating = 0;
                let ratedCount = 0;
                reviews.forEach(review => {
                    if (review.starRating) {
                        // starRating peut être string ou number
                        const rating = typeof review.starRating === 'string' 
                            ? parseInt(review.starRating) 
                            : review.starRating;
                        if (!isNaN(rating) && rating > 0) {
                            totalRating += rating;
                            ratedCount++;
                        }
                    }
                });
                
                location.totalReviewCount = reviews.length;
                location.rating = ratedCount > 0 ? parseFloat((totalRating / ratedCount).toFixed(1)) : 0;
            }
        }
    }

    /**
     * Récupère tous les comptes Google Business (mock)
     */
    async getAccounts() {
        return {
            accounts: [
                {
                    name: "accounts/111111111111",
                    accountName: "Mon Compte Business",
                    type: "PERSONAL"
                }
            ]
        };
    }

    /**
     * Récupère tous les établissements (mock)
     */
    async getAllLocations() {
        return this.mockLocations.map(loc => ({
            ...loc,
            locationId: loc.locationId || loc.name?.split('/').pop()
        }));
    }

    /**
     * Récupère les établissements pour un compte donné (mock)
     */
    async getLocations(accountName) {
        return this.mockLocations.filter(loc => loc.accountName === accountName);
    }

    /**
     * Récupère les avis pour un établissement donné (mock)
     */
    async getReviews(locationName) {
        const locationId = locationName.split('/').pop();
        return this.mockReviews[locationId] || [];
    }

    /**
     * Répondre à un avis (mock)
     */
    async replyToReview(reviewName, comment) {
        // Simuler une réponse réussie
        // Dans un vrai système, on mettrait à jour les données mock
        return {
            comment: comment.trim()
        };
    }
}

module.exports = MockBusinessService;

