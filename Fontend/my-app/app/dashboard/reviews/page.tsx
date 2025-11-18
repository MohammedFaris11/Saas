"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Search, Check, Clock, ArrowRight, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"

interface Review {
  reviewId?: string
  name?: string
  reviewer?: {
    displayName?: string
    profilePhotoUrl?: string
  }
  starRating?: string
  comment?: string
  createTime?: string
  updateTime?: string
  reply?: {
    comment?: string
    updateTime?: string
  }
  locationId?: string
}

interface Location {
  locationId: string
  name: string
  title?: string
  address?: string
}

export default function ReviewsPage() {
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const locationIdFromUrl = searchParams.get("location")
  const [selectedLocationId, setSelectedLocationId] = useState<string>("all")
  const [locations, setLocations] = useState<Location[]>([])
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated) {
      loadLocations()
    }
  }, [isAuthenticated])

  useEffect(() => {
    // Initialiser la location sélectionnée depuis l'URL si présente
    if (locationIdFromUrl) {
      setSelectedLocationId(locationIdFromUrl)
    }
  }, [locationIdFromUrl])

  useEffect(() => {
    if (isAuthenticated && locations.length > 0) {
      if (selectedLocationId === "all") {
        loadAllReviews()
      } else {
        loadReviews(selectedLocationId)
      }
    }
  }, [isAuthenticated, selectedLocationId, locations])

  const loadLocations = async () => {
    try {
      const response = await apiClient.getFollowedLocations()
      setLocations(response.locations || [])
    } catch (err) {
      console.error("Error loading locations:", err)
    }
  }

  const loadReviews = async (locId: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.getReviews(locId)
      const reviewsWithLocation = (response.reviews || []).map((review) => ({
        ...review,
        locationId: locId,
      }))
      setReviews(reviewsWithLocation)
    } catch (err) {
      console.error("Error loading reviews:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des avis")
    } finally {
      setIsLoading(false)
    }
  }

  const loadAllReviews = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const locationsResponse = await apiClient.getFollowedLocations()
      const allReviews: Review[] = []

      for (const location of locationsResponse.locations) {
        try {
          const reviewsResponse = await apiClient.getReviews(location.locationId)
          const reviewsWithLocation = (reviewsResponse.reviews || []).map((review) => ({
            ...review,
            locationId: location.locationId,
          }))
          allReviews.push(...reviewsWithLocation)
        } catch (err) {
          console.error(`Error loading reviews for location ${location.locationId}:`, err)
        }
      }

      setReviews(allReviews)
    } catch (err) {
      console.error("Error loading all reviews:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des avis")
    } finally {
      setIsLoading(false)
    }
  }

  const getReviewId = (review: Review): string => {
    return review.reviewId || review.name?.split("/").pop() || ""
  }

  const getReviewerName = (review: Review): string => {
    return review.reviewer?.displayName || "Anonymous"
  }

  const getRating = (review: Review): number => {
    return review.starRating ? parseInt(review.starRating) : 0
  }

  const getReviewDate = (review: Review): string => {
    return review.createTime || review.updateTime || new Date().toISOString()
  }

  const hasReply = (review: Review): boolean => {
    return !!review.reply?.comment
  }

  const filteredReviews = reviews.filter((review) => {
    // Filtrer par location si une location spécifique est sélectionnée
    if (selectedLocationId !== "all" && review.locationId !== selectedLocationId) {
      return false
    }
    // Filtrer par statut (pending/replied)
    const status = hasReply(review) ? "replied" : "pending"
    if (filter !== "all" && status !== filter) return false
    // Filtrer par recherche
    const reviewerName = getReviewerName(review).toLowerCase()
    if (searchTerm && !reviewerName.includes(searchTerm.toLowerCase())) return false
    return true
  })

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating === 3) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">{t("reviews.title")}</h2>
        <p className="text-slate-600 text-sm mt-2">{t("reviews.subtitle")}</p>
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Location Selector */}
        <div className="flex items-center gap-3">
          <MapPin className="w-4 h-4 text-slate-500" />
          <select
            value={selectedLocationId}
            onChange={(e) => setSelectedLocationId(e.target.value)}
            className="flex-1 sm:flex-none px-4 py-2 bg-white border border-slate-200 rounded-md text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
          >
            <option value="all">{t("reviews.allLocations")}</option>
            {locations.map((location) => (
              <option key={location.locationId} value={location.locationId}>
                {location.title || location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <Input
              placeholder={t("reviews.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-200 text-slate-900 placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2 flex-wrap sm:flex-nowrap">
            {["all", "pending", "replied"].map((f) => (
              <Button
                key={f}
                onClick={() => setFilter(f)}
                variant={filter === f ? "default" : "outline"}
                className={
                  filter === f
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 bg-white"
                }
              >
              {f === "all" && <span>{t("reviews.all")}</span>}
              {f === "pending" && (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  {t("reviews.pending")}
                </>
              )}
              {f === "replied" && (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  {t("reviews.replied")}
                </>
              )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {isLoading ? (
        <div className="text-center py-12">
          <p className="text-slate-400">{t("reviews.loading")}</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => selectedLocationId === "all" ? loadAllReviews() : loadReviews(selectedLocationId)} className="mt-4">
            {t("reviews.retry")}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredReviews.map((review) => {
            const reviewId = getReviewId(review)
            const reviewerName = getReviewerName(review)
            const rating = getRating(review)
            const reviewDate = getReviewDate(review)
            const replied = hasReply(review)

            return (
              <Card
                key={reviewId}
                className="bg-white border-slate-200 p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col gap-4">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-semibold text-slate-900">{reviewerName}</h3>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className={`text-xs font-medium ${getRatingColor(rating)}`}>
                          {rating >= 4 ? t("reviews.positive") : rating === 3 ? t("reviews.neutral") : t("reviews.negative")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs text-slate-500">
                          {new Date(reviewDate).toLocaleDateString()}
                        </p>
                        {selectedLocationId === "all" && review.locationId && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {locations.find(loc => loc.locationId === review.locationId)?.title || review.locationId}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {replied ? (
                        <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          {t("reviews.replied")}
                        </div>
                      ) : (
                        <div className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {t("reviews.pending")}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment */}
                  {review.comment && (
                    <p className="text-sm text-slate-600 line-clamp-2">{review.comment}</p>
                  )}

                  {/* Reply preview */}
                  {review.reply?.comment && (
                    <div className="bg-slate-50 border border-slate-200 rounded p-3">
                      <p className="text-xs font-medium text-slate-500 mb-1">{t("reviews.yourReply")}</p>
                      <p className="text-sm text-slate-700 line-clamp-2">{review.reply.comment}</p>
                    </div>
                  )}

                  {/* Action */}
                  {!replied && review.locationId && (
                    <Link 
                      href={`/dashboard/reviews/${reviewId}?location=${review.locationId}`} 
                      className="block"
                    >
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        {t("reviews.writeResponse")}
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {!isLoading && !error && filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400">{t("reviews.noReviews")}</p>
        </div>
      )}
    </div>
  )
}
