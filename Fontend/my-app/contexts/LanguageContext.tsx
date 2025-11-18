"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { apiClient } from "@/lib/api"

type Language = "en" | "fr"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
  isHydrated: boolean
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Traductions
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Common
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.loading": "Loading...",
    "common.error": "Error",
    "common.success": "Success",
    "common.retry": "Retry",
    
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.reviews": "Reviews",
    "nav.analytics": "Analytics",
    "nav.settings": "Settings",
    "nav.signOut": "Sign Out",
    
    // Dashboard
    "dashboard.title": "Dashboard",
    "dashboard.subtitle": "Manage your Google Business locations and reviews",
    "dashboard.addLocation": "Add Location",
    "dashboard.totalReviews": "Total Reviews",
    "dashboard.averageRating": "Average Rating",
    "dashboard.locationsConnected": "Locations Connected",
    "dashboard.responseRate": "Response Rate",
    "dashboard.yourLocations": "Your Locations",
    "dashboard.noLocations": "No locations followed",
    "dashboard.addLocationDescription": "Start by adding a Google Business location to manage reviews.",
    "dashboard.addLocationButton": "Add a location",
    "dashboard.viewReviews": "View Reviews",
    "dashboard.quickActions": "Quick Actions",
    "dashboard.viewPendingReviews": "View Pending Reviews",
    "dashboard.viewAnalytics": "View Analytics",
    "dashboard.manageApiKeys": "Manage API Keys",
    "dashboard.documentation": "Documentation",
    
    // Reviews
    "reviews.title": "Reviews",
    "reviews.subtitle": "Manage and respond to customer reviews",
    "reviews.allLocations": "All Locations",
    "reviews.searchPlaceholder": "Search by client name...",
    "reviews.all": "All",
    "reviews.pending": "Pending",
    "reviews.replied": "Replied",
    "reviews.loading": "Loading reviews...",
    "reviews.error": "Error loading reviews",
    "reviews.retry": "Retry",
    "reviews.noReviews": "No reviews found",
    "reviews.writeResponse": "Write Response",
    "reviews.yourReply": "Your reply:",
    "reviews.positive": "Positive",
    "reviews.neutral": "Neutral",
    "reviews.negative": "Negative",
    
    // Analytics
    "analytics.title": "Analytics",
    "analytics.subtitle": "Track your review performance",
    "analytics.refresh": "Refresh",
    "analytics.totalReviews": "Total Reviews",
    "analytics.averageRating": "Average Rating",
    "analytics.responseRate": "Response Rate",
    "analytics.pendingReviews": "Pending Reviews",
    "analytics.reviewsTrend": "Reviews Trend",
    "analytics.responseRateTrend": "Response Rate Trend",
    "analytics.sentimentDistribution": "Sentiment Distribution",
    "analytics.currentlyAt": "Currently at",
    "analytics.keyInsights": "Key Insights",
    "analytics.bestPerformingDay": "Best Performing Day",
    "analytics.overallSentiment": "Overall Sentiment",
    "analytics.actionNeeded": "Action Needed",
    "analytics.reviewsReceived": "with {count} review(s) received",
    "analytics.with": "with",
    "analytics.received": "received",
    "analytics.positiveReviews": "% positive reviews",
    "analytics.pendingReviewsToAddress": "pending review(s) to address",
    "analytics.noDataAvailable": "No data available",
    "analytics.noPendingReviews": "No pending reviews",
    
    // Settings
    "settings.title": "Settings",
    "settings.subtitle": "Manage your account and API credentials",
    "settings.accountSettings": "Account Settings",
    "settings.fullName": "Full Name",
    "settings.nameDescription": "Your name is associated with your Google account and cannot be changed",
    "settings.email": "Email",
    "settings.emailDescription": "Your email is associated with your Google account and cannot be changed",
    "settings.company": "Company/Business Name",
    "settings.language": "Language",
    "settings.saveChanges": "Save Changes",
    "settings.saving": "Saving...",
    "settings.preferences": "Preferences",
    "settings.emailNotifications": "Email Notifications",
    "settings.emailNotificationsDesc": "Get notified about pending reviews",
    "settings.autoApproveResponses": "Auto-Approve Responses",
    "settings.autoApproveResponsesDesc": "Automatically send AI responses without review",
    "settings.weeklySummary": "Weekly Summary",
    "settings.weeklySummaryDesc": "Receive weekly analytics summary",
    "settings.connectedLocations": "Connected Locations",
    "settings.noLocations": "No connected locations",
    "settings.addLocationFromDashboard": "Add a location from the dashboard",
    "settings.connected": "Connected",
    "settings.disconnect": "Disconnect",
    "settings.dangerZone": "Danger Zone",
    "settings.signOut": "Sign Out",
    "settings.signOutDesc": "Sign out of your Ansview account",
    "settings.deleteAccount": "Delete Account",
    "settings.deleteAccountDesc": "Permanently delete your account and all data",
    
    // Login/Signup
    "auth.signIn": "Sign in",
    "auth.signUp": "Sign up",
    "auth.signInWithGoogle": "Sign in with Google",
    "auth.signUpWithGoogle": "Sign up with Google",
    "auth.connectGoogle": "Connect with your Google account to get started",
    "auth.createAccount": "Create your account with Google to get started",
    "auth.dontHaveAccount": "Don't have an account?",
    "auth.alreadyHaveAccount": "Already have an account?",
    "auth.manageReviews": "Manage your Google reviews automatically",
    "auth.startManaging": "Start managing reviews automatically",
  },
  fr: {
    // Common
    "common.save": "Enregistrer",
    "common.cancel": "Annuler",
    "common.delete": "Supprimer",
    "common.edit": "Modifier",
    "common.loading": "Chargement...",
    "common.error": "Erreur",
    "common.success": "Succès",
    "common.retry": "Réessayer",
    
    // Navigation
    "nav.dashboard": "Tableau de bord",
    "nav.reviews": "Avis",
    "nav.analytics": "Analyses",
    "nav.settings": "Paramètres",
    "nav.signOut": "Déconnexion",
    
    // Dashboard
    "dashboard.title": "Tableau de bord",
    "dashboard.subtitle": "Gérez vos établissements Google Business et vos avis",
    "dashboard.addLocation": "Ajouter un établissement",
    "dashboard.totalReviews": "Total des avis",
    "dashboard.averageRating": "Note moyenne",
    "dashboard.locationsConnected": "Établissements connectés",
    "dashboard.responseRate": "Taux de réponse",
    "dashboard.yourLocations": "Vos établissements",
    "dashboard.noLocations": "Aucun établissement suivi",
    "dashboard.addLocationDescription": "Commencez par ajouter un établissement Google Business pour gérer vos avis.",
    "dashboard.addLocationButton": "Ajouter un établissement",
    "dashboard.viewReviews": "Voir les avis",
    "dashboard.quickActions": "Actions rapides",
    "dashboard.viewPendingReviews": "Voir les avis en attente",
    "dashboard.viewAnalytics": "Voir les analyses",
    "dashboard.manageApiKeys": "Gérer les clés API",
    "dashboard.documentation": "Documentation",
    
    // Reviews
    "reviews.title": "Avis",
    "reviews.subtitle": "Gérez et répondez aux avis clients",
    "reviews.allLocations": "Tous les établissements",
    "reviews.searchPlaceholder": "Rechercher par nom de client...",
    "reviews.all": "Tous",
    "reviews.pending": "En attente",
    "reviews.replied": "Répondu",
    "reviews.loading": "Chargement des avis...",
    "reviews.error": "Erreur lors du chargement des avis",
    "reviews.retry": "Réessayer",
    "reviews.noReviews": "Aucun avis trouvé",
    "reviews.writeResponse": "Écrire une réponse",
    "reviews.yourReply": "Votre réponse :",
    "reviews.positive": "Positif",
    "reviews.neutral": "Neutre",
    "reviews.negative": "Négatif",
    
    // Analytics
    "analytics.title": "Analyses",
    "analytics.subtitle": "Suivez les performances de vos avis",
    "analytics.refresh": "Actualiser",
    "analytics.totalReviews": "Total des avis",
    "analytics.averageRating": "Note moyenne",
    "analytics.responseRate": "Taux de réponse",
    "analytics.pendingReviews": "Avis en attente",
    "analytics.reviewsTrend": "Tendance des avis",
    "analytics.responseRateTrend": "Tendance du taux de réponse",
    "analytics.sentimentDistribution": "Répartition des sentiments",
    "analytics.currentlyAt": "Actuellement à",
    "analytics.keyInsights": "Aperçus clés",
    "analytics.bestPerformingDay": "Meilleur jour de performance",
    "analytics.overallSentiment": "Sentiment global",
    "analytics.actionNeeded": "Action requise",
    "analytics.reviewsReceived": "avec {count} avis reçu(s)",
    "analytics.with": "avec",
    "analytics.received": "reçu",
    "analytics.positiveReviews": "% d'avis positifs",
    "analytics.pendingReviewsToAddress": "avis en attente à traiter",
    "analytics.noDataAvailable": "Aucune donnée disponible",
    "analytics.noPendingReviews": "Aucun avis en attente",
    
    // Settings
    "settings.title": "Paramètres",
    "settings.subtitle": "Gérez votre compte et vos identifiants API",
    "settings.accountSettings": "Paramètres du compte",
    "settings.fullName": "Nom complet",
    "settings.nameDescription": "Votre nom est associé à votre compte Google et ne peut pas être modifié",
    "settings.email": "Email",
    "settings.emailDescription": "Votre email est associé à votre compte Google et ne peut pas être modifié",
    "settings.company": "Nom de l'entreprise",
    "settings.language": "Langue",
    "settings.saveChanges": "Enregistrer les modifications",
    "settings.saving": "Enregistrement...",
    "settings.preferences": "Préférences",
    "settings.emailNotifications": "Notifications par email",
    "settings.emailNotificationsDesc": "Recevoir des notifications pour les avis en attente",
    "settings.autoApproveResponses": "Approuver automatiquement les réponses",
    "settings.autoApproveResponsesDesc": "Envoyer automatiquement les réponses IA sans révision",
    "settings.weeklySummary": "Résumé hebdomadaire",
    "settings.weeklySummaryDesc": "Recevoir un résumé hebdomadaire des analyses",
    "settings.connectedLocations": "Établissements connectés",
    "settings.noLocations": "Aucun établissement connecté",
    "settings.addLocationFromDashboard": "Ajoutez un établissement depuis le tableau de bord",
    "settings.connected": "Connecté",
    "settings.disconnect": "Déconnecter",
    "settings.dangerZone": "Zone de danger",
    "settings.signOut": "Déconnexion",
    "settings.signOutDesc": "Déconnectez-vous de votre compte Ansview",
    "settings.deleteAccount": "Supprimer le compte",
    "settings.deleteAccountDesc": "Supprimer définitivement votre compte et toutes les données",
    
    // Login/Signup
    "auth.signIn": "Se connecter",
    "auth.signUp": "S'inscrire",
    "auth.signInWithGoogle": "Se connecter avec Google",
    "auth.signUpWithGoogle": "S'inscrire avec Google",
    "auth.connectGoogle": "Connectez-vous avec votre compte Google pour commencer",
    "auth.createAccount": "Créez votre compte avec Google pour commencer",
    "auth.dontHaveAccount": "Vous n'avez pas de compte ?",
    "auth.alreadyHaveAccount": "Vous avez déjà un compte ?",
    "auth.manageReviews": "Gérez vos avis Google automatiquement",
    "auth.startManaging": "Commencez à gérer vos avis automatiquement",
  },
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  // Toujours commencer par "en" pour éviter les problèmes d'hydratation
  const [language, setLanguageState] = useState<Language>("en")
  const [isHydrated, setIsHydrated] = useState(false)

  // Charger la langue après l'hydratation
  useEffect(() => {
    // Charger depuis localStorage d'abord
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
      setLanguageState(savedLanguage)
    }
    setIsHydrated(true)
    
    // Ensuite, charger depuis les settings si l'utilisateur est authentifié
    loadLanguage()
  }, [])

  // Écouter les changements de langue dans localStorage (pour synchroniser entre onglets)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "language" && e.newValue) {
        const newLang = e.newValue as Language
        if (newLang === "en" || newLang === "fr") {
          setLanguageState(newLang)
        }
      }
    }

    const handleLanguageChange = () => {
      const savedLanguage = localStorage.getItem("language") as Language | null
      if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fr")) {
        setLanguageState(savedLanguage)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("languagechange", handleLanguageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("languagechange", handleLanguageChange)
    }
  }, [])

  const loadLanguage = async () => {
    try {
      const response = await apiClient.getSettings()
      const lang = (response.settings.language || "en") as Language
      setLanguageState(lang)
      localStorage.setItem("language", lang)
    } catch (error) {
      // Si l'utilisateur n'est pas authentifié, la langue depuis localStorage est déjà chargée
      // Ne rien faire
    }
  }

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
    
    // Déclencher un événement personnalisé pour synchroniser avec d'autres composants
    window.dispatchEvent(new Event("languagechange"))
    
    // Sauvegarder la langue dans les settings si l'utilisateur est authentifié
    try {
      await apiClient.updateSettings({ language: lang })
    } catch (error) {
      // Si l'utilisateur n'est pas authentifié, on garde juste dans localStorage
      console.error("Error saving language:", error)
    }
  }

  const t = (key: string): string => {
    return translations[language]?.[key] || translations.en[key] || key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isHydrated,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

