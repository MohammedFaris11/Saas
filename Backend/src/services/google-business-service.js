const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

class GoogleBusinessService {
    constructor(accessToken) {
        this.accessToken = accessToken;
        
        // Déterminer l'URL du callback dynamiquement
        const getCallbackURL = () => {
            if (process.env.VERCEL_URL) {
                return `https://${process.env.VERCEL_URL}/auth/google/callback`;
            }
            if (process.env.BACKEND_URL) {
                return `${process.env.BACKEND_URL}/auth/google/callback`;
            }
            return process.env.CALLBACK_URL || 'http://localhost:3001/auth/google/callback';
        };
        
        this.oauth2Client = new google.auth.OAuth2(
            process.env.CLIENT_ID,
            process.env.CLIENT_SECRET,
            getCallbackURL()
        );
        this.oauth2Client.setCredentials({ access_token: accessToken });
    }

    /**
     * Récupère tous les comptes Google Business de l'utilisateur
     */
    async getAccounts() {
        try {
            const mybusiness = google.mybusinessaccountmanagement({
                version: 'v1',
                auth: this.oauth2Client
            });

            const response = await mybusiness.accounts.list();
            return response.data;
        } catch (error) {
            console.error('Erreur lors de la récupération des comptes:', error);
            throw error;
        }
    }

    /**
     * Récupère tous les établissements (locations) pour un compte donné
     */
    async getLocations(accountName) {
        try {
            // Utiliser l'API Google Business Profile (anciennement My Business)
            const mybusiness = google.mybusiness({
                version: 'v4',
                auth: this.oauth2Client
            });

            const response = await mybusiness.accounts.locations.list({
                parent: accountName
            });

            return response.data.locations || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des établissements:', error);
            // Si l'API v4 ne fonctionne pas, essayer v1
            try {
                return await this.getLocationsV1(accountName);
            } catch (v1Error) {
                throw new Error(`Impossible de récupérer les établissements: ${v1Error.message}`);
            }
        }
    }

    /**
     * Récupère les établissements avec l'API v1 (fallback)
     */
    async getLocationsV1(accountName) {
        try {
            const mybusiness = google.mybusiness({
                version: 'v1',
                auth: this.oauth2Client
            });

            const response = await mybusiness.accounts.locations.list({
                parent: accountName
            });

            return response.data.locations || [];
        } catch (error) {
            console.error('Erreur avec API v1:', error);
            throw error;
        }
    }

    /**
     * Récupère les avis pour un établissement donné
     */
    async getReviews(locationName) {
        try {
            const mybusiness = google.mybusiness({
                version: 'v4',
                auth: this.oauth2Client
            });

            const response = await mybusiness.accounts.locations.reviews.list({
                parent: locationName
            });

            return response.data.reviews || [];
        } catch (error) {
            console.error('Erreur lors de la récupération des avis:', error);
            // Essayer avec v1
            try {
                return await this.getReviewsV1(locationName);
            } catch (v1Error) {
                throw new Error(`Impossible de récupérer les avis: ${v1Error.message}`);
            }
        }
    }

    /**
     * Récupère les avis avec l'API v1 (fallback)
     */
    async getReviewsV1(locationName) {
        try {
            const mybusiness = google.mybusiness({
                version: 'v1',
                auth: this.oauth2Client
            });

            const response = await mybusiness.accounts.locations.reviews.list({
                parent: locationName
            });

            return response.data.reviews || [];
        } catch (error) {
            console.error('Erreur avec API v1 pour les avis:', error);
            throw error;
        }
    }

    /**
     * Récupère tous les établissements de tous les comptes de l'utilisateur
     */
    async getAllLocations() {
        try {
            const accounts = await this.getAccounts();
            const allLocations = [];

            if (accounts.accounts) {
                for (const account of accounts.accounts) {
                    try {
                        const locations = await this.getLocations(account.name);
                        allLocations.push(...locations.map(loc => ({
                            ...loc,
                            accountName: account.name,
                            accountDisplayName: account.accountName
                        })));
                    } catch (error) {
                        console.error(`Erreur pour le compte ${account.name}:`, error);
                    }
                }
            }

            return allLocations;
        } catch (error) {
            console.error('Erreur lors de la récupération de tous les établissements:', error);
            throw error;
        }
    }
}

module.exports = GoogleBusinessService;

