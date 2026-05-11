// Jenkins Homebuyers — two-stage lead scoring.
// Stage 1 (contact captured) fires `LeadEarly` (track-only).
// Stage 2 (deep qualification) fires `Lead` (Meta optimization event)
//   with weighted value, OR `LeadLowIntent` if score is too low / soft-fail.

export type Stage1Data = {
  address: string
  state?: string
  county?: string
  city?: string
  isLegalOwner: string  // yes-owner | yes-family | no
  listedOnMarket: string  // not-listed | listed-realtor | listed-fsbo
  firstName: string
  lastName: string
  email: string
  phone: string
}

export type Stage2Data = {
  propertyType: string  // single-family | multi-family | condo-townhouse | mobile-home | land | other
  timeline: string  // asap | 30-days | 60-days | 90-days | flexible
  askingPrice: string  // under-150k | 150k-250k | 250k-350k | 350k-500k | over-500k | flexible
  condition: string  // distressed | poor | fair | good | excellent
  reason: string  // foreclosure | behind-payments | inherited | divorce | relocation | downsizing | repairs | tired-landlord | other
  ownershipLength?: string  // optional, only present when NEXT_PUBLIC_SHOW_OWNERSHIP_LENGTH is enabled
                            // values: 1-3-years | 3-5-years | 5-10-years | 10-plus-years
}

// DMV asking-price tiers (DC / MD / Northern VA / Baltimore)
// Tuned for Express Homebuyers wholesale activity.
// DMV median home values: DC ~$700k, NoVA ~$650-800k, MD suburbs ~$500-700k,
// Baltimore ~$300-400k. Wholesale sweet spot is $200k-$400k.
export const ASKING_PRICE_OPTIONS = [
  { id: 'under-200k', label: 'Under $200,000' },
  { id: '200k-300k', label: '$200,000 – $300,000' },
  { id: '300k-450k', label: '$300,000 – $450,000' },
  { id: '450k-650k', label: '$450,000 – $650,000' },
  { id: 'over-650k', label: 'Over $650,000' },
]

// --- Score weights ---
const SCORE_TIMELINE: Record<string, number> = {
  'asap': 5,
  '30-days': 4,
  '60-days': 3,
  '90-days': 2,
  'flexible': 1,
}

const SCORE_ASKING_PRICE: Record<string, number> = {
  'under-200k': 3,
  '200k-300k': 3,
  '300k-450k': 2,
  '450k-650k': 1,
  'over-650k': 0,
}

const SCORE_CONDITION: Record<string, number> = {
  'distressed': 3,
  'poor': 3,
  'fair': 2,
  'good': 1,
  'excellent': 0,
}

const SCORE_REASON: Record<string, number> = {
  'foreclosure': 3,
  'behind-payments': 3,
  'inherited': 3,
  'tired-landlord': 3,
  'divorce': 2,
  'relocation': 2,
  'repairs': 2,
  'downsizing': 1,
  'other': 1,
}

// --- Hard property filter (soft-fail = LeadLowIntent, no Meta optimization) ---
export function isPropertyTypeAccepted(propertyType: string): boolean {
  return propertyType === 'single-family' || propertyType === 'multi-family'
}

// Ownership length adds equity signal — only contributes when the question is enabled
// (NEXT_PUBLIC_SHOW_OWNERSHIP_LENGTH=true). 10+ years = highest equity = highest score.
const SCORE_OWNERSHIP: Record<string, number> = {
  '10-plus-years': 3,
  '5-10-years': 1,
  '3-5-years': 0,
  '1-3-years': 0,
}

// --- Score calculator (0–14, or 0–17 when ownership length is enabled) ---
export function calculateLeadScore(d: Stage2Data): number {
  return (SCORE_TIMELINE[d.timeline] || 0)
       + (SCORE_ASKING_PRICE[d.askingPrice] || 0)
       + (SCORE_CONDITION[d.condition] || 0)
       + (SCORE_REASON[d.reason] || 0)
       + (d.ownershipLength ? (SCORE_OWNERSHIP[d.ownershipLength] || 0) : 0)
}

// --- Quality tier + Meta value mapping ---
export type LeadQuality = 'premium' | 'standard' | 'low' | 'soft-fail'

export function getLeadQuality(d: Stage2Data): LeadQuality {
  if (!isPropertyTypeAccepted(d.propertyType)) return 'soft-fail'
  const score = calculateLeadScore(d)
  if (score >= 9) return 'premium'
  if (score >= 6) return 'standard'
  if (score >= 3) return 'low'
  return 'soft-fail'
}

export function getMetaEventConfig(d: Stage2Data): {
  eventName: 'Lead' | 'LeadLowIntent'
  value: number
  quality: LeadQuality
  qualified: boolean
} {
  const quality = getLeadQuality(d)
  const score = calculateLeadScore(d)
  switch (quality) {
    case 'premium':  return { eventName: 'Lead',          value: 250, quality, qualified: true  }
    case 'standard': return { eventName: 'Lead',          value: 125, quality, qualified: true  }
    case 'low':      return { eventName: 'Lead',          value: 50,  quality, qualified: true  }
    case 'soft-fail':return { eventName: 'LeadLowIntent', value: 0,   quality, qualified: false }
  }
}

// Helper: deterministic event_id for Meta dedup (Pixel + CAPI must match)
export function makeEventId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}
