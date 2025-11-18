const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface ApiResponse<T> {
  success?: boolean
  error?: string
  data?: T
  [key: string]: any
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      credentials: 'include', // Important pour les sessions avec cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`
      let errorBody: ApiResponse<unknown> | null = null

      try {
        errorBody = await response.json()
      } catch (parseError) {
        // Ignore JSON parse errors – we'll fall back to the default message
      }

      const nestedError = errorBody?.error
      const nestedErrorMessage =
        typeof nestedError === 'object' &&
        nestedError !== null &&
        'message' in nestedError &&
        typeof (nestedError as { message?: unknown }).message === 'string'
          ? (nestedError as { message: string }).message
          : null
      const topLevelMessage =
        errorBody && 'message' in errorBody && typeof (errorBody as { message?: unknown }).message === 'string'
          ? (errorBody as { message: string }).message
          : null
      const candidateMessages = [
        typeof nestedError === 'string' ? nestedError : null,
        nestedErrorMessage,
        topLevelMessage,
      ].filter((value): value is string => Boolean(value && value.trim().length > 0))

      const isQuotaError =
        response.status === 429 ||
        (typeof nestedError === 'object' &&
          nestedError !== null &&
          'status' in nestedError &&
          (nestedError as { status?: string }).status === 'RESOURCE_EXHAUSTED')

      if (candidateMessages.length > 0) {
        errorMessage = candidateMessages[0]
      } else if (isQuotaError) {
        errorMessage =
          'Le quota de l’API Google Business a été dépassé. Veuillez réessayer dans quelques minutes.'
      }

      if (isQuotaError && errorMessage === `HTTP error! status: ${response.status}`) {
        errorMessage =
          'Le quota de l’API Google Business a été dépassé. Veuillez réessayer dans quelques minutes.'
      }

      throw new Error(errorMessage || 'Une erreur est survenue')
    }

    return response.json()
  }

  // Auth endpoints
  async getAuthStatus() {
    return this.request<{
      isAuthenticated: boolean
      user?: {
        displayName: string
        email: string
        picture: string
      }
      hasBusinessAccess?: boolean
    }>('/auth/status')
  }

  async logout() {
    return this.request<{ success: boolean; message: string }>('/auth/logout')
  }

  getGoogleAuthUrl() {
    return `${this.baseURL}/auth/google`
  }

  async getSettings() {
    return this.request<{
      success: boolean
      user: {
        displayName: string
        email: string
        picture?: string
      }
      settings: {
        company?: string
        timezone?: string
        language?: string
        emailNotifications?: boolean
        autoApproveResponses?: boolean
        weeklySummary?: boolean
        updatedAt?: string
      }
    }>('/auth/settings')
  }

  async updateSettings(settings: {
    company?: string
    timezone?: string
    language?: string
    emailNotifications?: boolean
    autoApproveResponses?: boolean
    weeklySummary?: boolean
  }) {
    return this.request<{
      success: boolean
      message: string
      settings: {
        company?: string
        timezone?: string
        language?: string
        emailNotifications?: boolean
        autoApproveResponses?: boolean
        weeklySummary?: boolean
        updatedAt?: string
      }
    }>('/auth/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }

  // Business endpoints
  async getLocations() {
    return this.request<{
      success: boolean
      locations: Array<{
        locationId: string
        name: string
        title?: string
        address?: string
        rating?: number
        reviewCount?: number
        isFollowed: boolean
      }>
      count: number
    }>('/business/locations')
  }

  async getFollowedLocations() {
    return this.request<{
      success: boolean
      locations: Array<{
        locationId: string
        name: string
        title?: string
        address?: string
        rating?: number
        reviewCount?: number
        isFollowed: boolean
      }>
      count: number
    }>('/business/locations/followed')
  }

  async followLocation(locationId: string) {
    return this.request<{
      alreadyFollowed: any
      success: boolean
      message: string
      locationId: string
      totalFollowed: number
    }>(`/business/locations/${locationId}/follow`, {
      method: 'POST',
    })
  }

  async unfollowLocation(locationId: string) {
    return this.request<{
      success: boolean
      message: string
      locationId: string
      totalFollowed: number
    }>(`/business/locations/${locationId}/follow`, {
      method: 'DELETE',
    })
  }

  async getReviews(locationId: string) {
    return this.request<{
      success: boolean
      reviews: Array<{
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
      }>
      count: number
    }>(`/business/locations/${locationId}/reviews`)
  }

  async generateReply(locationId: string, reviewId: string) {
    return this.request<{
      success: boolean
      reply: string
      type: string
      generated: boolean
    }>(`/business/locations/${locationId}/reviews/${reviewId}/generate-reply`, {
      method: 'POST',
    })
  }

  async sendReply(locationId: string, reviewId: string, comment: string) {
    return this.request<{
      success: boolean
      message: string
      reply?: {
        comment: string
      }
    }>(`/business/locations/${locationId}/reviews/${reviewId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    })
  }

  async getBusinessStatus() {
    return this.request<{
      connected: boolean
      accountsCount?: number
      followedLocationsCount?: number
      followedLocationIds?: string[]
      message?: string
      isMockMode?: boolean
    }>('/business/status')
  }

  async getAnalytics() {
    return this.request<{
      success: boolean
      analytics: {
        totalReviews: number
        averageRating: number
        responseRate: number
        pendingReviews: number
        sentimentDistribution: {
          positive: number
          neutral: number
          negative: number
        }
        reviewsTrend: Array<{
          date: string
          reviews: number
          replied: number
        }>
        responseRateTrend: Array<{
          week: string
          rate: number
        }>
        sentimentStats: Array<{
          label: string
          value: number
          percentage: number
        }>
        sentimentData: Array<{
          name: string
          value: number
        }>
      }
    }>('/business/analytics')
  }

  // Chatbot endpoints
  async generateChatbotResponse(prompt: string) {
    return this.request<{
      response: string
    }>('/chatbot/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

