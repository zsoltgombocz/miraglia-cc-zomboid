import { db } from './db.js';
import { content, testimonials } from './schema.js';
import { sql } from 'drizzle-orm';

const defaultContent = {
  en: {
    hero: {
      title: 'NewDawn Zomboid',
      description: 'A brutal, community-driven survival experience. Scavenge, build, and outlive the horde in a meticulously crafted world.',
    },
    serverInfo: {
      region: 'North America (East)',
      gameplayStyle: 'PvPvE / Light Roleplay',
      wipePolicy: 'No scheduled wipes',
      lootRespawn: 'Every 2 in-game months',
      additionalNotes: 'In-game voice chat is highly encouraged. Factions can claim safehouses after 3 days of playtime. Reading speeds are increased by 2x to respect your time.',
    },
    rules: [
      {
        title: '1. Respect other players outside of gameplay',
        content: 'Trash talk in character is fine, but hate speech, real-life harassment, or extreme toxicity in global chat or Discord will result in an immediate ban.',
      },
      {
        title: '2. No cheating or exploiting',
        content: 'The use of third-party software, duping items, or exploiting map glitches is strictly prohibited. Report exploits if you find them.',
      },
      {
        title: '3. Safehouse mechanics',
        content: 'You may claim a safehouse after 3 days of survival time. Glitching into safehouses or destroying safehouse walls through exploits is forbidden. Normal raiding mechanics apply.',
      },
      {
        title: '4. Combat logging is cowardly',
        content: 'Disconnecting while in active PvP combat or while being actively pursued by zombies to avoid death is not allowed. Your character remains in the world briefly after disconnect.',
      },
      {
        title: '5. Admin decisions are final',
        content: 'If an admin makes a ruling on a dispute, respect it. If you believe an admin is acting unfairly, submit a ticket quietly rather than causing drama in global chat.',
      },
    ],
  },
  hu: {
    hero: {
      title: 'NewDawn Zomboid',
      description: 'Brutális, közösség által vezérelt túlélési élmény. Gyűjts, építs, és éld túl a hordát egy gondosan kidolgozott világban.',
    },
    serverInfo: {
      region: 'Észak-Amerika (Kelet)',
      gameplayStyle: 'PvPvE / Könnyű Roleplay',
      wipePolicy: 'Nincs tervezett törlés',
      lootRespawn: '2 játékbeli hónaponként',
      additionalNotes: 'A játékon belüli hangchat erősen ajánlott. A frakciók 3 nap játékidő után igényelhetnek biztonságos házakat. Az olvasási sebesség 2x-re van növelve, hogy tiszteletben tartsuk az idődet.',
    },
    rules: [
      {
        title: '1. Tiszteld a többi játékost a játékon kívül',
        content: 'A karakterben való beszólások rendben vannak, de a gyűlöletbeszéd, valós életi zaklatás vagy szélsőséges toxicitás a globális chatben vagy Discordon azonnali kitiltást eredményez.',
      },
      {
        title: '2. Nincs csalás vagy kihasználás',
        content: 'Harmadik féltől származó szoftverek használata, tárgyak duplikálása vagy térképhibák kihasználása szigorúan tilos. Jelentsd a hibákat, ha találsz ilyeneket.',
      },
      {
        title: '3. Biztonságos ház mechanikák',
        content: '3 nap túlélési idő után igényelhetsz biztonságos házat. A biztonságos házakba való glitchelés vagy a biztonságos ház falainak kihasználáson keresztüli elpusztítása tilos. A normál raid mechanikák érvényesek.',
      },
      {
        title: '4. A harci kilépés gyávaság',
        content: 'Nem megengedett a szerver elhagyása aktív PvP harc közben vagy zombik általi aktív üldözés során a halál elkerülése érdekében. A karaktered rövid ideig a világban marad a kilépés után.',
      },
      {
        title: '5. Az admin döntések véglegesek',
        content: 'Ha egy admin döntést hoz egy vitában, tartsd tiszteletben. Ha úgy gondolod, hogy egy admin igazságtalanul jár el, adj be egy jegyet csendben, ahelyett, hogy drámát okoznál a globális chatben.',
      },
    ],
  },
};

const defaultTestimonials = [
  {
    quote: "Best balance of mods I've found. It's brutal enough to be scary, but the QoL mods make it bearable to rebuild after dying.",
    author: 'Marcus T.',
    initial: 'M',
  },
  {
    quote: 'The admin team is super responsive. The server economy and faction wars make late-game actually worth playing.',
    author: 'Sarah204',
    initial: 'S',
  },
  {
    quote: 'Love the customized safehouse rules. Gives us a reason to fight over territory without completely losing our progress to a glitch.',
    author: 'Alex G.',
    initial: 'A',
  },
  {
    quote: "Hardcore survival at its finest. If you're looking for an easy time, look elsewhere. The loot settings are perfectly scarce.",
    author: 'ZombieBait',
    initial: 'Z',
  },
];

export async function initializeDatabase() {
  // Check if content exists
  const contentCount = await db.select({ count: sql`count(*)` }).from(content);

  if (contentCount[0].count === 0) {
    for (const [lang, sections] of Object.entries(defaultContent)) {
      for (const [section, data] of Object.entries(sections)) {
        await db.insert(content).values({
          language: lang,
          section: section,
          data: data,
        });
      }
    }
    console.log('Initialized default content');
  }

  // Check if testimonials exist
  const testimonialsCount = await db.select({ count: sql`count(*)` }).from(testimonials);

  if (testimonialsCount[0].count === 0) {
    for (const testimonial of defaultTestimonials) {
      await db.insert(testimonials).values(testimonial);
    }
    console.log('Initialized default testimonials');
  }
}
