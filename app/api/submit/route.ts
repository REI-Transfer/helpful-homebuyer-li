import { NextResponse } from "next/server"
import config from "@/lib/config"

// Hardcoded service-area lock — Long Island (Nassau + Suffolk).
// Defense-in-depth: Google Places is already locked to longIslandBounds
// client-side, and survey-card validates the county before sending. This
// is the server-side backstop in case a client bypasses the browser checks.
const ALLOWED_COUNTIES: Set<string> = new Set(["NASSAU", "SUFFOLK"])

function normalizeCounty(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s*COUNTY$/i, "").trim()
}

// Simple in-memory rate limiter (resets on deploy/restart)
const submissionLog = new Map<string, { count: number; firstSubmit: number }>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const window = 60 * 60 * 1000 // 1 hour
  const maxSubmissions = 3

  const entry = submissionLog.get(ip)
  if (!entry) {
    submissionLog.set(ip, { count: 1, firstSubmit: now })
    return false
  }

  // Reset window if expired
  if (now - entry.firstSubmit > window) {
    submissionLog.set(ip, { count: 1, firstSubmit: now })
    return false
  }

  entry.count++
  return entry.count > maxSubmissions
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
      || request.headers.get("x-real-ip")
      || "unknown"

    // Rate limit: max 3 submissions per IP per hour
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429 }
      )
    }

    const data = await request.json()
    const stage = data.lead_stage || 'complete' // 'early' | 'complete'

    // Server-side validation (applies to BOTH stages)
    const phone = (data.phone || "").replace(/\D/g, "").replace(/^1/, "")
    if (phone.length !== 10) {
      return NextResponse.json({ success: false, error: "Invalid phone" }, { status: 400 })
    }

    const email = (data.email || "").trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ success: false, error: "Invalid email" }, { status: 400 })
    }

    // Accept either single 'name' (legacy) or 'firstName'+'lastName' (two-stage form)
    const hasName = (data.name || "").trim()
    const hasFirstName = (data.firstName || "").trim()
    if (!hasName && !hasFirstName) {
      return NextResponse.json({ success: false, error: "Name required" }, { status: 400 })
    }

    if (!(data.address || "").trim()) {
      return NextResponse.json({ success: false, error: "Address required" }, { status: 400 })
    }

    // County gate — only Nassau + Suffolk are accepted. Run on both stages so a
    // tampered Stage-1 payload can't slip past either.
    const countyKey = normalizeCounty(data.county || "")
    if (!ALLOWED_COUNTIES.has(countyKey)) {
      return NextResponse.json(
        { success: false, error: "Outside service area" },
        { status: 400 }
      )
    }

    const serverUserAgent = request.headers.get("user-agent") || ""
    const payload = { ...data, server_ip: ip, server_user_agent: serverUserAgent, lead_stage: stage }

    // Webhook routing: same URL for both stages by default; n8n branches on
    // `lead_stage`. Optional split via WEBHOOK_URL_EARLY / WEBHOOK_URL_COMPLETE.
    const earlyUrl = config.webhookUrlEarly || config.webhookUrl
    const completeUrl = config.webhookUrlComplete || config.webhookUrl
    const webhookUrl = stage === 'early' ? earlyUrl : completeUrl

    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
    }

    return NextResponse.json({ success: true, stage })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
