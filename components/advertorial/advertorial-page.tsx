"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { SurveyCard } from "@/components/survey/survey-card"
import { AddressAutocomplete, type AddressDetails, type ServiceArea } from "@/components/survey/address-autocomplete"
import { XCircle } from "lucide-react"

// Advertorial editorial landing page (v2 "equity-opportunity" angle). This is the
// canonical "builder" source the advertorial package is copied from, so keep it
// CLEAN and template-friendly: market/company/owner all come from server config via
// props, no hardcoded city. Uses the {market}/{where} fallback voice. Embeds this
// repo's Family-A SurveyCard (phoneDisplay/phoneHref/serviceAreas/companyName plus
// initialStage1Data/initialStage1Step for the modal). The sticky address bar passes
// the typed address into a popup that opens at step 2. ALL CTAs open the popup.
// No countdown timers, no fake urgency, no trust-stats strip. Tuned for a 45+ seller.

interface AdvertorialPageProps {
  companyName: string
  phoneDisplay: string
  phoneHref: string
  marketName: string
  accentColor: string
  ownerName?: string
  writerName?: string
  writerRole?: string
  writerHeadshot?: string
  serviceAreas: ServiceArea[]
}

export function AdvertorialPage({
  companyName,
  phoneDisplay,
  phoneHref,
  marketName,
  accentColor,
  ownerName,
  writerName = "Margaret Ellison",
  writerRole = "Senior Housing Correspondent",
  writerHeadshot = "/images/adv-local-team.jpg",
  serviceAreas,
}: AdvertorialPageProps) {
  const market = marketName || "your area"
  const where = market === "your area" ? "the areas we serve" : market

  // Editorial palette (accent comes from the client's brand color).
  const C = {
    text: "#1a1a1a",
    muted: "#6b6b6b",
    link: accentColor,
    rule: "#e5e5e5",
    cta: "#1f8a4c",
    accent: accentColor,
    warn: "#c0392b",
  }

  const formRef = useRef<HTMLDivElement>(null)
  const [showSticky, setShowSticky] = useState(false)
  const [stickyAddr, setStickyAddr] = useState("")
  const [seeded, setSeeded] = useState<{ address: string; state: string; city: string; county: string } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  // Out-of-area rejection for the sticky bar (matches the SurveyCard radius geofence).
  const [outOfArea, setOutOfArea] = useState(false)

  // ---- Sticky bar reveal on scroll (hide while the form is on screen) ----
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 600
      const form = formRef.current
      let formVisible = false
      if (form) {
        const r = form.getBoundingClientRect()
        formVisible = r.top < window.innerHeight && r.bottom > 0
      }
      setShowSticky(scrolled && !formVisible)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Top bar autocompletes. When they pick a suggestion we capture the validated
  // address + state/county and open a popup with the rest of the form at step 2.
  // If they typed without selecting, the popup opens at the address step.
  const handleStickySelect = (address: string, details: AddressDetails) => {
    setSeeded({ address, state: details.state || "", city: details.city || "", county: details.county || "" })
    setModalOpen(true)
  }
  // Out-of-area sticky pick: show the rejection popup, do NOT seed or open the survey.
  const handleStickyOutOfArea = (_address: string) => {
    setSeeded(null)
    setModalOpen(false)
    setOutOfArea(true)
  }
  const openModalFromButton = () => {
    if (!seeded && stickyAddr.trim()) setSeeded({ address: stickyAddr.trim(), state: "", city: "", county: "" })
    setModalOpen(true)
  }

  const Cta = ({ label }: { label: string }) => (
    <div className="my-[36px] flex justify-center">
      <button onClick={() => setModalOpen(true)} style={{ background: C.cta }} className="w-full max-w-[540px] text-white font-extrabold text-[18px] md:text-[20px] text-center px-6 py-[19px] rounded-[40px] hover:opacity-95 transition-opacity shadow-sm">
        {label}
      </button>
    </div>
  )

  return (
    <div style={{ color: C.text, background: "#fff" }}>
      <article className="mx-auto max-w-[760px] px-6 pt-6 md:pt-10 pb-36 text-[18px] md:text-[19px] leading-[1.7]">
        <p style={{ color: C.muted }} className="text-xs tracking-[0.14em] uppercase text-center mb-[12px]">Advertorial</p>

        <header>
          <h1 className="text-[24px] md:text-[34px] leading-[1.18] font-extrabold text-center mb-[12px] tracking-[-0.01em]">
            {market === "your area" ? "" : `${market} `}Homeowners 45+: A Buyer Criteria Most Sellers Overlook Is Pushing Higher Cash Offers On Older Homes.
          </h1>
          <p className="text-center text-[17px] md:text-[20px] font-semibold mb-[10px] leading-[1.4]">
            See Your 24-Hour Cash Offer Estimate Without Listing, Repairs, Or Showings.
          </p>
          <p style={{ color: C.muted }} className="text-center text-[15px] mb-[18px] leading-[1.45]">
            Best for dated or inherited homes that need work, and owners who want speed and certainty.
          </p>

          <div style={{ borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}` }} className="flex items-center gap-3 py-3 mb-[22px]">
            <Image src={writerHeadshot} alt={writerName} width={46} height={46} className="h-[46px] w-[46px] rounded-full object-cover bg-gray-200" />
            <div>
              <div className="text-[15px] font-semibold">By {writerName}</div>
              <div style={{ color: C.muted }} className="text-[13px]">{writerRole} · Updated this week</div>
            </div>
          </div>
        </header>

        <figure className="my-[8px] mb-[30px]">
          <Image src="/images/adv-strangers-open-house.jpg" alt="Unfamiliar visitors touring a home during an open house showing" width={760} height={500} className="block w-full h-auto rounded-[3px] bg-gray-100" priority />
          <figcaption style={{ color: C.muted }} className="text-[13px] text-center mt-2 italic">
            An open house puts people you have never met in your living room for weeks. More {where} homeowners are quietly leaving that whole routine behind.
          </figcaption>
        </figure>

        {/* Proof + credibility strip right under the hero */}
        <div style={{ border: `1px solid ${C.rule}` }} className="rounded-[10px] px-4 py-3.5 mb-[30px] flex items-start gap-3">
          <Image src="/images/adv-testimonial-1.jpg" alt="" width={44} height={44} className="w-[44px] h-[44px] rounded-full object-cover shrink-0 bg-gray-100" />
          <div>
            <div style={{ color: "#f5a623" }} className="text-[13px] tracking-[1px] leading-none mb-1">★★★★★</div>
            <p className="text-[14px] leading-[1.45] mb-1">{`"They bought our tired old house just as it stood, and we were closed inside two weeks. We never touched a thing." `}<cite style={{ color: C.muted }} className="not-italic">Eileen R., Levittown</cite></p>
            <p style={{ color: C.muted }} className="text-[12.5px] leading-[1.4]">A local, BBB-accredited {where} cash buyer. Real written offers, no obligation.</p>
          </div>
        </div>

        {/* Equity-opportunity opening */}
        <section>
          <p className="mb-[14px]">Here is something most homeowners past 45 never sit down and tally up.</p>
          <p className="mb-[14px]"><strong>You have spent years chipping away at this mortgage while {where} filled in and grew up around you.</strong></p>
          <p className="mb-[14px]">All that patience quietly turned into something solid. Equity. Usually a good deal more than folks expect.</p>
          <p className="mb-[14px]">But equity sitting inside the walls does nothing for you.</p>
          <p className="mb-[14px]">It does not book the trip. It does not put you closer to the grandkids. It does not lift a single worry off your retirement.</p>
          <p className="mb-[14px]">It only goes to work for you the day you turn it into cash in hand.</p>
          <p className="mb-[14px]">And nobody can promise next year will look like this one. Meanwhile the property taxes, the insurance, and the upkeep on an older home have not gotten any gentler on the wallet.</p>
          <p className="mb-[14px]"><strong>So the real question is not what you might list it for one day. It is what you can actually walk away with, and how soon.</strong></p>
        </section>

        {/* Mechanism preview box + first hard ask */}
        <aside style={{ border: `1px solid ${C.rule}`, background: "#fafafa" }} className="rounded-[12px] px-6 py-[26px] my-[34px]">
          <h3 className="text-[20px] md:text-[22px] font-extrabold text-center mb-1.5">Here Is Exactly How Selling To {companyName} Works</h3>
          <p style={{ color: C.muted }} className="text-center text-[15px] mb-5">No mystery and no pressure. Three plain steps.</p>
          <ul className="space-y-3.5">
            <li className="flex gap-3"><span style={{ background: C.accent }} className="shrink-0 w-[28px] h-[28px] rounded-full text-white text-[15px] font-extrabold flex items-center justify-center">1</span><span><strong>You tell us about the home.</strong> A few quick questions, about 60 seconds of your time. No cost, nothing owed.</span></li>
            <li className="flex gap-3"><span style={{ background: C.accent }} className="shrink-0 w-[28px] h-[28px] rounded-full text-white text-[15px] font-extrabold flex items-center justify-center">2</span><span><strong>We put a fair written cash offer in your hands.</strong> We weigh the condition, the location, and recent nearby {where} sales, then walk you through the plain math behind the number.</span></li>
            <li className="flex gap-3"><span style={{ background: C.accent }} className="shrink-0 w-[28px] h-[28px] rounded-full text-white text-[15px] font-extrabold flex items-center justify-center">3</span><span><strong>You pick the closing day.</strong> No repairs, no showings, no fees. The offer is yours to keep and weigh for as long as you like.</span></li>
          </ul>
        </aside>

        <Cta label="See What My Home Qualifies For →" />

        <H2>The House Quietly Grew As The Years Went By</H2>
        <FullImage src="/images/adv-empty-rooms.jpg" alt="A still staircase and rooms in a longtime family home that now sit mostly empty" />
        <section>
          <p className="mb-[18px]">This is the part nobody sits you down and warns you about.</p>
          <p className="mb-[18px]">The square footage never moves. You are the one who changes. One by one, the rooms you used to fill go quiet. The garage stacks up with boxes you can no longer lift. The upstairs becomes a place you visit instead of a place you live.</p>
          <p className="mb-[18px]">And the maintenance keeps right on knocking. A home of this age always has its hand out. A fresh coat of paint. A new heating system before another winter. Gutters, all over again.</p>
          <p className="mb-[18px]">Here is the blunt truth a lot of folks run straight into: <strong>fixing everything up just to put it on the market can cost more than the cash you have set aside, and pull more out of you than you ever wanted to give.</strong></p>
          <p className="mb-[18px]">So the house waits. The decision waits. And one more season quietly slips past.</p>
        </section>

        <H2>What Capturing That Equity The Old Way Quietly Costs You</H2>
        <FullImage src="/images/adv-couple-window.jpg" alt="An older couple standing in the family home they have owned for years" />
        <section>
          <p className="mb-[18px]">The first instinct is to list it. Stick a sign in the yard, chase top dollar, and walk away with the whole pile. For a younger household with the time and the budget to fix the place up first, that road can absolutely work, and we will be the first ones to tell you so.</p>
          <p className="mb-[18px]">But here is what listing actually does to the equity you are trying to capture. It takes a serious bite out of it long before a dime ever reaches you:</p>
          <ul className="mb-[18px] pl-[22px] list-disc">
            <li className="mb-2"><strong>You cover the repairs first.</strong> The agent arrives with a list. Paint, flooring, the roof. Money leaving your pocket before a single buyer ever shows.</li>
            <li className="mb-2"><strong>Strangers wander through your home.</strong> Open houses put people you have never met inside your closets while you wait out in the car.</li>
            <li className="mb-2"><strong>You wait. Then you wait some more.</strong> A typical listing can take two or three months to reach the closing table, sometimes longer, and the whole thing can still fall apart at the finish line.</li>
            <li className="mb-2"><strong>The fees stack up.</strong> Between commissions and closing costs, a fat slice of your price quietly disappears. On plenty of {where} homes that is tens of thousands gone right off the top.</li>
          </ul>
          <p className="mb-[18px]">So listing is not wrong. <strong>But for a home that needs work and an owner who would rather not run a part-time job for three months, the math and the certainty simply point a different direction.</strong></p>
        </section>

        <Cta label="See What My Home Qualifies For →" />

        <H2>Why A Cash Sale Is The Best Way To Walk Away With Your Equity</H2>
        <FullImage src="/images/adv-handshake.jpg" alt="A warm, no-fuss handshake between a homeowner and a local home buyer" />
        <section>
          <p className="mb-[18px]">These last few years, more and more homeowners past 45 have set the old listing routine aside and picked something far simpler.</p>
          <p className="mb-[18px]">They sell straight to a local cash home buyer.</p>
          <p className="mb-[18px]">No repairs. No open houses. No commission carved out of the price. They sell the home exactly as it stands, name the closing date that suits them, and walk off with the equity in hand.</p>
          <p className="mb-[18px]">It will not be right for everybody. If you have all the time in the world, the budget for a full renovation, and the stamina for a three month listing, the traditional path is still sitting right there waiting on you.</p>
          <p className="mb-[18px]">But once you weigh it honestly, for a home that needs work and an owner who wants the money in hand without the wait or the risk, <strong>a clean cash sale is simply the strongest option on the table. You keep more of what the home is worth, you keep your privacy, and you keep control of the calendar.</strong></p>
        </section>

        <Cta label="See What My Home Qualifies For →" />

        <H2>How We Land On Your Number</H2>
        <section>
          <p className="mb-[14px]">No black box, and no pressure. Your cash offer comes down to three plain things:</p>
          <ul className="mb-[18px] pl-[22px] list-disc space-y-2">
            <li><strong>1. Recent nearby sales.</strong> What comparable homes around your {where} neighborhood have actually sold for lately.</li>
            <li><strong>2. The work the home needs.</strong> We account honestly for the repairs and updates, so that money never comes out of your pocket.</li>
            <li><strong>3. Room to take the risk.</strong> A fair margin so we can buy it as-is, carry the home, and resell it.</li>
          </ul>
          <p className="mb-[14px]"><strong>Put plainly: recent sale prices, minus the work it needs, with enough room for us to take it on. We walk you through that math before you ever commit to a thing.</strong></p>
        </section>

        <H2>Your Home Does Not Have To Be The Nicest On The Block</H2>
        <FullImage src="/images/adv-dated-kitchen.jpg" alt="A dated, lived-in kitchen in an older home that has not been updated in years" />
        <section>
          <p className="mb-[18px]">Here is the worry we hear more than any other. <em>My home is dated. It needs work. Who on earth is going to want it the way it sits?</em></p>
          <p className="mb-[18px]"><strong>That worry is the exact reason we exist.</strong> We are not hunting for a polished, move-in-ready showpiece. We buy older {where} homes that need work, in whatever shape they are in. The tired kitchen, the worn carpet, the roof that has seen better days. None of it sends us running.</p>
          <p className="mb-[18px]">A listing punishes a home that needs work. It backs you into a corner: pour cash into repairs you will never fully earn back, or sit there fielding the lowball offers buyers toss at anything that is not picture perfect.</p>
          <p className="mb-[18px]">We do the opposite. We see the home for what it is, we account for the work honestly, and we hand you a fair cash number for it just as it stands. <strong>If your home were already perfect, you would not need a company like ours. Because it is not, we are exactly who you want standing in your corner.</strong></p>
        </section>

        {/* Compare table */}
        <H2>Two Honest Ways To Sell. Side By Side.</H2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-[30px]">
          <div style={{ border: `1px solid ${C.rule}` }} className="rounded-[12px] p-5">
            <h4 className="text-[18px] font-bold text-center mb-3.5" style={{ color: C.muted }}>The Traditional Listing</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li>You pay for repairs before it sells</li>
              <li>Strangers tour your home for weeks</li>
              <li>Two to three months to close, if it holds</li>
              <li>Commission and closing costs off the top</li>
              <li>The buyer controls the timeline</li>
              <li>It can still collapse at the table</li>
            </ul>
          </div>
          <div style={{ border: `2px solid ${C.cta}`, background: "#f4faf6" }} className="rounded-[12px] p-5">
            <h4 className="text-[18px] font-bold text-center mb-3.5" style={{ color: C.cta }}>Selling To {companyName}</h4>
            <ul className="space-y-2.5 text-[15px]">
              <li><strong>Sell as it stands, zero repairs</strong></li>
              <li><strong>No showings, total privacy</strong></li>
              <li><strong>Close in as little as two weeks</strong></li>
              <li><strong>No commission, no closing costs</strong></li>
              <li><strong>You pick the closing date</strong></li>
              <li><strong>A real written offer, not a maybe</strong></li>
            </ul>
          </div>
        </div>

        <Cta label="See What My Home Qualifies For →" />

        <H2>Introducing {companyName}</H2>
        <FullImage src="/images/adv-local-team.jpg" alt={`Local ${companyName} team`} />
        <section>
          <p className="mb-[18px]"><strong>{companyName} is a local outfit{ownerName && ownerName !== "Our Team" ? `, led by ${ownerName},` : ""} that buys homes straight from homeowners across {where}, with cash, in whatever condition they sit.</strong></p>
          <p className="mb-[18px]">That means no repairs, no emptying out the entire house, no listing, no showings, and no commission skimmed off your number. You tell us about the place, we take a look, and we put a fair written cash offer in your hands.</p>
          <p className="mb-[18px]">Like the offer? You name the closing date. Want it wrapped up in two weeks? Done. Need 60 days to line up your next place and pack at an easy pace? That works just the same.</p>
          <p className="mb-[18px]">If the offer is not the right fit, there is no arm-twisting and nothing owed. The written offer is yours to keep and chew over for as long as you please.</p>
          <p className="mb-[18px]">It is the plainest, easiest-on-the-nerves way to sell a home you have held for years, shaped for exactly the season of life you are standing in.</p>
        </section>

        <H2>Why It Suits This Season Of Life</H2>
        <section>
          <ul className="mb-[18px] pl-[22px] list-disc">
            <li className="mb-2"><strong>Sell as it stands.</strong> Not a single repair. Not one brushstroke of paint. Leave behind whatever you would rather not haul off.</li>
            <li className="mb-2"><strong>No showings.</strong> No strangers tracking through your home. No keeping the place spotless month after month.</li>
            <li className="mb-2"><strong>Hold onto more of your money.</strong> No commission and no closing costs chewing into your retirement.</li>
            <li className="mb-2"><strong>Move on your own schedule.</strong> Close quickly, or take all the time you need. You keep the calendar, not some buyer.</li>
            <li className="mb-2"><strong>Honest certainty.</strong> A genuine written offer from a genuine local buyer, not a maybe that crumbles at the closing table.</li>
          </ul>
          <p className="mb-[18px]">That is why, once homeowners past 45 see how this runs, so many of them say the very same thing: <em>I wish somebody had told me this was on the table years ago.</em></p>
        </section>

        {/* Qualifier / DQ box: condition + timeline, never property type */}
        <aside style={{ border: `1px solid ${C.rule}` }} className="rounded-[12px] px-6 py-[24px] my-[36px]">
          <h3 className="text-[19px] md:text-[21px] font-extrabold text-center mb-2.5">Who This Program Is Built For</h3>
          <p className="mb-4 text-[16px] text-center">We would rather be straight with you than waste your time. Here is exactly who we can, and cannot, help.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="font-bold mb-2" style={{ color: C.cta }}>A strong fit if you:</p>
              <ul className="space-y-1.5 text-[15px] list-disc pl-[20px]">
                <li>Own a house in the {where} area</li>
                <li>Have a home that is dated or needs work</li>
                <li>Want cash in hand, with no repairs or showings</li>
                <li>Would like to pick your own closing date</li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-2" style={{ color: C.muted }}>Not the right fit if you:</p>
              <ul className="space-y-1.5 text-[15px] list-disc pl-[20px]">
                <li>Have a home in great shape, with the time and money to list it the traditional way</li>
                <li>Already have the home listed with an agent</li>
                <li>Are not the owner on title</li>
              </ul>
            </div>
          </div>
          <p className="mt-4 text-[14px] text-center" style={{ color: C.muted }}>If you are not a fit, we will tell you honestly. No pressure either way.</p>
        </aside>

        {/* ============ INLINE SURVEY (the real working form) ============ */}
        <div ref={formRef} id="offer-form" className="scroll-mt-5 my-10">
          <div className="text-center mb-5">
            <h3 className="text-[24px] md:text-[28px] font-extrabold">Find Out What Your Home Qualifies For</h3>
            <p style={{ color: C.muted }} className="mt-1 text-[15px]">A handful of quick questions. No cost, nothing owed, no arm-twisting.</p>
          </div>
          <SurveyCard phoneDisplay={phoneDisplay} phoneHref={phoneHref} serviceAreas={serviceAreas} companyName={companyName} />
          <p style={{ color: C.muted }} className="text-center text-[13px] mt-3.5 max-w-[460px] mx-auto leading-[1.5]">
            Your information stays private. We never sell or share it. Requesting an offer is free and carries no obligation.
          </p>
        </div>

        <H2>What Other Homeowners Are Saying</H2>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-[30px] mb-10">
          {[
            { img: "/images/adv-testimonial-1.jpg", quote: "Once my husband was gone, the house was simply more than I could keep up with. The repairs alone would have run into the thousands. They took it just as it sat. I picked the closing day and never once lifted a hammer. Such a weight off my shoulders.", cite: "Patricia M., 71 · Massapequa" },
            { img: "/images/adv-testimonial-2.jpg", quote: "We were heading out to be near our daughter and had no stomach for months of showings at our age. They handed us a fair written offer inside a couple of days and let us close once we were ready. Straight shooters. No games.", cite: "Robert and Jean D., 68 and 66 · Hicksville" },
            { img: "/images/adv-testimonial-3.jpg", quote: "I inherited my mother's home and I live three states off. The thought of flying back for repairs and open houses was unbearable. They handled every bit of it by phone and email. Not once did I have to make the trip.", cite: "Daniel K., 59 · Bay Shore" },
            { img: "/images/adv-testimonial-4.jpg", quote: "The agent wanted thousands sunk into fixing the place up before it ever went on the market. I live on a fixed income. That was never happening. Selling for cash just as it stood simply added up. I kept more in my pocket and slept easier that night.", cite: "Carol S., 74 · Smithtown" },
          ].map((t) => (
            <figure key={t.cite} style={{ border: `1px solid ${C.rule}` }} className="m-0 text-[15px] leading-[1.55] rounded-lg p-[18px]">
              <Image src={t.img} alt={t.cite} width={300} height={300} className="w-full h-auto aspect-square object-cover rounded-md mb-3 block bg-gray-100" />
              <div style={{ color: "#f5a623" }} className="tracking-[1px] mb-2">★★★★★</div>
              <p className="mb-2.5">{t.quote}</p>
              <cite style={{ color: C.muted }} className="not-italic text-[13px]">{t.cite}</cite>
            </figure>
          ))}
        </section>

        <H2>Questions Homeowners Ask Us First</H2>
        <section className="my-[30px]">
          {[
            { q: "How fast can you close?", a: "As fast as you like. We put a written offer in your hands within 24 hours, and we can close in as little as two weeks. If you need more time to pack or line up your next place, we close on your timeline. We handle the title work and the paperwork." },
            { q: "Are there any fees or commissions?", a: "No. There are no agent commissions, no listing fees, and no closing costs charged to you. The number we agree on is the number you walk away with." },
            { q: "How do you decide on the offer?", a: `We look at where your home sits across ${where}, its current condition, and recent sales of comparable homes nearby. Then we show you the plain math behind the number. No black box. You see how we got there before you ever commit.` },
            { q: "Do I have to make repairs or clean it out?", a: "No. We buy as-is, in any condition. Leave behind whatever you do not want. You fix nothing, stage nothing, and host not a single showing." },
            { q: "What is the catch?", a: `There is not one, and we understand exactly why you ask. ${companyName} is a real local company buying houses across ${where}. The offer is no-obligation and the process is private. You are welcome to check us through the BBB and our reviews before you sign a thing. And if a cash sale is not your best move, we will tell you so.` },
          ].map((f) => (
            <details key={f.q} style={{ borderBottom: `1px solid ${C.rule}` }} className="py-1">
              <summary className="cursor-pointer list-none py-3.5 text-[17px] md:text-[18px] font-bold flex justify-between items-center gap-3">
                <span>{f.q}</span>
                <span style={{ color: C.accent }} className="text-[22px] leading-none shrink-0">+</span>
              </summary>
              <p style={{ color: "#333" }} className="pb-4 text-[16px] leading-[1.6]">{f.a}</p>
            </details>
          ))}
        </section>

        <Cta label="See What My Home Qualifies For →" />

        <H2>So Here Is The Decision In Front Of You</H2>
        <section>
          <p className="mb-[18px]">There is a reason you have read this far. Somewhere inside you already senses the house is ready for its next chapter, and so are you.</p>
          <p className="mb-[18px]">You gave that home a lifetime of care. At this point, it ought to be looking after you, not the other way around. The simplest first step is to find out what it qualifies for. That costs you nothing, and it commits you to nothing.</p>
        </section>

        {/* ============ OFFER CARD (no countdown, honest weekly capacity) ============ */}
        <aside style={{ border: "2px dashed #bdbdbd" }} className="rounded-[10px] px-7 py-[30px] max-w-[600px] mx-auto mt-[40px] text-center">
          <Image src="/images/adv-keys-couple.jpg" alt="Relieved homeowners holding the keys after a cash sale" width={170} height={170} className="w-[170px] h-[170px] object-cover rounded-full mx-auto mb-4 block bg-gray-100" />
          <h4 className="text-[22px] font-bold mb-1.5">{companyName} · Cash Offer Program</h4>
          <p style={{ color: C.accent }} className="text-[26px] font-extrabold mb-2">Get Your Fair Written Cash Offer</p>
          <p className="text-[15px] mb-5">Sell it as it stands. No repairs, no showings, no commission. You name the closing date.</p>
          <p style={{ color: C.muted }} className="text-[14px] mb-[18px] leading-[1.5]">We review a limited number of addresses each week to keep our turnaround quick. If your home is a fit, the sooner we see it, the sooner you have your number.</p>
          <button onClick={() => setModalOpen(true)} style={{ background: C.cta }} className="block w-full text-white font-extrabold text-[17px] text-center px-5 py-[17px] rounded-[40px] hover:opacity-95 transition-opacity">
            See What My Home Qualifies For →
          </button>
          <p className="mt-4 text-[14px]">Prefer to talk it through?<br className="sm:hidden" /> Call us at{" "}
            <a href={`tel:${phoneHref}`} style={{ color: C.accent }} className="font-bold underline underline-offset-2 whitespace-nowrap">{phoneDisplay}</a>
          </p>
        </aside>

        <p style={{ color: C.muted }} className="max-w-[760px] mx-auto mt-10 text-[12px] leading-[1.5] text-center">
          This is an advertorial. {companyName} is a real estate investment company. It is not a licensed real estate brokerage and does not provide brokerage services. Cash offers depend on the condition of the property, its location, and its market value. No offer is binding until it is put in writing. Requesting an offer carries no cost and no obligation. Testimonials describe individual experiences and do not guarantee any particular result.
        </p>
      </article>

      {/* ============ STICKY ADDRESS BAR ============ */}
      <div
        style={{ borderBottom: `1px solid ${C.rule}`, boxShadow: "0 6px 20px rgba(0,0,0,.10)", transform: showSticky && !modalOpen && !outOfArea ? "none" : "translateY(-120%)", transition: "transform .3s ease" }}
        className="fixed left-0 right-0 top-0 z-40 bg-white px-4 py-3"
      >
        <div className="max-w-[760px] mx-auto flex gap-2.5 items-center">
          <label className="hidden sm:block text-[13px] font-bold whitespace-nowrap">Type your address to begin:</label>
          <div className="flex-1 min-w-0">
            <AddressAutocomplete value={stickyAddr} onChange={setStickyAddr} onSelect={handleStickySelect} onOutOfArea={handleStickyOutOfArea} serviceAreas={serviceAreas} placeholder="Your property address" />
          </div>
          <button onClick={openModalFromButton} style={{ background: C.cta }} className="px-4 sm:px-[18px] py-3 text-white rounded-[9px] text-[14px] sm:text-[15px] font-extrabold whitespace-nowrap hover:opacity-95 transition-opacity">
            See My Cash Offer →
          </button>
        </div>
      </div>

      {/* ============ POPUP: rest of the form after the top bar ============ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4" style={{ background: "rgba(0,0,0,0.55)" }} onClick={() => setModalOpen(false)}>
          <div className="relative w-full max-w-[600px] my-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} aria-label="Close" className="absolute -top-3 -right-3 z-10 h-9 w-9 rounded-full bg-white text-gray-700 text-xl font-bold shadow-md flex items-center justify-center hover:bg-gray-100">×</button>
            <SurveyCard
              key={seeded?.address || "modal"}
              phoneDisplay={phoneDisplay}
              phoneHref={phoneHref}
              serviceAreas={serviceAreas}
              companyName={companyName}
              initialStage1Data={seeded ? { address: seeded.address, state: seeded.state, city: seeded.city, county: seeded.county } : undefined}
              initialStage1Step={seeded && seeded.state ? 2 : undefined}
            />
          </div>
        </div>
      )}

      {/* ============ POPUP: out-of-area rejection (mirrors SurveyCard) ============ */}
      {outOfArea && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4" style={{ background: "rgba(0,0,0,0.55)" }} onClick={() => setOutOfArea(false)}>
          <div className="relative w-full max-w-[600px] my-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setOutOfArea(false)} aria-label="Close" className="absolute -top-3 -right-3 z-10 h-9 w-9 rounded-full bg-white text-gray-700 text-xl font-bold shadow-md flex items-center justify-center hover:bg-gray-100">×</button>
            <div className="w-full rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-lg">
              <div className="flex flex-col items-center gap-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Outside Our Service Area</h2>
                  <p className="mt-3 text-base text-gray-600">We currently purchase properties in Nassau and Suffolk counties on Long Island, NY.</p>
                  <p className="mt-4 text-sm text-gray-500">If your property is in our service area, please re-enter the address and select it from the dropdown.</p>
                </div>
                <button
                  onClick={() => { setOutOfArea(false); setStickyAddr("") }}
                  style={{ background: C.cta }}
                  className="mt-2 inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold text-white hover:opacity-90 transition-opacity shadow-md"
                >
                  Enter A Different Address
                </button>
                <p className="text-[14px]">Prefer to talk it through?{" "}
                  <a href={`tel:${phoneHref}`} style={{ color: C.accent }} className="font-bold underline underline-offset-2 whitespace-nowrap">{phoneDisplay}</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[23px] md:text-[30px] leading-[1.22] font-extrabold text-center my-[52px] mb-[26px] tracking-[-0.005em]">{children}</h2>
  )
}

function FullImage({ src, alt }: { src: string; alt: string }) {
  return (
    <figure className="my-[8px] mb-[30px]">
      <Image src={src} alt={alt} width={760} height={500} className="block w-full h-auto rounded-[3px] bg-gray-100" />
    </figure>
  )
}
