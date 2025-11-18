"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, Smile, Frown, Meh, RefreshCw } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import { useLanguage } from "@/contexts/LanguageContext"

export default function AnalyticsPage() {
  const { isAuthenticated } = useAuth()
  const { t } = useLanguage()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState({
    totalReviews: 0,
    averageRating: 0,
    responseRate: 0,
    pendingReviews: 0,
    sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
    reviewsTrend: [] as Array<{ date: string; reviews: number; replied: number }>,
    responseRateTrend: [] as Array<{ week: string; rate: number }>,
    sentimentStats: [] as Array<{ label: string; value: number; percentage: number }>,
    sentimentData: [] as Array<{ name: string; value: number; fill?: string }>,
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadAnalytics()
    }
  }, [isAuthenticated])

  const loadAnalytics = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.getAnalytics()
      
      // Vérifier que la réponse est valide
      if (!response || !response.analytics) {
        throw new Error("Réponse invalide du serveur")
      }

      const analyticsData = response.analytics
      
      // Ajouter les couleurs pour le graphique en camembert
      const colors = ["#22c55e", "#eab308", "#ef4444"]
      const sentimentDataWithColors = (analyticsData.sentimentData || []).map((item, index) => ({
        ...item,
        fill: colors[index] || "#8884d8"
      }))

      setAnalytics({
        totalReviews: analyticsData.totalReviews || 0,
        averageRating: analyticsData.averageRating || 0,
        responseRate: analyticsData.responseRate || 0,
        pendingReviews: analyticsData.pendingReviews || 0,
        sentimentDistribution: analyticsData.sentimentDistribution || { positive: 0, neutral: 0, negative: 0 },
        reviewsTrend: analyticsData.reviewsTrend || [],
        responseRateTrend: analyticsData.responseRateTrend || [],
        sentimentStats: analyticsData.sentimentStats || [],
        sentimentData: sentimentDataWithColors
      })
    } catch (err) {
      console.error("Error loading analytics:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement des analytics")
    } finally {
      setIsLoading(false)
    }
  }

  const statsCards = [
    {
      label: t("analytics.totalReviews"),
      value: analytics.totalReviews.toString(),
      change: null, // On peut calculer les changements plus tard si nécessaire
      icon: TrendingUp,
      color: "text-blue-600",
      trend: "up" as const,
    },
    {
      label: t("analytics.averageRating"),
      value: analytics.averageRating > 0 ? analytics.averageRating.toFixed(1) : "0",
      change: null,
      icon: Smile,
      color: "text-green-600",
      trend: "up" as const,
    },
    {
      label: t("analytics.responseRate"),
      value: `${analytics.responseRate}%`,
      change: null,
      icon: TrendingUp,
      color: "text-purple-600",
      trend: "up" as const,
    },
    {
      label: t("analytics.pendingReviews"),
      value: analytics.pendingReviews.toString(),
      change: null,
      icon: TrendingDown,
      color: "text-red-600",
      trend: "down" as const,
    },
  ]

  const sentimentStats = [
    {
      label: t("reviews.positive"),
      value: analytics.sentimentDistribution.positive,
      percentage: analytics.sentimentStats[0]?.percentage || 0,
      icon: Smile,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-300",
    },
    {
      label: t("reviews.neutral"),
      value: analytics.sentimentDistribution.neutral,
      percentage: analytics.sentimentStats[1]?.percentage || 0,
      icon: Meh,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-300",
    },
    {
      label: t("reviews.negative"),
      value: analytics.sentimentDistribution.negative,
      percentage: analytics.sentimentStats[2]?.percentage || 0,
      icon: Frown,
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-300",
    },
  ]

  // Trouver le jour avec le plus de reviews
  const bestDay = analytics.reviewsTrend.reduce((max, day) => 
    day.reviews > max.reviews ? day : max, 
    { date: "N/A", reviews: 0, replied: 0 }
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-400">{t("common.loading")}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadAnalytics} className="mt-4">
            <RefreshCw className="w-4 h-4 mr-2" />
            {t("common.retry")}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{t("analytics.title")}</h2>
          <p className="text-slate-600 text-sm mt-2">{t("analytics.subtitle")}</p>
        </div>
        <Button onClick={loadAnalytics} variant="outline" className="w-full sm:w-auto">
          <RefreshCw className="w-4 h-4 mr-2" />
          {t("analytics.refresh")}
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, idx) => (
          <Card
            key={idx}
            className="bg-white border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide">{stat.label}</p>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                  {stat.change && (
                    <p className={`text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                      {stat.change} vs last month
                    </p>
                  )}
                </div>
              </div>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reviews Trend */}
        <Card className="bg-white border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("analytics.reviewsTrend")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.reviewsTrend.length > 0 ? analytics.reviewsTrend : [{ date: "No data", reviews: 0, replied: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#1e293b" }}
              />
              <Legend />
              <Bar dataKey="reviews" fill="#3b82f6" name={t("analytics.totalReviews")} />
              <Bar dataKey="replied" fill="#22c55e" name={t("reviews.replied")} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Sentiment Distribution */}
        <Card className="bg-white border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("analytics.sentimentDistribution")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analytics.sentimentData.length > 0 ? analytics.sentimentData : [{ name: "No data", value: 0, fill: "#8884d8" }]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {analytics.sentimentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill || "#8884d8"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#1e293b" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Response Rate Trend */}
        <Card className="bg-white border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("analytics.responseRateTrend")}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.responseRateTrend.length > 0 ? analytics.responseRateTrend : [{ week: "No data", rate: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#1e293b" }}
              />
              <Line type="monotone" dataKey="rate" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Sentiment Breakdown */}
        <Card className="bg-white border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("analytics.sentimentDistribution")}</h3>
          <div className="space-y-4">
            {sentimentStats.map((stat, idx) => (
              <div key={idx} className={`${stat.bgColor} rounded-lg p-4 border ${stat.borderColor}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="font-medium text-slate-900">{stat.label}</span>
                  </div>
                  <span className={`font-bold ${stat.color}`}>{stat.percentage.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{stat.value} {t("reviews.title").toLowerCase()}</span>
                  <div className="w-24 bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stat.bgColor.replace("100", "600")}`}
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary */}
      <Card className="bg-white border-slate-200 p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">{t("analytics.keyInsights")}</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="border-l-2 border-blue-500 pl-4">
            <p className="text-slate-600 mb-1">{t("analytics.bestPerformingDay")}</p>
            <p className="text-slate-900 font-semibold">
              {bestDay.reviews > 0 
                ? bestDay.date === "N/A" 
                  ? t("analytics.noDataAvailable")
                  : `${bestDay.date} ${t("analytics.with")} ${bestDay.reviews} ${bestDay.reviews > 1 ? t("reviews.title").toLowerCase() : t("reviews.title").toLowerCase().slice(0, -1)} ${t("analytics.received")}${bestDay.reviews > 1 && t("analytics.received") === "reçu" ? "s" : ""}`
                : t("analytics.noDataAvailable")}
            </p>
          </div>
          <div className="border-l-2 border-green-500 pl-4">
            <p className="text-slate-600 mb-1">{t("analytics.overallSentiment")}</p>
            <p className="text-slate-900 font-semibold">
              {sentimentStats[0]?.percentage > 0 
                ? `${sentimentStats[0].percentage.toFixed(1)}${t("analytics.positiveReviews")}`
                : t("analytics.noDataAvailable")}
            </p>
          </div>
          <div className="border-l-2 border-purple-500 pl-4">
            <p className="text-slate-600 mb-1">{t("analytics.responseRate")}</p>
            <p className="text-slate-900 font-semibold">
              {analytics.responseRate > 0 
                ? `${t("analytics.currentlyAt")} ${analytics.responseRate}%`
                : t("analytics.noDataAvailable")}
            </p>
          </div>
          <div className="border-l-2 border-yellow-500 pl-4">
            <p className="text-slate-600 mb-1">{t("analytics.actionNeeded")}</p>
            <p className="text-slate-900 font-semibold">
              {analytics.pendingReviews > 0 
                ? `${analytics.pendingReviews} ${t("analytics.pendingReviewsToAddress")}`
                : t("analytics.noPendingReviews")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
