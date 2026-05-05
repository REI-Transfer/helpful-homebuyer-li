import Image from "next/image"
import { CheckCircle2, Phone } from "lucide-react"
import config from "@/lib/config"
import { LeadEvent } from "@/components/tracking/lead-event"

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Fire Facebook Lead event once pixel is ready */}
      <LeadEvent />

      <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
        {/* Confirmation icon */}
        <div className="flex justify-center mb-6">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-full"
            style={{ backgroundColor: `${config.accentColor}20` }}
          >
            <CheckCircle2 className="h-8 w-8" style={{ color: config.accentColor }} />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Thank You for Your Submission!
          </h1>
          <p className="mt-3 text-lg text-gray-600 max-w-lg mx-auto">
            The {config.companyName} team has received your information and will be in touch within{" "}
            <strong>24 hours</strong> with your cash offer. In the meantime, here are answers to common questions.
          </p>
        </div>

        {/* Video section */}
        {process.env.NEXT_PUBLIC_THANKYOU_VIDEO_URL && (
          <div className="mb-8">
            <h2 className="mb-3 text-center text-xl font-bold text-gray-900">
              Watch This While You Wait
            </h2>
            <div className="mx-auto max-w-xs overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              <video
                src={process.env.NEXT_PUBLIC_THANKYOU_VIDEO_URL}
                controls
                playsInline
                className="w-full"
              />
            </div>
          </div>
        )}

        {/* Personal note card */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 mb-6">
          <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">
            A Personal Note
          </p>
          {config.ownerName ? (
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              From {config.ownerName}
            </h2>
          ) : (
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              From Our Team
            </h2>
          )}

          {/* Owner headshot (if available) */}
          {config.headshotUrl && (
            <div className="flex items-center gap-3 mb-5">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border-2" style={{ borderColor: config.accentColor }}>
                <Image
                  src={config.headshotUrl}
                  alt={config.ownerName || config.companyName}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{config.ownerName || config.companyName}</p>
                <p className="text-xs text-gray-500">{config.companyName}</p>
              </div>
            </div>
          )}

          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              If you&apos;re reading this, you just took a step that most homeowners put off for months. Maybe years.
              So before anything else &mdash; we want you to know that was the right call.
            </p>
            <p>
              Selling a house is stressful. The uncertainty, the waiting, the feeling like you&apos;re at the mercy of a system
              that wasn&apos;t built for you. Realtors want you to fix everything up, stage the house, wait 90 days,
              and hope for the best. That works for some people. But not everyone.
            </p>
            <p>
              We started {config.companyName} because we kept meeting good people stuck in bad situations. Inherited properties
              they couldn&apos;t afford to keep. Houses that needed more work than they had time or money for. Divorces,
              job relocations, tax liens &mdash; life happens. And when it does, the last thing you need is someone telling
              you to repaint your kitchen and &ldquo;list it in the spring.&rdquo;
            </p>
            <p>
              Here&apos;s what happens next: Our team is going to review the information you submitted. Within 24 hours,
              you&apos;ll hear from us with a fair, no-obligation cash offer. No pressure. No games. If the number works
              for you, great. If it doesn&apos;t, no hard feelings. We&apos;ll still answer any questions you have.
            </p>
          </div>
        </div>

        {/* What happens next */}
        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6 md:p-8 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">What Happens Next</h3>
          <div className="space-y-4">
            {[
              { step: "1", title: "We review your property", desc: "Our team looks at your submission and researches the property." },
              { step: "2", title: "You get a cash offer", desc: "Within 24 hours, we\u2019ll reach out with a fair, no-obligation offer." },
              { step: "3", title: "You choose your closing date", desc: "If you accept, you pick the date. We handle the rest." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: config.accentColor }}
                >
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{title}</p>
                  <p className="text-sm text-gray-500">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call CTA */}
        <div className="text-center">
          <p className="text-gray-500 mb-4">Have questions in the meantime? Give us a call.</p>
          <a
            href={`tel:${config.phoneHref}`}
            className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-lg font-semibold text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: config.accentColor }}
          >
            <Phone className="h-5 w-5" />
            {config.phoneDisplay}
          </a>
          <p className="mt-10 text-sm text-gray-400">
            &copy; {new Date().getFullYear()} {config.companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </main>
  )
}
