import { CheckCircle2, MessagesSquare, ShieldCheck, Sparkles } from "lucide-react"

const services = [
  {
    title: "Réponses assistées par IA",
    description:
      "Générez des brouillons contextualisés basés sur le ton de votre marque et la polarité de chaque avis. Ajustez-les en un clic avant publication.",
    icon: Sparkles,
    highlights: ["Ton personnalisé", "Traduction automatique", "Historique d'apprentissage"],
  },
  {
    title: "Pilotage multi-enseignes",
    description:
      "Centralisez vos établissements et gérez chaque flux d'avis depuis un tableau de bord unique. Hiérarchisez les priorités grâce aux alertes intelligentes.",
    icon: MessagesSquare,
    highlights: ["Vue consolidée", "Alertes en temps réel", "Flux d'approbation"],
  },
  {
    title: "Sécurité et conformité",
    description:
      "Vos données et celles de vos clients sont chiffrées et stockées dans l'Union Européenne. Nous appliquons les meilleures pratiques RGPD.",
    icon: ShieldCheck,
    highlights: ["Chiffrement bout en bout", "Audit de permissions", "Conformité RGPD"],
  },
]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
          <span className="inline-flex items-center justify-center gap-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
            <Sparkles className="w-4 h-4" />
            Nos services
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 text-balance">
            Automatiser l&apos;essentiel pour retrouver du temps humain
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
            Nous concevons chaque fonctionnalité pour sécuriser votre réputation, optimiser vos opérations et renforcer
            vos équipes relation client. Découvrez les services modulaires qui composent Ansview.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
        <section className="grid gap-8 md:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm hover:border-blue-200 hover:shadow-lg transition-all"
            >
              <service.icon className="w-10 h-10 text-blue-600 mb-6" />
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">{service.title}</h2>
              <p className="text-slate-600 leading-relaxed mb-6">{service.description}</p>
              <ul className="space-y-2 text-sm text-slate-600">
                {service.highlights.map((highlight) => (
                  <li key={highlight} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <section className="bg-white border border-blue-100 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row gap-10 items-center">
          <div className="space-y-4 md:flex-1">
            <h2 className="text-3xl font-semibold text-slate-900">Accompagnement premium</h2>
            <p className="text-slate-600 leading-relaxed">
              Une équipe Customer Success dédiée vous aide à déployer la plateforme, former vos collaborateurs et
              suivre les KPIs importants pour votre direction. Nous co-construisons des modèles de réponses métiers et
              ajustons les workflows selon votre organisation.
            </p>
          </div>
          <div className="md:w-80 w-full bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-3 text-slate-700">
            <h3 className="text-lg font-semibold text-blue-700">Livrables inclus</h3>
            <ul className="space-y-2 text-sm">
              <li>Audit initial des avis et priorités</li>
              <li>Onboarding de vos établissements</li>
              <li>Playbook de réponses personnalisé</li>
              <li>Sessions de coaching trimestrielles</li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  )
}

