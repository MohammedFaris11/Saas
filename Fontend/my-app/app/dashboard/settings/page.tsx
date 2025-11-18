"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Copy, Check, Eye, EyeOff, LogOut, Save } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t, language, setLanguage } = useLanguage()
  const [copied, setCopied] = useState<string | null>(null)
  const [showApiKeys, setShowApiKeys] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    language: "en",
  })
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    autoApproveResponses: false,
    weeklySummary: true,
  })
  const [locations, setLocations] = useState<Array<{
    locationId: string
    name: string
    title?: string
    address?: string
  }>>([])

  useEffect(() => {
    loadSettings()
    loadLocations()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.getSettings()
      
      const lang = response.settings.language || "en"
      setFormData({
        name: response.user.displayName || "",
        email: response.user.email || "",
        company: response.settings.company || "",
        language: lang,
      })
      // Mettre à jour la langue dans le contexte
      if (lang !== language) {
        setLanguage(lang as "en" | "fr")
      }
      
      setPreferences({
        emailNotifications: response.settings.emailNotifications ?? true,
        autoApproveResponses: response.settings.autoApproveResponses ?? false,
        weeklySummary: response.settings.weeklySummary ?? true,
      })
    } catch (err) {
      console.error("Error loading settings:", err)
      setError(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setIsLoading(false)
    }
  }

  const loadLocations = async () => {
    try {
      const response = await apiClient.getFollowedLocations()
      setLocations(response.locations || [])
    } catch (err) {
      console.error("Error loading locations:", err)
    }
  }

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError(null)
      
      await apiClient.updateSettings({
        company: formData.company,
        language: formData.language,
        emailNotifications: preferences.emailNotifications,
        autoApproveResponses: preferences.autoApproveResponses,
        weeklySummary: preferences.weeklySummary,
      })
      
      // Mettre à jour la langue dans le contexte
      setLanguage(formData.language as "en" | "fr")
      
      // Recharger les settings pour avoir les données à jour
      await loadSettings()
    } catch (err) {
      console.error("Error saving settings:", err)
      setError(err instanceof Error ? err.message : t("common.error"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleDisconnectLocation = async (locationId: string) => {
    try {
      await apiClient.unfollowLocation(locationId)
      await loadLocations()
    } catch (err) {
      console.error("Error disconnecting location:", err)
      alert("Erreur lors de la déconnexion de la location")
    }
  }

  const handleSignOut = async () => {
    await logout()
  }

  // Les API keys ne sont pas gérées côté backend pour l'instant
  const apiKeys: Array<{
    id: string
    name: string
    key: string
    created: string
    lastUsed: string
  }> = []

  if (isLoading) {
    return (
      <div className="space-y-4 md:space-y-6 w-full px-3 md:px-0">
        <div className="text-center py-12">
          <p className="text-slate-400">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6 w-full px-3 md:px-0">
      {/* Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-slate-900">{t("settings.title")}</h2>
        <p className="text-slate-500 text-xs md:text-sm mt-1">{t("settings.subtitle")}</p>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Account Settings */}
      <Card className="bg-white border-slate-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4 md:mb-6">{t("settings.accountSettings")}</h3>

        <div className="space-y-4 md:space-y-5">
          {/* Name */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">{t("settings.fullName")}</label>
            <Input
              value={formData.name}
              disabled
              className="bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">{t("settings.nameDescription")}</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">{t("settings.email")}</label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500 mt-1">{t("settings.emailDescription")}</p>
          </div>

          {/* Company */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">{t("settings.company")}</label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="bg-slate-50 border-slate-200 text-slate-900"
            />
          </div>

          {/* Language */}
          <div>
            <label className="block text-xs md:text-sm font-medium text-slate-700 mb-2">{t("settings.language")}</label>
            <select
              value={formData.language}
              onChange={(e) => {
                const newLang = e.target.value as "en" | "fr"
                setFormData({ ...formData, language: newLang })
                // Mettre à jour immédiatement la langue dans le contexte
                setLanguage(newLang)
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-3 py-2 rounded-md text-xs md:text-sm"
            >
              <option value="en">English (ENG)</option>
              <option value="fr">Français (FR)</option>
            </select>
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 gap-2 w-full md:w-auto text-sm"
          >
            <Save className="w-4 h-4" />
            {isSaving ? t("settings.saving") : t("settings.saveChanges")}
          </Button>
        </div>
      </Card>

      {/* API Keys */}
      {apiKeys.length > 0 && (
        <Card className="bg-white border-slate-200 p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2">API Credentials</h3>
          <p className="text-xs md:text-sm text-slate-600 mb-4 md:mb-6">
            Manage your API keys for Google My Business and OpenAI integrations
          </p>

          <div className="space-y-3 md:space-y-4">
            {apiKeys.map((apiKey) => (
            <div key={apiKey.id} className="bg-slate-50 rounded-lg border border-slate-200 p-3 md:p-4">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3 gap-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 text-xs md:text-sm">{apiKey.name}</h4>
                  <p className="text-xs text-slate-500 mt-1">Created {new Date(apiKey.created).toLocaleDateString()}</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:text-slate-900 gap-1 bg-white w-full md:w-auto"
                >
                  Regenerate
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 min-w-0">
                  <input
                    type={showApiKeys ? "text" : "password"}
                    value={apiKey.key}
                    readOnly
                    className="w-full bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded text-xs font-mono"
                  />
                </div>
                <Button
                  size="sm"
                  onClick={() => handleCopy(apiKey.key, apiKey.id)}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:text-slate-900 gap-1 w-full md:w-auto"
                >
                  {copied === apiKey.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span className="text-xs">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span className="text-xs">Copy</span>
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-slate-500 mt-2">Last used {new Date(apiKey.lastUsed).toLocaleDateString()}</p>
            </div>
          ))}

          <Button
            onClick={() => setShowApiKeys(!showApiKeys)}
            variant="outline"
            className="w-full border-slate-200 text-slate-700 hover:text-slate-900 gap-2 bg-white"
          >
            {showApiKeys ? (
              <>
                <EyeOff className="w-4 h-4" />
                Hide API Keys
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Show API Keys
              </>
            )}
          </Button>
        </div>
        </Card>
      )}

      {/* Preferences */}
      <Card className="bg-white border-slate-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4 md:mb-6">{t("settings.preferences")}</h3>

        <div className="space-y-3 md:space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-200 gap-3">
            <div className="flex-1">
              <p className="font-medium text-slate-900 text-xs md:text-sm">{t("settings.emailNotifications")}</p>
              <p className="text-xs text-slate-500 mt-1">{t("settings.emailNotificationsDesc")}</p>
            </div>
            <input 
              type="checkbox" 
              checked={preferences.emailNotifications}
              onChange={(e) => setPreferences({ ...preferences, emailNotifications: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer flex-shrink-0" 
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-200 gap-3">
            <div className="flex-1">
              <p className="font-medium text-slate-900 text-xs md:text-sm">{t("settings.autoApproveResponses")}</p>
              <p className="text-xs text-slate-500 mt-1">{t("settings.autoApproveResponsesDesc")}</p>
            </div>
            <input 
              type="checkbox" 
              checked={preferences.autoApproveResponses}
              onChange={(e) => setPreferences({ ...preferences, autoApproveResponses: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer flex-shrink-0" 
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-200 gap-3">
            <div className="flex-1">
              <p className="font-medium text-slate-900 text-xs md:text-sm">{t("settings.weeklySummary")}</p>
              <p className="text-xs text-slate-500 mt-1">{t("settings.weeklySummaryDesc")}</p>
            </div>
            <input 
              type="checkbox" 
              checked={preferences.weeklySummary}
              onChange={(e) => setPreferences({ ...preferences, weeklySummary: e.target.checked })}
              className="w-5 h-5 rounded cursor-pointer flex-shrink-0" 
            />
          </div>
        </div>
      </Card>

      {/* Connected Locations */}
      <Card className="bg-white border-slate-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-4">{t("settings.connectedLocations")}</h3>

        <div className="space-y-3">
          {locations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500 text-sm">{t("settings.noLocations")}</p>
              <p className="text-slate-400 text-xs mt-2">{t("settings.addLocationFromDashboard")}</p>
            </div>
          ) : (
            locations.map((location) => (
              <div
                key={location.locationId}
                className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-slate-50 rounded-lg border border-slate-200 gap-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-900 text-sm truncate">
                    {location.title || location.name}
                  </p>
                  {location.address && (
                    <p className="text-xs text-slate-500 truncate">{location.address}</p>
                  )}
                  {formData.email && (
                    <p className="text-xs text-slate-400 mt-1">{formData.email}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
                  <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium flex-shrink-0">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    {t("settings.connected")}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => handleDisconnectLocation(location.locationId)}
                    className="border-slate-200 text-slate-700 hover:text-slate-900 text-xs h-8 bg-white flex-1 md:flex-none"
                  >
                    {t("settings.disconnect")}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="bg-red-50 border-red-200 p-4 md:p-6">
        <h3 className="text-base md:text-lg font-semibold text-red-700 mb-4">{t("settings.dangerZone")}</h3>

        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-red-100/30 rounded-lg border border-red-300 gap-3">
            <div className="flex-1">
              <p className="font-medium text-slate-900 text-xs md:text-sm">{t("settings.signOut")}</p>
              <p className="text-xs text-slate-500">{t("settings.signOutDesc")}</p>
            </div>
            <Button 
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 gap-2 w-full md:w-auto text-sm"
            >
              <LogOut className="w-4 h-4" />
              {t("settings.signOut")}
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-3 md:p-4 bg-red-100/30 rounded-lg border border-red-300 gap-3">
            <div className="flex-1">
              <p className="font-medium text-slate-900 text-xs md:text-sm">{t("settings.deleteAccount")}</p>
              <p className="text-xs text-slate-500">{t("settings.deleteAccountDesc")}</p>
            </div>
            <Button
              variant="outline"
              className="border-red-600 text-red-600 hover:text-red-700 hover:border-red-700 bg-white w-full md:w-auto text-sm"
            >
              {t("common.delete")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
