"use client"

import { useState, useEffect, use } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Star, Copy, Check, Send, ArrowLeft, Sparkles } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { apiClient } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

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
}

export default function ReviewResponsePage({ params }: { params: Promise<{ id: string }> }) {
  // React.use() doit être appelé en premier, avant tous les autres hooks
  const resolvedParams = use(params)
  const reviewId = resolvedParams.id

  // Ensuite, tous les autres hooks dans un ordre stable
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated } = useAuth()
  const locationId = searchParams.get("location")

  const [review, setReview] = useState<Review | null>(null)
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [copied, setCopied] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isAuthenticated && locationId && reviewId) {
      loadReview()
    }
  }, [isAuthenticated, locationId, reviewId])

  const loadReview = async () => {
    if (!locationId) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.getReviews(locationId)
      const foundReview = response.reviews.find(
        (r) => (r.reviewId || r.name?.split("/").pop()) === reviewId
      )

      if (!foundReview) {
        setError("Avis non trouvé")
        return
      }

      setReview(foundReview)
      // Si l'avis a déjà une réponse, l'afficher
      if (foundReview.reply?.comment) {
        setResponse(foundReview.reply.comment)
      }
    } catch (err) {
      console.error("Error loading review:", err)
      setError(err instanceof Error ? err.message : "Erreur lors du chargement de l'avis")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateResponse = async () => {
    if (!locationId || !reviewId) return

    try {
      setIsGenerating(true)
      setError(null)
      const result = await apiClient.generateReply(locationId, reviewId)
      setResponse(result.reply)
    } catch (err) {
      console.error("Error generating response:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de la génération de la réponse")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(response)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendResponse = async () => {
    if (!locationId || !reviewId || !response.trim()) return

    try {
      setIsSending(true)
      setError(null)
      await apiClient.sendReply(locationId, reviewId, response)
      setSent(true)
      setTimeout(() => {
        router.push(`/dashboard/reviews?location=${locationId}`)
      }, 2000)
    } catch (err) {
      console.error("Error sending response:", err)
      setError(err instanceof Error ? err.message : "Erreur lors de l'envoi de la réponse")
      setIsSending(false)
    }
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-slate-400">Chargement de l'avis...</p>
        </div>
      </div>
    )
  }

  if (error && !review) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" className="text-slate-400 hover:text-slate-300 gap-2 -ml-4" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
          Back to Reviews
        </Button>
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadReview} className="mt-4">
            Réessayer
          </Button>
        </div>
      </div>
    )
  }

  if (!review) {
    return null
  }

  const reviewerName = getReviewerName(review)
  const rating = getRating(review)
  const reviewDate = getReviewDate(review)

  return (
    <div className="space-y-6">
      {/* Header */}
      <Button variant="ghost" className="text-slate-600 hover:text-slate-900 gap-2 -ml-4" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />
        Back to Reviews
      </Button>

      <div>
        <h2 className="text-2xl font-bold text-slate-900">Respond to Review</h2>
        <p className="text-slate-600 text-sm mt-1">Generate and customize an AI-powered response</p>
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Review Section */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="bg-white border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-4">Original Review</h3>

            <div className="space-y-4">
              {/* Client Info */}
              <div>
                <p className="text-sm text-slate-500 mb-1">Customer</p>
                <p className="font-semibold text-slate-900">{reviewerName}</p>
              </div>

              {/* Rating */}
              <div>
                <p className="text-sm text-slate-500 mb-2">Rating</p>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-slate-900">{rating}.0</span>
                </div>
              </div>

              {/* Comment */}
              <div>
                <p className="text-sm text-slate-500 mb-2">Comment</p>
                <p className="text-slate-700 text-sm leading-relaxed bg-slate-50 rounded p-3 border border-slate-200">
                  {review.comment || "(No comment provided)"}
                </p>
              </div>

              {/* Metadata */}
              <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 space-y-1">
                <p>
                  Date: <span className="text-slate-700">{new Date(reviewDate).toLocaleDateString()}</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Response Type Guide */}
          <Card className="bg-white border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Response Strategy</h3>
            <div className="text-xs space-y-2 text-slate-600">
              <div className="flex gap-2">
                <div className="text-yellow-500 font-bold">4★</div>
                <div>Personalized based on feedback</div>
              </div>
              <div className="flex gap-2">
                <div className="text-slate-400 font-bold">3★</div>
                <div>Neutral & open to dialogue</div>
              </div>
              <div className="flex gap-2">
                <div className="text-red-500 font-bold">1-2★</div>
                <div>Empathetic & solution-focused</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Response Section */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={handleGenerateResponse}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Button>
            {response && (
              <>
                <Button
                  onClick={handleCopyResponse}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:text-slate-900 gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setResponse("")}
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:text-slate-900"
                >
                  Clear
                </Button>
              </>
            )}
          </div>

          {/* Response Editor */}
          <Card className="bg-white border-slate-200">
            <div className="p-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Your Response</label>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Your response will appear here. Click 'Generate with AI' to create a response, or write one manually..."
                className="min-h-64 bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 resize-none"
              />
              <div className="mt-3 text-xs text-slate-500">{response.length} characters</div>
            </div>
          </Card>

          {/* Preview */}
          {response && (
            <Card className="bg-white border-slate-200 p-6">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Preview</h3>
              <div className="bg-slate-50 rounded border border-slate-200 p-4 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                {response}
              </div>
            </Card>
          )}

          {/* Action Buttons */}
          {response && (
            <div className="flex gap-3">
              <Button
                onClick={handleSendResponse}
                disabled={isSending || sent}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 gap-2"
              >
                {sent ? (
                  <>
                    <Check className="w-4 h-4" />
                    Response Sent!
                  </>
                ) : isSending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Response
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="border-slate-300 text-slate-700 hover:text-slate-900"
                disabled={isSending}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
