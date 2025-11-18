"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api"

interface User {
  displayName: string
  email: string
  picture?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  hasBusinessAccess: boolean
  login: () => void
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hasBusinessAccess, setHasBusinessAccess] = useState(false)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      setIsLoading(true)
      const status = await apiClient.getAuthStatus()
      setIsAuthenticated(status.isAuthenticated)
      setUser(status.user || null)
      setHasBusinessAccess(status.hasBusinessAccess || false)
    } catch (error) {
      console.error("Error checking auth status:", error)
      setIsAuthenticated(false)
      setUser(null)
      setHasBusinessAccess(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = () => {
    // Rediriger vers l'endpoint Google OAuth du backend
    window.location.href = apiClient.getGoogleAuthUrl()
  }

  const logout = async () => {
    try {
      await apiClient.logout()
      setUser(null)
      setIsAuthenticated(false)
      setHasBusinessAccess(false)
      router.push("/login")
    } catch (error) {
      console.error("Error logging out:", error)
      // Même en cas d'erreur, on déconnecte localement
      setUser(null)
      setIsAuthenticated(false)
      setHasBusinessAccess(false)
      router.push("/login")
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        hasBusinessAccess,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

