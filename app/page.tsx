import Image from "next/image"
import { Shield, Clock, DollarSign } from "lucide-react"
import { SurveyCard } from "@/components/survey/survey-card"
import { VSLSection } from "@/components/survey/vsl-section"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import config from "@/lib/config"

export default function HomePage() {
  // Parse service areas for client-side validation
  let parsedServiceAreas: Array<{ id: string; centerLat: number; centerLng: number; radiusMiles: number }> = []
  try { parsedServiceAreas = JSON.parse(config.serviceAreas) } catch {}

  return (
    <main className="relative min-h-screen" style={{ backgroundColor: config.accentColor }}>
      <div className="relative z-10">
        <Header
          companyName={config.companyName}
          phoneDisplay={config.phoneDisplay}
          phoneHref={config.phoneHref}
          logoUrl={config.logoUrl}
          headerBgColor={config.headerBgColor}
        />

        <div className="mx-auto max-w-7xl px-4 py-4 md:py-6 lg:px-8">
          {/* Hero */}
          <div className="mx-auto text-center">
            {/* Trust badge stripe */}
            <div className="mb-4 flex flex-wrap items-center justify-center gap-6">
              <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                <Shield className="h-4 w-4 text-white" />
                <span>Trusted</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                <Clock className="h-4 w-4 text-white" />
                <span>24-Hour Cash Offers</span>
              </div>
              <div className="flex items-center gap-2 text-white/80 text-sm md:text-base">
                <DollarSign className="h-4 w-4 text-white" />
                <span>No Fees. No Commissions.</span>
              </div>
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-[3.75rem] lg:leading-[1.15] text-balance">
              {config.headline}
              {config.headlineAccent && (
                <span className="text-white/80"> {config.headlineAccent}</span>
              )}
            </h1>
            <p className="mt-2 md:mt-3 text-base md:text-lg text-white/70">
              {config.subheadline}
            </p>
          </div>

          {/* Survey Form */}
          <div className="mt-4 md:mt-6 mx-auto max-w-3xl">
            <SurveyCard
              phoneDisplay={config.phoneDisplay}
              phoneHref={config.phoneHref}
              serviceAreas={parsedServiceAreas}
            />
          </div>

          {/* Owner / Founder section — shows when ownerName or headshotUrl is set */}
          {(config.ownerName || config.headshotUrl) && (
            <div className="mt-8 md:mt-12 mx-auto flex flex-col items-center gap-3">
              {config.headshotUrl && (
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2" style={{ borderColor: "rgba(255,255,255,0.5)" }}>
                  <Image
                    src={config.headshotUrl}
                    alt={config.ownerName || config.companyName}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
              {config.ownerName && (
                <div className="text-center">
                  <p className="text-base font-semibold text-white">{config.ownerName}</p>
                  <p className="text-sm text-white/60">{config.companyName}</p>
                </div>
              )}
            </div>
          )}

          {/* VSL (conditional on env vars) */}
          <div className="mt-6 md:mt-8 mx-auto max-w-4xl">
            <VSLSection />
          </div>
        </div>

        <Footer
          companyName={config.companyName}
          phoneDisplay={config.phoneDisplay}
          phoneHref={config.phoneHref}
          privacyPolicyUrl={config.privacyPolicyUrl}
          termsUrl={config.termsUrl}
        />
      </div>
    </main>
  )
}
