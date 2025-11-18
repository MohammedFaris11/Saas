import Link from "next/link"
import { ArrowRight, Check } from "lucide-react"

const plans = [
  {
    name: "Essentiel",
    price: "79€",
    period: "par mois",
    description: "Pour les petites structures qui souhaitent automatiser la gestion des avis.",
    features: [
      "Jusqu'à 3 établissements",
      "100 réponses assistées / mois",
      "Validation manuelle illimitée",
      "Support email sous 24h",
    ],
    cta: "Demander une démo",
    highlighted: false,
  },
  {
    name: "Croissance",
    price: "149€",
    period: "par mois",
    description: "Pensé pour les équipes marketing multi-sites qui veulent aller plus loin.",
    features: [
      "Jusqu'à 15 établissements",
      "Réponses assistées illimitées",
      "Modèles de tonalité personnalisés",
      "Tableau de bord analytics complet",
      "Support prioritaire (chat & email)",
    ],
    cta: "Parler à un expert",
    highlighted: true,
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    period: "",
    description: "Pour les réseaux nationaux et besoins spécifiques (SLA, intégrations internes).",
    features: [
      "Nombre d'établissements illimité",
      "Workflows d'approbation avancés",
      "SSO & permissions granulaires",
      "Intégrations sur mesure (API, BI)",
      "Customer Success dédié",
    ],
    cta: "Planifier un appel",
    highlighted: false,
  },
]

export default function AbonnementPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-slate-50">
      <header className="border-b border-slate-200 bg-white/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Choisissez le plan qui vous correspond</h1>
          <p className="max-w-3xl mx-auto text-lg text-slate-600">
            Chaque abonnement inclut l&apos;accès à notre moteur de réponses IA, la gestion centralisée des avis et des
            mises à jour régulières. Passez à l&apos;échelle sans sacrifier la qualité de votre relation client.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
        <section className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative bg-white rounded-3xl border ${
                plan.highlighted ? "border-blue-300 shadow-2xl" : "border-slate-200 shadow-md"
              } p-8 flex flex-col gap-6`}
            >
              {plan.highlighted && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold tracking-wide uppercase px-4 py-1 rounded-full shadow-md">
                  Plus populaire
                </span>
              )}
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">{plan.name}</h2>
                <p className="text-slate-600 mt-2">{plan.description}</p>
              </div>
              <div className="text-slate-900">
                <span className="text-4xl font-bold">{plan.price}</span>{" "}
                <span className="text-sm font-medium text-slate-500">{plan.period}</span>
              </div>
              <ul className="space-y-3 text-sm text-slate-600">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`inline-flex items-center justify-center gap-2 rounded-xl py-3 px-4 text-sm font-semibold transition-all ${
                  plan.highlighted
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                    : "bg-slate-900/5 hover:bg-slate-900/10 text-slate-900"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </article>
          ))}
        </section>

        <section className="bg-white border border-slate-200 rounded-3xl p-10 md:p-14 space-y-6">
          <h3 className="text-2xl font-semibold text-slate-900">Questions fréquentes</h3>
          <div className="grid gap-6 md:grid-cols-2 text-sm text-slate-600 leading-relaxed">
            <div>
              <p className="font-medium text-slate-900 mb-2">Puis-je changer de plan à tout moment ?</p>
              <p>
                Oui, vous pouvez mettre à niveau ou rétrograder votre abonnement quand vous le souhaitez. Les changements
                sont appliqués immédiatement et un prorata est calculé automatiquement.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900 mb-2">Proposez-vous une période d&apos;essai ?</p>
              <p>
                Nous offrons un essai gratuit de 14 jours sur le plan Essentiel afin de découvrir l&apos;interface et les
                fonctionnalités principales sans carte bancaire.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900 mb-2">Quelles sont les options de paiement ?</p>
              <p>
                Nous acceptons les paiements par carte bancaire et prélèvement SEPA. Les factures sont disponibles dans
                votre espace client et peuvent être envoyées automatiquement à votre service comptable.
              </p>
            </div>
            <div>
              <p className="font-medium text-slate-900 mb-2">Comment fonctionne l&apos;accompagnement ?</p>
              <p>
                Chaque abonnement inclut un onboarding guidé. À partir du plan Croissance, vous disposez d&apos;un
                Customer Success Manager dédié qui suit vos indicateurs et organise des points réguliers.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

