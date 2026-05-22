"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { SurveyCard } from "@/components/survey/survey-card"
import { type ServiceArea } from "@/components/survey/address-autocomplete"

// Main advertorial editorial landing page (cold-traffic pre-sell), ported from the
// Inner City advertorial. Tells the 45+ story, embeds the client's existing SurveyCard,
// and uses a sticky address bar that opens a modal with the rest of the form (skipping
// the captured address). Market name, phone, company, accent all come from server config.

interface AdvertorialPageProps {
  companyName: string
  phoneDisplay: string
  phoneHref: string
  marketName: string
  accentColor: string
  writerName?: string
  writerRole?: string
  writerHeadshot?: string
  serviceAreas: ServiceArea[]
}

function pad(n: number) {
  return n < 10 ? "0" + n : "" + n
}

export function AdvertorialPage({
  companyName,
  phoneDisplay,
  phoneHref,
  marketName,
  accentColor,
  writerName = "Margaret Ellison",
  writerRole = "Senior Housing Correspondent",
  writerHeadshot = "/images/adv-local-team.jpg",
  serviceAreas,
}: AdvertorialPageProps) {
  const market = marketName || "your area"

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
  const [modalOpen, setModalOpen] = useState(false)
  const [seededAddr, setSeededAddr] = useState("")

  // ---- Two rolling countdown timers (randomized per page load) ----
  const [cdA, setCdA] = useState("--:--:--")
  const [cdB, setCdB] = useState("--d --:--")
  const [slots, setSlots] = useState(7)
  const targetsRef = useRef<{ a: number; b: number } | null>(null)
  useEffect(() => {
    const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
    const now = Date.now()
    const a = now + rand(14, 46) * 3600 * 1000 + rand(0, 59) * 60 * 1000 + rand(0, 59) * 1000
    const b = now + rand(3, 6) * 24 * 3600 * 1000 + rand(0, 23) * 3600 * 1000 + rand(0, 59) * 60 * 1000
    targetsRef.current = { a, b }
    setSlots(rand(3, 9))
    const tick = () => {
      if (!targetsRef.current) return
      const t = Date.now()
      const ra = Math.max(0, targetsRef.current.a - t)
      setCdA(`${pad(Math.floor(ra / 3600000))}:${pad(Math.floor((ra % 3600000) / 60000))}:${pad(Math.floor((ra % 60000) / 1000))}`)
      const rb = Math.max(0, targetsRef.current.b - t)
      setCdB(`${Math.floor(rb / 86400000)}d ${pad(Math.floor((rb % 86400000) / 3600000))}:${pad(Math.floor((rb % 3600000) / 60000))}`)
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

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

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  // Sticky bar is a plain text starter (no Google autocomplete — its dropdown breaks
  // inside a fixed/transformed bar). It just opens the modal and prefills the address
  // into the form, where the survey's autocomplete + geo-validation actually run.
  const openModal = () => {
    setSeededAddr(stickyAddr.trim())
    setModalOpen(true)
  }

  return (
    <div style={{ color: C.text, background: "#fff" }}>
      <article className="mx-auto max-w-[760px] px-6 pt-10 pb-36 text-[18px] md:text-[19px] leading-[1.65]">
        <p style={{ color: C.muted }} className="text-xs tracking-[0.14em] uppercase text-center mb-[18px]">Advertorial</p>

        <header>
          <h1 className="text-[29px] md:text-[38px] leading-[1.18] font-extrabold text-center mb-[18px] tracking-[-0.01em]">
            Why More {market === "your area" ? "" : `${market} `}Homeowners Over the Age of 45 Are Selling Their Homes For Cash, And Skipping The Open Houses Entirely
          </h1>
          <p className="text-center text-[18px] mb-[26px]">
            A simpler way qualified homeowners are selling as-is. No repairs out of pocket. No strangers walking through. No agent fees pulled out of the final number.
          </p>
          <div style={{ borderTop: `1px solid ${C.rule}`, borderBottom: `1px solid ${C.rule}` }} className="flex items-center gap-3 py-3 mb-[30px]">
            <Image src={writerHeadshot} alt={writerName} width={46} height={46} className="h-[46px] w-[46px] rounded-full object-cover bg-gray-200" />
            <div>
              <div className="text-[15px] font-semibold">By {writerName}</div>
              <div style={{ color: C.muted }} className="text-[13px]">{writerRole} · Updated this week</div>
            </div>
          </div>
        </header>

        <figure className="my-[8px] mb-[30px]">
          <Image src="/images/adv-strangers-open-house.jpg" alt="Strangers walking through a home during an open house showing" width={760} height={500} className="block w-full h-auto rounded-[3px] bg-gray-100" priority />
          <figcaption style={{ color: C.muted }} className="text-[13px] text-center mt-2 italic">
            Open houses mean strangers touring your home for weeks. More homeowners are skipping that part entirely.
          </figcaption>
        </figure>

        <section>
          <p className="mb-[18px]">Let me ask you something, one homeowner to another.</p>
          <p className="mb-[18px]"><strong>When did your house start feeling like more work than home?</strong></p>
          <p className="mb-[18px]">Maybe it was the stairs. You catch the railing now, every single time.</p>
          <p className="mb-[18px]">Maybe it was the yard. What used to be a Saturday morning is now a job you quietly dread.</p>
          <p className="mb-[18px]">Maybe it was the list. The roof. The water heater. The bathroom that has needed work since before the grandkids were born.</p>
          <p className="mb-[18px]">You raised a family in this house. You know every creak in the floor. And somewhere along the way, the place you love turned into a place that needs more than you want to give it.</p>
          <p className="mb-[18px]">If any of that lands close to home, you are not alone. And you are not behind. <strong>You are just at the stage where the smart move is a different move.</strong></p>
          <p className="mb-[18px]">(Here is the part most people your age are never told:{" "}
            <a href="#offer-form" onClick={(e) => { e.preventDefault(); scrollToForm() }} style={{ color: C.link }} className="underline underline-offset-2">there is a quieter way qualified homeowners are selling right now</a>{" "}
            that skips the repairs, the showings, and the months of waiting.)</p>
        </section>

        <H2>The House Got Bigger As You Got Older</H2>
        <FullImage src="/images/adv-empty-rooms.jpg" alt="Quiet staircase and rooms in a longtime family home now mostly unused" />
        <section>
          <p className="mb-[18px]">Nobody warns you about this part.</p>
          <p className="mb-[18px]">The house does not change. You do. And slowly, rooms you once filled go quiet. The basement becomes storage you cannot lift. The second floor becomes a place you visit, not a place you live.</p>
          <p className="mb-[18px]">Meanwhile the upkeep never stops. A house this age always wants something. New paint. A new furnace. Gutters, again.</p>
          <p className="mb-[18px]">And here is the hard truth a lot of folks run into: <strong>fixing it all up just to sell it can cost more than you have sitting around, and more energy than you want to spend.</strong></p>
          <p className="mb-[18px]">So the house sits. The decision sits. And another season goes by.</p>
        </section>

        <H2>What Nobody Tells You About Listing A Home At This Stage</H2>
        <FullImage src="/images/adv-couple-window.jpg" alt="Older couple in their longtime family home" />
        <section>
          <p className="mb-[18px]">When most people think about selling, they think about calling an agent and putting a sign in the yard. For a younger family, that can make sense.</p>
          <p className="mb-[18px]">But at this stage of life, the traditional way asks a lot of you:</p>
          <ul className="mb-[18px] pl-[22px] list-disc">
            <li className="mb-2"><strong>You pay for repairs first.</strong> Agents will hand you a list. Paint, flooring, the roof. Money out of your pocket before you see a dime.</li>
            <li className="mb-2"><strong>Strangers walk through your home.</strong> Open houses mean people you have never met opening your closets while you wait in the car.</li>
            <li className="mb-2"><strong>You wait. And wait.</strong> The average listing can take two to three months to close, sometimes longer, and the deal can still fall apart at the end.</li>
            <li className="mb-2"><strong>The fees add up.</strong> Between agent commissions and closing costs, a big slice of your price quietly disappears. On many homes that is tens of thousands of dollars off the top.</li>
          </ul>
          <p className="mb-[18px]">For a lot of older homeowners, that is not a plan. <strong>That is a part-time job you did not ask for, at the exact moment you want less on your plate, not more.</strong></p>
          <p className="mb-[18px]">The good news? It does not have to work that way anymore.</p>
        </section>

        <H2>There Is A Quieter Way Qualified Homeowners Are Selling</H2>
        <FullImage src="/images/adv-handshake.jpg" alt="A friendly, simple handshake between a homeowner and a local home buyer" />
        <section>
          <p className="mb-[18px]">Over the past few years, more and more homeowners over 45 have stopped listing the old way and started doing something simpler.</p>
          <p className="mb-[18px]">They sell directly to a local cash home buyer.</p>
          <p className="mb-[18px]">No repairs. No open houses. No agent fees coming out of the price. They sell the house exactly as it sits today, pick the closing date that works for them, and move on with their lives.</p>
          <p className="mb-[18px]">It is not for everyone. If you have all the time in the world and the energy to manage a full renovation and a three month listing, the traditional way is still there.</p>
          <p className="mb-[18px]">But if you would rather keep your weekends, keep your privacy, and <strong>keep more of the money in your own pocket for retirement, this is the door more people your age are walking through.</strong></p>
        </section>

        <H2>Introducing {companyName}</H2>
        <FullImage src="/images/adv-local-team.jpg" alt={`Local ${companyName} team`} />
        <section>
          <p className="mb-[18px]"><strong>{companyName} is a local company that buys homes directly from homeowners in {market === "your area" ? "the areas we serve" : market}, for cash, in as-is condition.</strong></p>
          <p className="mb-[18px]">That means no repairs, no cleaning out the whole house, no listing, no showings, and no commissions taken out of your number. You tell us about the home, we look at it, and we hand you a fair written cash offer.</p>
          <p className="mb-[18px]">If you like the offer, you pick the closing date. Want to close in two weeks? Done. Need 60 days to find your next place and pack at your own pace? That works too.</p>
          <p className="mb-[18px]">If the offer is not right for you, there is no pressure and no obligation. You keep the written offer to think it over for as long as you want.</p>
          <p className="mb-[18px]">It is the simplest, lowest-stress way to sell a longtime family home, built for exactly the stage of life you are in.</p>
        </section>

        <H2>How It Works</H2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-[30px]">
          {[
            { n: 1, h: "Tell Us About The Home", p: "Answer a few quick questions below. Takes about 60 seconds. No cost, no obligation." },
            { n: 2, h: "Get Your Written Offer", p: "We review the details and prepare a fair cash offer for your home, as-is." },
            { n: 3, h: "Pick Your Closing Day", p: "Like the offer? You choose the date. We handle the paperwork. You move on your terms." },
          ].map((s) => (
            <div key={s.n} style={{ border: `1px solid ${C.rule}` }} className="rounded-lg p-5 text-center">
              <span style={{ background: C.accent }} className="inline-flex w-[34px] h-[34px] rounded-full text-white items-center justify-center font-extrabold mb-2.5">{s.n}</span>
              <h4 className="mb-1.5 text-[17px] font-bold">{s.h}</h4>
              <p style={{ color: C.muted }} className="m-0 text-[14px]">{s.p}</p>
            </div>
          ))}
        </div>

        <H2>Why It Fits This Stage Of Life</H2>
        <section>
          <ul className="mb-[18px] pl-[22px] list-disc">
            <li className="mb-2"><strong>Sell as-is.</strong> Not one repair. Not one coat of paint. Leave what you do not want to take.</li>
            <li className="mb-2"><strong>No showings.</strong> No strangers in your home. No keeping the place spotless for months.</li>
            <li className="mb-2"><strong>Keep more of your money.</strong> No agent commission and no closing costs eating into your retirement.</li>
            <li className="mb-2"><strong>Move on your timeline.</strong> Close fast, or take your time. You hold the calendar, not a buyer.</li>
            <li className="mb-2"><strong>Real certainty.</strong> A real written offer from a real local buyer, not a maybe that falls through at the closing table.</li>
          </ul>
          <p className="mb-[18px]">This is why, once homeowners over 45 see how it works, so many of them say the same thing: <em>I wish I had known this was an option sooner.</em></p>
        </section>

        {/* ============ INLINE SURVEY (the real working form) ============ */}
        <div ref={formRef} id="offer-form" className="scroll-mt-5 my-10">
          <div className="text-center mb-5">
            <h3 className="text-[23px] md:text-[26px] font-extrabold">See What Your Home Qualifies For</h3>
            <p style={{ color: C.muted }} className="mt-1 text-[15px]">A few quick questions. No cost, no obligation, no pressure.</p>
          </div>
          <SurveyCard phoneDisplay={phoneDisplay} phoneHref={phoneHref} serviceAreas={serviceAreas} companyName={companyName} />
        </div>

        <H2>What Other Homeowners Are Saying</H2>
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-[30px] mb-10">
          {[
            { img: "/images/adv-testimonial-1.jpg", quote: "After my husband passed, the house was just too much for me. The repairs alone would have been thousands. They took it exactly as it was. I picked the closing day, and I did not have to fix a thing. Such a weight off my shoulders.", cite: "Patricia M., 71" },
            { img: "/images/adv-testimonial-2.jpg", quote: "We were moving closer to our daughter and did not want to deal with months of showings at our age. They gave us a fair written offer in a couple of days and let us close when we were ready. Honest people. No games.", cite: "Robert and Jean D., 68 and 66" },
            { img: "/images/adv-testimonial-3.jpg", quote: "I inherited my mother's home and live three states away. I could not imagine flying back for repairs and open houses. They handled everything over the phone and email. I never once had to travel for it.", cite: "Daniel K., 59" },
            { img: "/images/adv-testimonial-4.jpg", quote: "The agent wanted me to spend thousands fixing the place up before listing. I am on a fixed income. That was never going to happen. Selling for cash as-is just made sense. I kept more in my pocket and slept better that night.", cite: "Carol S., 74" },
          ].map((t) => (
            <figure key={t.cite} style={{ border: `1px solid ${C.rule}` }} className="m-0 text-[15px] leading-[1.55] rounded-lg p-[18px]">
              <Image src={t.img} alt={t.cite} width={300} height={300} className="w-full h-auto aspect-square object-cover rounded-md mb-3 block bg-gray-100" />
              <div style={{ color: "#f5a623" }} className="tracking-[1px] mb-2">★★★★★</div>
              <p className="mb-2.5">{t.quote}</p>
              <cite style={{ color: C.muted }} className="not-italic text-[13px]">{t.cite}</cite>
            </figure>
          ))}
        </section>

        <H2>So Here Is The Choice</H2>
        <section>
          <p className="mb-[18px]">The way I see it, you have two paths.</p>
          <p className="mb-[18px]"><strong>Path one</strong> is the long way. Spend money you may not want to spend fixing up a house you are leaving anyway. Let strangers tour it for months. Hand a big piece of the price to agents and closing costs. And hope it all closes before the holidays.</p>
          <p className="mb-[18px]"><strong>Path two</strong> is the simple way. Tell a trusted local buyer about the home, get a fair written cash offer, and pick the date you close. No repairs. No showings. No fees out of your number.</p>
          <p className="mb-[18px]">There is a reason you read this far. Some part of you already knows the house is ready for its next chapter, and so are you.</p>
        </section>

        <h3 className="text-[21px] md:text-[27px] leading-[1.32] font-extrabold text-center mx-auto my-[46px] max-w-[640px]">
          You spent your whole life taking care of that home. At this stage, it should be taking care of you, not the other way around.
        </h3>

        {/* ============ OFFER CARD + DUAL COUNTDOWN ============ */}
        <aside style={{ border: "2px dashed #bdbdbd" }} className="rounded-[10px] px-7 py-[30px] max-w-[600px] mx-auto mt-[50px] text-center">
          <Image src="/images/adv-keys-couple.jpg" alt="Happy homeowners after a cash sale" width={170} height={170} className="w-[170px] h-[170px] object-cover rounded-full mx-auto mb-4 block bg-gray-100" />
          <h4 className="text-[22px] font-bold mb-1.5">{companyName} · Cash Offer Program</h4>
          <p style={{ color: C.accent }} className="text-[26px] font-extrabold mb-2">Get Your Fair Written Cash Offer</p>
          <p className="text-[15px] mb-5">Sell as-is. No repairs, no showings, no agent fees. You pick the closing date.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-[22px]">
            <div style={{ background: "#fbf4f4", border: "1px solid #f0d9d9" }} className="rounded-lg px-2.5 py-3.5">
              <p style={{ color: C.warn }} className="text-xs uppercase tracking-[0.08em] font-bold mb-1.5">This Week&apos;s Offer Window Closes In</p>
              <div className="text-[24px] font-extrabold tabular-nums text-[#1a1a1a]">{cdA}</div>
            </div>
            <div style={{ background: "#fbf4f4", border: "1px solid #f0d9d9" }} className="rounded-lg px-2.5 py-3.5">
              <p style={{ color: C.warn }} className="text-xs uppercase tracking-[0.08em] font-bold mb-1.5">Program Enrollment Ends In</p>
              <div className="text-[24px] font-extrabold tabular-nums text-[#1a1a1a]">{cdB}</div>
            </div>
          </div>
          <p style={{ color: C.warn }} className="text-[14px] font-bold mb-[18px]">Only {slots} offer reviews left for homeowners in our area this week</p>
          <a href="#offer-form" onClick={(e) => { e.preventDefault(); scrollToForm() }} style={{ background: C.cta }} className="block w-full text-white no-underline font-extrabold text-[17px] text-center px-5 py-[17px] rounded-[40px] hover:opacity-95 transition-opacity">
            See What My Home Qualifies For →
          </a>
        </aside>

        <p style={{ color: C.muted }} className="max-w-[760px] mx-auto mt-10 text-[12px] leading-[1.5] text-center">
          This is an advertorial. {companyName} is a real estate investment company, not a licensed real estate brokerage, and does not provide real estate brokerage services. Cash offers are based on property condition, location, and market value. No offer is guaranteed until presented in writing. There is no cost and no obligation to request an offer. Testimonials reflect individual experiences and are not a guarantee of outcome.
        </p>
      </article>

      {/* ============ STICKY ADDRESS BAR ============ */}
      <div
        style={{ borderTop: `1px solid ${C.rule}`, boxShadow: "0 -6px 20px rgba(0,0,0,.10)", transform: showSticky && !modalOpen ? "none" : "translateY(120%)", transition: "transform .3s ease" }}
        className="fixed left-0 right-0 bottom-0 z-40 bg-white px-4 py-3"
      >
        <div className="max-w-[760px] mx-auto flex gap-2.5 items-center">
          <label className="hidden sm:block text-[13px] font-bold whitespace-nowrap">Enter your address to start:</label>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={stickyAddr}
              onChange={(e) => setStickyAddr(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") openModal() }}
              placeholder="Your property address"
              className="w-full h-12 rounded-[9px] border border-gray-300 px-3 text-[15px] outline-none focus:border-gray-400"
            />
          </div>
          <button onClick={openModal} style={{ background: C.cta }} className="px-4 sm:px-[18px] py-3 text-white rounded-[9px] text-[14px] sm:text-[15px] font-extrabold whitespace-nowrap hover:opacity-95 transition-opacity">
            See My Cash Offer →
          </button>
        </div>
      </div>

      {/* ============ MODAL — rest of the form ============ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto p-4" style={{ background: "rgba(0,0,0,0.55)" }} onClick={() => setModalOpen(false)}>
          <div className="relative w-full max-w-[600px] my-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalOpen(false)} aria-label="Close" className="absolute -top-3 -right-3 z-10 h-9 w-9 rounded-full bg-white text-gray-700 text-xl font-bold shadow-md flex items-center justify-center hover:bg-gray-100">×</button>
            <SurveyCard
              phoneDisplay={phoneDisplay}
              phoneHref={phoneHref}
              serviceAreas={serviceAreas}
              companyName={companyName}
              initialStage1Data={seededAddr ? { address: seededAddr } : undefined}
            />
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
