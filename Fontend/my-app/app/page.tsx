"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Zap, Shield } from "lucide-react"

export default function HomePage() {
  // Éviter l'erreur d'hydratation en ne rendant les particules qu'après le montage côté client
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Générer les particules de manière stable uniquement côté client
  const particles = useMemo(() => {
    if (!isMounted) return []
    return Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
    }))
  }, [isMounted])

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 -left-20 w-96 h-96 bg-blue-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 -right-20 w-96 h-96 bg-purple-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-pink-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
        
        {/* Floating Particles */}
        {isMounted && (
          <div className="absolute inset-0">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-float"
                style={{
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animationDelay: `${particle.delay}s`,
                  animationDuration: `${particle.duration}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] opacity-30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="border-b border-slate-200 bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Ansview</span>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link href="/about" className="hover:text-blue-600 transition-colors">
                À propos
              </Link>
              <Link href="/services" className="hover:text-blue-600 transition-colors">
                Nos services
              </Link>
              <Link href="/abonnement" className="hover:text-blue-600 transition-colors">
                Abonnement
              </Link>
            </div>
            <div className="md:hidden flex items-center gap-3 text-sm font-medium text-slate-600">
              <Link href="/about" className="hover:text-blue-600 transition-colors">
                À propos
              </Link>
              <Link href="/services" className="hover:text-blue-600 transition-colors">
                Services
              </Link>
              <Link href="/abonnement" className="hover:text-blue-600 transition-colors">
                Abonnement
              </Link>
            </div>
            <div className="flex gap-4">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center space-y-6 md:space-y-8 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-slate-900 text-balance animate-slide-up">
              Manage Google Reviews <span className="text-blue-600">Automatically</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto text-balance animate-slide-up animation-delay-200">
              Let AI-powered responses handle your Google My Business reviews. Save time, maintain your reputation, and
              delight your customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-up animation-delay-400">
              <Link href="/login">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto gap-2 hover:scale-105 transition-transform">
                  Start Free Trial <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-300 text-slate-700 hover:text-slate-900 hover:bg-slate-100 w-full sm:w-auto bg-transparent hover:scale-105 transition-transform"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-200">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-16 animate-fade-in">Powerful Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="w-6 h-6" />,
                title: "AI-Powered Responses",
                description:
                  "ChatGPT generates contextual, personalized responses based on review sentiment and content.",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Safe & Secure",
                description:
                  "Review and edit all responses before sending. Full control over your reputation management.",
              },
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Analytics",
                description: "Track sentiment, response rates, and manage multiple locations from one dashboard.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all animate-fade-in hover:scale-105 hover:-translate-y-1"
                style={{
                  animationDelay: `${idx * 100 + 200}ms`,
                }}
              >
                <div className="text-blue-600 mb-4 transform transition-transform hover:scale-110">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
