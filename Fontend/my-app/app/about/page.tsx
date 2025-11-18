import Link from "next/link"
import { ArrowLeft, Sparkle, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <header className="border-b border-slate-200 bg-white/70 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <Link
            href="/"
            className="text-slate-500 hover:text-blue-600 inline-flex items-center gap-2 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </header>

      <main className="relative z-10">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center space-y-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide uppercase text-blue-600">
            <Sparkle className="w-4 h-4" />
            Notre mission
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance">
            Nous aidons les entreprises à répondre à chaque avis avec empathie
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            Ansview est né d&apos;un constat simple : il faut aujourd&apos;hui une équipe entière pour offrir des
            réponses personnalisées aux avis clients. Notre plateforme déploie l&apos;IA de manière responsable pour
            faire gagner du temps aux équipes, sans perdre l&apos;humanité qui construit la confiance.
          </p>
        </section>

        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28 grid gap-10 md:grid-cols-2">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Pourquoi Ansview ?</h2>
            <p className="text-slate-600 leading-relaxed">
              Nous combinons l&apos;expertise en gestion de réputation et les technologies d&apos;IA pour proposer des
              réponses cohérentes, pertinentes et toujours alignées avec votre tonalité de marque. Notre équipe suit chaque
              évolution de l&apos;écosystème Google pour que vous n&apos;ayez pas à le faire.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">Notre engagement</h2>
            <p className="text-slate-600 leading-relaxed">
              La transparence et la sécurité guident nos décisions. La plateforme vous laisse valider chaque réponse avant
              envoi, et nos modèles apprennent de vos retours pour s&apos;adapter à votre culture d&apos;entreprise. Nous
              nous engageons à protéger vos données et celles de vos clients.
            </p>
          </div>
        </section>

        <section className="bg-white/80 border-t border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20 grid gap-10 md:grid-cols-[1.1fr,0.9fr] items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold text-slate-900">Une équipe passionnée par l&apos;expérience client</h2>
              <p className="text-slate-600 leading-relaxed">
                Nos spécialistes support client, data scientists et designers travaillent main dans la main pour fournir
                un produit sobre, efficace et centré sur l&apos;utilisateur. Nous croyons qu&apos;un bon outil doit être
                aussi agréable à utiliser qu&apos;un échange avec un conseiller dédié.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-8 space-y-4">
              <div className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 uppercase tracking-wide">
                <Users className="w-5 h-5" />
                Quelques repères
              </div>
              <ul className="space-y-4 text-left">
                <li className="flex justify-between text-slate-700 font-medium">
                  <span>+150 entreprises accompagnées</span>
                  <span className="text-blue-600">depuis 2023</span>
                </li>
                <li className="flex justify-between text-slate-700 font-medium">
                  <span>95% de satisfaction</span>
                  <span className="text-blue-600">sur nos réponses</span>
                </li>
                <li className="flex justify-between text-slate-700 font-medium">
                  <span>Support humain réactif</span>
                  <span className="text-blue-600">en français et anglais</span>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

