// Capture UTM parameters, click IDs, FBP/FBC Facebook cookies, and IP address
// First-touch attribution persisted in localStorage so multi-step surveys
// keep the originating campaign/click data even if the user reloads or
// navigates without UTM params.

interface TrackingData {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_content: string
  utm_term: string
  fbclid: string
  gclid: string
  msclkid: string
  ttclid: string
  fbp: string                       // _fbp cookie  (Facebook Browser ID)
  fbc: string                       // _fbc cookie  (Facebook Click ID, formatted)
  ip: string
  referrer: string
  landing_page: string
  user_agent: string
  attribution_captured_at: string
}

const STORAGE_KEY = "rei_attribution"

function emptyTracking(): TrackingData {
  return {
    utm_source: "", utm_medium: "", utm_campaign: "",
    utm_content: "", utm_term: "", fbclid: "", gclid: "",
    msclkid: "", ttclid: "", fbp: "", fbc: "",
    ip: "", referrer: "", landing_page: "", user_agent: "",
    attribution_captured_at: "",
  }
}

function getCookie(name: string): string {
  if (typeof document === "undefined") return ""
  const parts = `; ${document.cookie}`.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() || ""
  return ""
}

// Returns the _fbp cookie set by Meta's pixel. Format: fb.1.{ts}.{rand}
function getFbp(): string {
  return getCookie("_fbp")
}

// Returns _fbc cookie if present; otherwise builds one from the fbclid URL param.
// Format Meta expects: fb.1.{timestamp_ms}.{fbclid}
function getFbc(fbclid: string): string {
  const existing = getCookie("_fbc")
  if (existing) return existing
  if (fbclid) return `fb.1.${Date.now()}.${fbclid}`
  return ""
}

function readFresh(): TrackingData {
  if (typeof window === "undefined") return emptyTracking()

  const params = new URLSearchParams(window.location.search)
  const fbclid = params.get("fbclid") || ""

  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    fbclid,
    gclid: params.get("gclid") || "",
    msclkid: params.get("msclkid") || "",
    ttclid: params.get("ttclid") || "",
    fbp: getFbp(),
    fbc: getFbc(fbclid),
    ip: "",
    referrer: document.referrer || "",
    landing_page: window.location.href,
    user_agent: navigator.userAgent || "",
    attribution_captured_at: new Date().toISOString(),
  }
}

export function captureTrackingData(): TrackingData {
  if (typeof window === "undefined") return emptyTracking()

  const fresh = readFresh()
  const hasNewAttribution =
    !!(fresh.utm_source || fresh.utm_medium || fresh.utm_campaign ||
       fresh.fbclid || fresh.gclid || fresh.msclkid || fresh.ttclid)

  try {
    if (hasNewAttribution) {
      // This visit brought new attribution. Save as truth, return as-is.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
      return fresh
    }

    // Direct visit (no UTMs / click IDs). Restore prior attribution if we have it,
    // but keep current session values for fbp/fbc/user_agent/landing_page.
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const prior = JSON.parse(stored) as TrackingData
      return {
        ...prior,
        fbp: fresh.fbp || prior.fbp,
        fbc: fresh.fbc || prior.fbc,
        ip: prior.ip,
        referrer: fresh.referrer || prior.referrer,
        landing_page: fresh.landing_page,
        user_agent: fresh.user_agent,
      }
    }
  } catch {
    // localStorage unavailable (private browsing, quota); fall through
  }

  return fresh
}

export async function getIPAddress(): Promise<string> {
  try {
    const res = await fetch("https://api.ipify.org?format=json", { signal: AbortSignal.timeout(3000) })
    const data = await res.json()
    return data.ip || ""
  } catch {
    return ""
  }
}
