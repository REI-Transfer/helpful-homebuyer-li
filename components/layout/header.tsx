import { Phone } from "lucide-react"
import Image from "next/image"

interface HeaderProps {
  companyName: string
  phoneDisplay: string
  phoneHref: string
  logoUrl: string
  headerBgColor?: string
}

export function Header({ companyName, phoneDisplay, phoneHref, logoUrl, headerBgColor = "#ffffff" }: HeaderProps) {
  const isDark = headerBgColor !== "#ffffff" && headerBgColor !== "white"

  return (
    <header className="w-full shadow-sm" style={{ backgroundColor: headerBgColor }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo + Company Name */}
        <div className="flex items-center gap-3">
          {logoUrl && (
            <Image
              src={logoUrl}
              alt={companyName}
              width={44}
              height={44}
              className="h-11 w-11 flex-shrink-0 rounded-lg object-contain"
              unoptimized
            />
          )}
          <span
            className="text-base font-bold leading-tight"
            style={{ color: isDark ? "white" : "var(--accent)" }}
          >
            {companyName}
          </span>
        </div>

        {/* Phone CTA */}
        <a
          href={`tel:${phoneHref}`}
          className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--accent)" }}
        >
          <Phone className="h-4 w-4" />
          <span className="hidden sm:inline">{phoneDisplay}</span>
          <span className="sm:hidden">Call Now</span>
        </a>
      </div>
    </header>
  )
}
