/**
 * Service pour générer des réponses automatiques aux avis Google Business
 * selon le cahier des charges du projet Ansview
 */

const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require('dotenv');
dotenv.config();

class AutoReplyService {
    constructor() {
        // Utiliser Gemini par défaut
        this.apiKey = process.env.GEMINI_API_KEY;
        this.useOpenAI = false; // Forcer l'utilisation de Gemini
        
        if (this.apiKey) {
            try {
                this.genAI = new GoogleGenerativeAI(this.apiKey);
                // Essayer gemini-2.0-flash, sinon fallback sur gemini-pro
                try {
                    this.model = this.genAI.getGenerativeModel({
                        model: "gemini-2.0-flash",
                    });
                    console.log('✅ Service de réponses automatiques initialisé avec Gemini 2.0 Flash');
                } catch (flashError) {
                    console.warn('⚠️ Gemini 2.0 Flash non disponible, utilisation de gemini-pro');
                    this.model = this.genAI.getGenerativeModel({
                        model: "gemini-pro",
                    });
                    console.log('✅ Service de réponses automatiques initialisé avec Gemini Pro');
                }
            } catch (error) {
                console.error('❌ Erreur lors de l\'initialisation de Gemini:', error);
            }
        } else {
            console.warn('⚠️ GEMINI_API_KEY non définie dans les variables d\'environnement');
        }
    }

    /**
     * Extrait le prénom du nom complet
     */
    extractFirstName(displayName) {
        if (!displayName) return null;
        // Prendre le premier mot (supposé être le prénom)
        const parts = displayName.trim().split(/\s+/);
        return parts[0] || null;
    }

    /**
     * Génère une réponse automatique selon le cahier des charges
     * @param {Object} review - L'avis à répondre
     * @param {number} review.starRating - Note (1-5)
     * @param {string} review.comment - Contenu de l'avis
     * @param {Object} review.reviewer - Informations du reviewer
     * @returns {Promise<string>} - La réponse générée
     */
    async generateAutoReply(review) {
        const rating = review.starRating || review.rating || 0;
        const comment = review.comment || review.text || '';
        const hasComment = comment.trim().length > 0;
        const reviewerName = review.reviewer?.displayName || '';
        const firstName = this.extractFirstName(reviewerName);
        
        // Commencer par "Bonjour [Prénom]," ou "Bonjour,"
        const greeting = firstName ? `Bonjour ${firstName},` : 'Bonjour,';

        // Déterminer le type de réponse selon le cahier des charges
        let prompt = '';
        let responseType = '';

        if (rating === 5) {
            if (hasComment) {
                // ⭐⭐⭐⭐⭐ (5 étoiles) avec commentaire : Réponse personnalisée basée sur le contenu
                responseType = 'personnalisée';
                prompt = `Tu es Ansview, une plateforme intelligente qui répond aux avis Google Business. 

Un client a laissé un avis 5 étoiles avec le commentaire suivant :
"${comment}"

Génère une réponse professionnelle et chaleureuse qui :
- Commence par "${greeting}"
- Remercie le client pour son avis positif
- Mentionne spécifiquement des éléments du commentaire pour montrer que tu as bien lu
- Reste professionnel et authentique
- Fait maximum 2-3 lignes
- Répond dans la même langue que l'avis

Réponse (sans guillemets, juste le texte) :`;
            } else {
                // ⭐⭐⭐⭐⭐ (5 étoiles) sans commentaire : Réponse générique de remerciement
                responseType = 'générique';
                prompt = `Tu es Ansview, une plateforme intelligente qui répond aux avis Google Business.

Un client a laissé un avis 5 étoiles sans commentaire.

Génère une réponse générique de remerciement qui :
- Commence par "${greeting}"
- Remercie le client pour sa note parfaite
- Exprime la satisfaction de l'équipe
- Invite le client à revenir
- Fait maximum 2 lignes
- Répond en français

Réponse (sans guillemets, juste le texte) :`;
            }
        } else if (rating === 4) {
            if (hasComment) {
                // ⭐⭐⭐⭐ (4 étoiles) avec commentaire : Réponse personnalisée basée sur le contenu
                responseType = 'personnalisée';
                prompt = `Tu es Ansview, une plateforme intelligente qui répond aux avis Google Business.

Un client a laissé un avis 4 étoiles avec le commentaire suivant :
"${comment}"

Génère une réponse professionnelle qui :
- Commence par "${greeting}"
- Remercie le client pour son avis positif
- Mentionne des éléments du commentaire
- Reste professionnel et chaleureux
- Fait maximum 2-3 lignes
- Répond dans la même langue que l'avis

Réponse (sans guillemets, juste le texte) :`;
            } else {
                // ⭐⭐⭐⭐ (4 étoiles) sans commentaire : Réponse générique de remerciement
                responseType = 'générique';
                prompt = `Tu es Ansview, une plateforme intelligente qui répond aux avis Google Business.

Un client a laissé un avis 4 étoiles sans commentaire.

Génère une réponse générique de remerciement qui :
- Commence par "${greeting}"
- Remercie le client pour sa bonne note
- Exprime la satisfaction
- Fait maximum 2 lignes
- Répond en français

Réponse (sans guillemets, juste le texte) :`;
            }
        } else if (rating === 3) {
            // ⭐⭐⭐ (3 étoiles) : Réponse générique neutre et ouverte à la discussion
            responseType = 'neutre';
            prompt = `Tu es Ansview, une plateforme intelligente qui répond aux avis Google Business.

Un client a laissé un avis 3 étoiles${hasComment ? ` avec le commentaire : "${comment}"` : ''}.

Génère une réponse neutre et ouverte au dialogue qui :
- Commence par "${greeting}"
- Remercie le client pour son retour
- Exprime l'envie d'améliorer l'expérience
- Invite à la discussion si nécessaire
- Reste professionnel et positif
- Fait maximum 2-3 lignes
- Répond dans la même langue que l'avis

Réponse (sans guillemets, juste le texte) :`;
        } else if (rating === 2 || rating === 1) {
            if (hasComment) {
                // ⭐⭐ ou ⭐ (2 ou 1 étoile) avec commentaire : Réponse personnalisée
                responseType = 'personnalisée';
                prompt = `Tu es Ansview, une plateforme intelligente qui répond aux avis Google Business.

Un client a laissé un avis ${rating} étoile${rating > 1 ? 's' : ''} avec le commentaire suivant :
"${comment}"

Génère une réponse professionnelle et empathique qui :
- Commence par "${greeting}"
- Exprime de la considération pour le feedback
- Reconnaît les points soulevés dans le commentaire
- Montre l'engagement à améliorer
- Invite à un dialogue pour résoudre les problèmes
- Reste professionnel, humble et constructif
- Fait maximum 3-4 lignes
- Répond dans la même langue que l'avis

Réponse (sans guillemets, juste le texte) :`;
            } else {
                // ⭐⭐ ou ⭐ (2 ou 1 étoile) sans commentaire : Réponse générique exprimant de la considération
                responseType = 'générique considération';
                prompt = `Tu es Ansview, une plateforme intelligente qui répond aux avis Google Business.

Un client a laissé un avis ${rating} étoile${rating > 1 ? 's' : ''} sans commentaire.

Génère une réponse générique qui :
- Commence par "${greeting}"
- Exprime de la considération pour le feedback
- Montre l'ouverture au dialogue
- Invite à partager plus de détails pour améliorer
- Reste professionnel et empathique
- Fait maximum 2-3 lignes
- Répond en français

Réponse (sans guillemets, juste le texte) :`;
            }
        } else {
            // Par défaut, réponse neutre
            responseType = 'neutre';
            prompt = `Tu es Ansview, une plateforme intelligente qui répond aux avis Google Business.

Un client a laissé un avis ${rating} étoile${rating > 1 ? 's' : ''}${hasComment ? ` avec le commentaire : "${comment}"` : ''}.

Génère une réponse professionnelle et appropriée qui :
- Commence par "${greeting}"
- Remercie pour le feedback
- Reste professionnel
- Fait maximum 2-3 lignes
- Répond dans la même langue que l'avis

Réponse (sans guillemets, juste le texte) :`;
        }

        try {
            let responseText = '';

            // Utiliser Gemini (priorité)
            if (this.genAI && this.model) {
                try {
                    console.log('🤖 Génération de réponse avec Gemini...');
                    console.log('Prompt (50 premiers caractères):', prompt.substring(0, 50) + '...');
                    
                    // Construire le prompt complet avec l'instruction système
                    const fullPrompt = `Tu es Ansview, une plateforme intelligente qui génère des réponses professionnelles aux avis Google Business. Réponds toujours de manière professionnelle, authentique et dans la même langue que l'avis. Garde tes réponses concises (2-3 lignes maximum).\n\n${prompt}`;
                    
                    const chatSession = this.model.startChat({
                        generationConfig: {
                            temperature: 0.7,
                            topP: 0.95,
                            topK: 40,
                            maxOutputTokens: 200,
                            responseMimeType: "text/plain",
                        }
                    });
                    
                    // Envoyer le prompt
                    const result = await chatSession.sendMessage(fullPrompt);
                    
                    if (result && result.response && result.response.text) {
                        responseText = result.response.text().trim();
                        console.log('✅ Réponse générée avec succès:', responseText.substring(0, 50) + '...');
                    } else {
                        console.error('❌ Réponse invalide de Gemini');
                        throw new Error('Réponse invalide de Gemini');
                    }
                } catch (geminiError) {
                    console.error('❌ Erreur Gemini lors de la génération:', geminiError.message);
                    console.error('Détails complets:', geminiError);
                    // Fallback sur réponse basique
                    responseText = this.generateFallbackResponse(rating, hasComment, greeting);
                    console.log('🔄 Utilisation de la réponse de fallback');
                }
            } else {
                // Mode fallback : générer une réponse basique si Gemini n'est pas disponible
                console.warn('⚠️ Gemini non disponible, utilisation de la réponse de fallback');
                console.warn('genAI disponible:', !!this.genAI);
                console.warn('model disponible:', !!this.model);
                responseText = this.generateFallbackResponse(rating, hasComment, greeting);
            }

            // Nettoyer la réponse (enlever les guillemets si présents)
            responseText = responseText.replace(/^["']|["']$/g, '').trim();

            return {
                reply: responseText,
                type: responseType,
                generated: true
            };
        } catch (error) {
            console.error('Erreur lors de la génération de la réponse automatique:', error);
            console.error('Détails:', error.message);
            console.error('Stack:', error.stack);
            // En cas d'erreur, retourner une réponse de fallback
            return {
                reply: this.generateFallbackResponse(rating, hasComment, greeting),
                type: 'fallback',
                generated: false,
                error: error.message
            };
        }
    }

    /**
     * Génère une réponse de fallback si l'API échoue
     */
    generateFallbackResponse(rating, hasComment, greeting) {
        if (rating >= 4) {
            return `${greeting} Merci beaucoup pour votre avis positif ! Nous sommes ravis que vous ayez apprécié votre expérience. Au plaisir de vous revoir bientôt !`;
        } else if (rating === 3) {
            return `${greeting} Merci pour votre retour. Nous sommes toujours à l'écoute pour améliorer nos services. N'hésitez pas à nous contacter si vous souhaitez partager vos suggestions.`;
        } else {
            return `${greeting} Nous prenons votre avis très au sérieux. Nous serions ravis d'échanger avec vous pour comprendre comment nous pourrions améliorer votre expérience. N'hésitez pas à nous contacter.`;
        }
    }
}

module.exports = new AutoReplyService();

