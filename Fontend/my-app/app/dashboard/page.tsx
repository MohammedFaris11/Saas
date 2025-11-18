"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Plus, MapPin, Star, Users, MessageSquare, TrendingUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"

interface Location {
  locationId: string
  name: string
  title?: string
  address?: string
  rating?: number
  reviewCount?: number
  isFollowed: boolean
}

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [locations, setLocations] = useState<Location[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    locationsCount: 0,
    responseRate: 0,
  })
  const [isAddLocationOpen, setIsAddLocationOpen] = useState(false)
  const [availableLocations, setAvailableLocations] = useState<Location[]>([])
  const [isLoadingLocations, setIsLoadingLocations] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAdding, setIsAdding] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadFollowedLocations()
    }
  }, [isAuthenticated])

  const loadFollowedLocations = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.getFollowedLocations()
      setLocations(response.locations || [])
      
      // Calculer les statistiques de base depuis les locations
      let totalRating = 0
      let ratedCount = 0
      
      response.locations.forEach((loc) => {
        if (loc.rating) {
          totalRating += loc.rating
          ratedCount++
        }
      })
      
      // Récupérer les statistiques réelles depuis l'endpoint analytics
      let totalReviews = 0
      let responseRate = 0
      if (response.locations.length > 0) {
        try {
          const analyticsResponse = await apiClient.getAnalytics()
          if (analyticsResponse && analyticsResponse.analytics) {
            totalReviews = analyticsResponse.analytics.totalReviews || 0
            responseRate = analyticsResponse.analytics.responseRate || 0
          }
        } catch (err) {
          console.error("Error loading analytics:", err)
          // En cas d'erreur, calculer depuis les locations (fallback)
          response.locations.forEach((loc) => {
            if (loc.reviewCount) totalReviews += loc.reviewCount
          })
        }
      }
      
      setStats({
        totalReviews,
        averageRating: ratedCount > 0 ? totalRating / ratedCount : 0,
        locationsCount: response.locations.length,
        responseRate: responseRate,
      })
    } catch (err) {
      console.error("Error loading locations:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des locations")
    } finally {
      setIsLoading(false)
    }
  }

  const statsData = [
    {
      label: t("dashboard.totalReviews"),
      value: stats.totalReviews.toString(),
      icon: MessageSquare,
      color: "text-blue-600",
    },
    {
      label: t("dashboard.averageRating"),
      value: stats.averageRating > 0 ? stats.averageRating.toFixed(1) : "0",
      icon: Star,
      color: "text-amber-500",
    },
    {
      label: t("dashboard.locationsConnected"),
      value: stats.locationsCount.toString(),
      icon: MapPin,
      color: "text-green-600",
    },
    {
      label: t("dashboard.responseRate"),
      value: `${stats.responseRate}%`,
      icon: TrendingUp,
      color: "text-purple-600",
    },
  ]

  const handleAddLocation = async () => {
    setIsAddLocationOpen(true)
    await loadAvailableLocations()
  }

  const loadAvailableLocations = async () => {
    try {
      setIsLoadingLocations(true)
      const response = await apiClient.getLocations()
      // Filtrer pour ne montrer que les locations non suivies
      const notFollowed = response.locations.filter(loc => !loc.isFollowed)
      setAvailableLocations(notFollowed)
    } catch (err) {
      console.error("Error loading available locations:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des locations")
    } finally {
      setIsLoadingLocations(false)
    }
  }

  const handleFollowLocation = async (locationId: string) => {
    try {
      setIsAdding(locationId)
      const response = await apiClient.followLocation(locationId)
      
      // Si la location a été ajoutée avec succès (et n'était pas déjà suivie)
      if (response.success && !response.alreadyFollowed) {
        // Recharger les locations suivies
        await loadFollowedLocations()
        // Recharger les locations disponibles
        await loadAvailableLocations()
        // Fermer la modal après un court délai pour montrer le succès
        setTimeout(() => {
          setIsAddLocationOpen(false)
          setSearchTerm("")
        }, 500)
      } else if (response.alreadyFollowed) {
        // Si déjà suivie, juste recharger
        await loadAvailableLocations()
      }
    } catch (err) {
      console.error("Error following location:", err)
      alert(err instanceof Error ? err.message : "Erreur lors de l'ajout de la location")
    } finally {
      setIsAdding(null)
    }
  }

  const filteredAvailableLocations = availableLocations.filter(location => {
    const searchLower = searchTerm.toLowerCase()
    const name = (location.title || location.name || "").toLowerCase()
    const address = (location.address || "").toLowerCase()
    return name.includes(searchLower) || address.includes(searchLower)
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{t("dashboard.title")}</h2>
          <p className="text-slate-600 text-sm mt-2">{t("dashboard.subtitle")}</p>
        </div>
        <Button 
          onClick={handleAddLocation}
          className="bg-blue-600 hover:bg-blue-700 gap-2 w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          {t("dashboard.addLocation")}
        </Button>

        {/* Add Location Dialog */}
        <Dialog 
          open={isAddLocationOpen} 
          onOpenChange={(open) => {
            setIsAddLocationOpen(open)
            if (!open) {
              // Réinitialiser la recherche quand la modal se ferme
              setSearchTerm("")
            }
          }}
        >
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("dashboard.addLocation")}</DialogTitle>
              <DialogDescription>
                Select a Google Business location to manage reviews for
              </DialogDescription>
            </DialogHeader>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Search locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-slate-200"
              />
            </div>

            {/* Locations List */}
            {isLoadingLocations ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Loading locations...</p>
              </div>
            ) : filteredAvailableLocations.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-medium">
                  {searchTerm ? "No locations found" : "No available locations"}
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  {searchTerm 
                    ? "Try a different search term"
                    : "All your locations are already being followed"}
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredAvailableLocations.map((location) => (
                  <Card
                    key={location.locationId}
                    className="bg-white border-slate-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-900 truncate">
                            {location.title || location.name}
                          </h4>
                          {location.rating && (
                            <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full flex-shrink-0">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-medium text-amber-600">
                                {location.rating.toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                        {location.address && (
                          <p className="text-sm text-slate-600 flex items-center gap-1 mb-2">
                            <MapPin className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{location.address}</span>
                          </p>
                        )}
                        {location.reviewCount !== undefined && (
                          <p className="text-xs text-slate-500">
                            {location.reviewCount} reviews
                          </p>
                        )}
                      </div>
                      <Button
                        onClick={() => handleFollowLocation(location.locationId)}
                        disabled={isAdding === location.locationId}
                        className="bg-blue-600 hover:bg-blue-700 gap-2 flex-shrink-0"
                        size="sm"
                      >
                        {isAdding === location.locationId ? (
                          "Adding..."
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, idx) => (
          <Card
            key={idx}
            className="bg-white border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Locations */}
      <div>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("dashboard.yourLocations")}</h3>
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-slate-400">{t("common.loading")}</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
            <Button onClick={loadFollowedLocations} className="mt-4">
              {t("common.retry") || "Retry"}
            </Button>
          </div>
        ) : locations.length === 0 ? (
          <Card className="bg-white border-slate-200 p-12 text-center">
            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-slate-900 mb-2">{t("dashboard.noLocations")}</h4>
            <p className="text-slate-600 mb-4">
              {t("dashboard.addLocationDescription")}
            </p>
            <Button onClick={handleAddLocation} className="bg-blue-600 hover:bg-blue-700 gap-2">
              <Plus className="w-4 h-4" />
              {t("dashboard.addLocationButton")}
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {locations.map((location) => (
              <Card
                key={location.locationId}
                className="bg-white border-slate-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-semibold text-slate-900">
                        {location.title || location.name}
                      </h4>
                      {location.rating && (
                        <div className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-full">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span className="text-sm font-medium text-amber-600">
                            {location.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    {location.address && (
                      <p className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {location.address}
                      </p>
                    )}
                    {location.reviewCount !== undefined && (
                      <p className="text-xs text-slate-500 mt-2">
                        {location.reviewCount} {t("reviews.title").toLowerCase()}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Link 
                      href={`/dashboard/reviews?location=${location.locationId}`} 
                      className="flex-1 sm:flex-none"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300 bg-white"
                      >
                        {t("dashboard.viewReviews")}
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-white to-blue-50 border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("dashboard.quickActions")}</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="border-slate-200 text-slate-700 hover:text-slate-900 justify-start bg-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            {t("dashboard.viewPendingReviews")}
          </Button>
          <Link href="/dashboard/analytics">
            <Button
              variant="outline"
              className="w-full border-slate-200 text-slate-700 hover:text-slate-900 justify-start bg-white"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              {t("dashboard.viewAnalytics")}
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button
              variant="outline"
              className="w-full border-slate-200 text-slate-700 hover:text-slate-900 justify-start bg-white"
            >
              <Users className="w-4 h-4 mr-2" />
              {t("dashboard.manageApiKeys")}
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-slate-200 text-slate-700 hover:text-slate-900 justify-start bg-white"
          >
            {t("dashboard.documentation")}
          </Button>
        </div>
      </Card>
    </div>
  )
}
