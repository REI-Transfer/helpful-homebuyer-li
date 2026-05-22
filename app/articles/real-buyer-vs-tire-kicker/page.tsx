import { ArticleShell, H2, P, UL, ArticleImage } from "@/components/article/article-shell"
import { ContactCTA } from "@/components/article/contact-cta"
import config from "@/lib/config"

export const metadata = {
  title: "How to Tell a Real Local Home Buyer From a Tire-Kicker | Inner City Home Buyers",
  description:
    "A simple 5-minute checklist to vet any cash home buyer in CT, MA, or RI before you share details or sign anything.",
}

export default function Page() {
  const area = config.marketName || "the areas we serve"
  return (
    <ArticleShell
      title="How to Tell a Real Local Home Buyer From a Tire-Kicker in About 5 Minutes"
      dek="A simple checklist to vet any cash buyer and protect yourself before you share anything or sign a thing."
      companyName={config.companyName}
    >
      <P>
        You got the call, or maybe the postcard. Somebody wants to buy your house for cash. As-is.
        No repairs, no showings, no agents. And a part of you thinks, great, that is exactly what I
        want. Then the other part of you, the part that has been around the block a few times, says
        wait a minute. Who is this person? Are they for real, or are they going to tie up my house
        for a month and then disappear?
      </P>
      <P>
        If that is where your head is at, good. That instinct is not paranoia. It is wisdom. After
        45-plus years on this earth you have learned that the folks who push hardest to move fast
        are usually the ones you should slow down with. So let us put that wisdom to work the right
        way.
      </P>
      <P>
        Here is what nobody tells you. You do not need to be a real estate expert to spot a flake.
        You do not need a lawyer on speed-dial just to ask a few honest questions. You need five
        questions and about five minutes. Ask them out loud, on the phone or at your kitchen table,
        and watch what the buyer does. The serious ones answer plainly. The tire-kickers get
        squirmy. That difference is the whole game.
      </P>

      <ArticleImage
        src="/images/adv-local-team.jpg"
        alt="A real local home-buying team"
        caption="A real local buyer has a name, a face, and a team you can actually reach. Tire-kickers tend to stay anonymous."
      />

      <H2>1. Do You Actually Buy In My Area, And Can I Look You Up?</H2>
      <P>
        Start here, because this one weeds out half the field on its own. A real buyer who works in
        {area} has bought houses near you, and they can tell
        you about it. Ask which towns they have closed in lately. Ask how long they have been doing
        this around here.
      </P>
      <P>
        Green flag: they name actual neighborhoods, they mention recent purchases, and they are glad
        for you to look them up online and read what other sellers said. A track record is something
        they are proud to hand you.
      </P>
      <P>
        Warning sign: vague answers like we buy all over, or they cannot point you to a single
        review, a single past seller, or anything you can check on your own. If their whole history
        lives only in their own mouth, that is not history. That is a sales pitch.
      </P>

      <H2>2. Can You Prove You Actually Have The Money?</H2>
      <P>
        This is the polite question that scares off the people who should be scared off. A genuine
        cash buyer has the funds ready, and they can show you. Ask them straight: can you prove the
        money is there before we go any further?
      </P>
      <P>
        Green flag: they say yes without flinching and offer to show you proof of funds. They do not
        get offended. They expect to be asked, because every careful seller asks.
      </P>
      <P>
        Warning sign: they dodge, they say just trust me, or they admit they need to find a partner
        or an investor first. That last one is the big tell. A so-called buyer who has to go shop
        your house to someone else is not really the buyer. They are a middleman hoping to lock you
        up while they scramble. If the money is not theirs and ready, the deal is not real.
      </P>

      <ArticleImage
        src="/images/adv-buyer-at-door.jpg"
        alt="A local buyer greeting a homeowner at the front door"
        caption="A funded buyer shows up, looks you in the eye, and answers your questions on the porch. No hiding behind a web form."
      />

      <H2>3. Will You Explain How You Got To Your Number?</H2>
      <P>
        Anybody can throw out a price. The question is whether they can stand behind it. A real buyer
        will walk you through how they landed on their offer. What homes near you have sold for, what
        condition yours is in, what they expect to put into it. It does not have to be complicated.
        It just has to make sense.
      </P>
      <P>
        Green flag: they break it down in plain English and they stay patient when you ask follow-up
        questions. You hang up understanding the number, even if you want to think it over.
      </P>
      <P>
        Warning sign: the offer is a mystery, or worse, it is suspiciously high. Here is the trap to
        watch for. Some operators dangle a big number to get your signature, then knock thousands off
        once you are committed and tired. They call it a price change after the inspection. A buyer
        who explains the math up front has far less room to pull that move on you later. So make them
        show their work.
      </P>

      <H2>4. Are You A Real Person, Local, With A Real Address?</H2>
      <P>
        You are about to talk about your home, your timeline, maybe your finances. You deserve to know
        who is on the other end. So ask the simple stuff. Where is your office? Can I reach a real
        person when I call back? What is your name, and who is on your team?
      </P>
      <P>
        Green flag: a local presence, a phone number that a human actually answers, and a person who
        gives you their name and sticks with you through the whole conversation. You feel like you are
        dealing with a neighbor, not a call center three time zones away.
      </P>
      <P>
        Warning sign: no address, only a web form, a number that always rolls to voicemail, or a
        revolving door of different people who do not know your situation. If you cannot easily find
        them today, picture how hard they will be to reach on closing day when something needs fixing.
      </P>

      <H2>5. Will You Give Me Time, Put It In Writing, And Skip The Pressure?</H2>
      <P>
        This is the final filter, and maybe the most important one. A trustworthy buyer wants you to
        feel good about this. They will give you the offer in writing so you can read it slowly, share
        it with your kids or your attorney, and sit with it. They will not rush you.
      </P>
      <P>
        Green flag: the offer comes in writing, the terms are clear, and there is no clock ticking down
        on you. They tell you to take your time. They mean it.
      </P>
      <P>
        Warning sign: this offer is only good today. Sign now or lose it. You do not need a lawyer,
        just trust me. Every one of those lines is built to get you moving before you can think. Real
        buyers know a good offer holds up in daylight. Only the shaky ones need you in a hurry.
      </P>

      <ArticleImage
        src="/images/adv-couple-kitchen.jpg"
        alt="An older couple weighing a buyer at the kitchen table"
        caption="The right buyer hands you the offer in writing and tells you to take your time. The decision should feel calm, not rushed."
      />

      <H2>The Thing That Makes All Five Work</H2>
      <P>
        Notice what these five questions have in common. None of them require you to know anything
        about real estate. They are not tests you can fail. They are just honest questions any decent
        person would answer without a fuss.
      </P>
      <P>
        And here is the part that should take a load off your shoulders. A real buyer welcomes every
        single one of these questions. They are glad you asked about their track record, their funds,
        their math, their address, and their timeline, because answering well is how they earn your
        trust and your business. The act of vetting them is not rude. It is the exact thing that
        filters the real buyers from the tire-kickers, all on its own.
      </P>
      <P>
        Think about it. A flake hates these questions, so the questions chase them off. A serious
        buyer loves these questions, so the questions pull them closer. You do not have to figure out
        who is legit. You just have to ask, then watch how they react. The five minutes does the
        sorting for you. Quick recap of what you are listening for:
      </P>
      <UL>
        <li>A local track record you can look up, not just words.</li>
        <li>Proof of funds, offered without a fuss.</li>
        <li>A number they can explain in plain English.</li>
        <li>A real name, a real address, a human who answers.</li>
        <li>A written offer and no pressure to sign today.</li>
      </UL>
      <P>
        So the next time someone offers to buy your house for cash, do not feel like you have to be an
        expert or hire a team to protect yourself. Pour a cup of coffee, run them through these five
        questions, and trust what you see. If they pass with a smile, you may have found a buyer worth
        talking to. If they squirm, you just saved yourself a world of headache.
      </P>
      <P>
        You have spent decades reading people. This is just one more conversation where that skill
        pays off. Slow down, ask, and let the answers tell you the truth.
      </P>

      <ContactCTA
        phoneDisplay={config.phoneDisplay}
        phoneHref={config.phoneHref}
        smsKeyword={config.smsKeyword}
        heading="Put us through the checklist"
        subheading="Text us the word OFFER or call. Ask us anything before you share a single private detail."
      />
    </ArticleShell>
  )
}
