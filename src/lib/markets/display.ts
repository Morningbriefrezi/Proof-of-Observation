import type { MarketMetadata } from "./types";

/**
 * Friendly, jargon-free titles for each market. Falls back to the technical
 * title if no entry exists. Keep these as plain "will X happen?" questions.
 */
const SIMPLE_TITLES: Record<string, string> = {
  // Meteor — v2
  "meteor-001-lyrids-zhr": "Will the Lyrids meteor shower be a strong one?",
  "meteor-002-eta-aquariids-zhr": "Will the Eta Aquariids put on a great show?",
  "meteor-003-perseids-zhr": "Will the Perseids deliver 100+ meteors per hour?",
  "meteor-004-fireball-april": "Will a very bright fireball appear in April?",
  "meteor-005-outburst": "Will any shower surprise us with an outburst this summer?",

  // Solar — v2
  "solar-001-xflare-may": "Will the Sun fire a major flare before mid-May?",
  "solar-002-kp7-june": "Will a strong solar storm hit Earth before June?",
  "solar-003-aurora-45n": "Will the northern lights drop down to mid-latitudes?",
  "solar-004-x5-2026": "Will the Sun fire an extreme flare this year?",
  "solar-005-f107-decline": "Will the Sun go quiet for a full week?",

  // Mission — v2
  "mission-001-artemis-2": "Will the Artemis II crew return safely?",
  "mission-002-roman-2026": "Will the Roman Space Telescope launch by year-end?",
  "mission-003-change7": "Will China launch its Chang'e 7 mission this year?",
  "mission-004-starship-orbit": "Will SpaceX Starship reach orbit by July?",
  "mission-005-plato": "Will ESA's PLATO telescope launch by 2027?",

  // Comet — v2
  "comet-001-c2025r3-nakedeye": "Will Comet C/2025 R3 become visible to the naked eye?",
  "comet-002-new-discovery": "Will a new Earth-crossing comet be discovered in 2026?",
  "comet-003-rubin-nea": "Will Vera Rubin spot a new near-Earth asteroid right away?",
  "comet-004-tianwen2-sample": "Will China's Tianwen-2 grab its asteroid sample?",
  "comet-005-c2026a1-survives": "Will Comet C/2026 A1 survive its solar flyby?",

  // Discovery — v2
  "discovery-001-jwst-bio": "Will JWST find a possible sign of life on an exoplanet?",
  "discovery-002-nobel-cosmo": "Will the Nobel Prize go to cosmology this year?",
  "discovery-003-ligo-nsmerger": "Will LIGO catch a neutron star merger with light?",
  "discovery-004-gaia-dr4": "Will Gaia release its huge new star catalog by 2027?",
  "discovery-005-laserseti": "Will LaserSETI flag an unusual signal worth following?",

  // Weather × sky — v2
  "weather-001-tbilisi-clear-run": "Will Tbilisi get 3 clear nights in a row in May?",
  "weather-002-spain-eclipse": "Will Spain's August solar eclipse have clear skies?",
  "weather-003-tbilisi-lyrids": "Will Tbilisi have clear skies for the Lyrids?",
  "weather-004-georgia-bortle2": "Will any spot in Georgia hit truly dark Bortle 2 skies?",
  "weather-005-perseids-europe": "Will the Perseids peak find clear skies across Europe?",

  // Sky / weather — v1
  "sky-001-lyrids-zhr": "Will the Lyrids reach their typical 18 meteors/hour?",
  "sky-002-eta-aquariids-zhr": "Will the Eta Aquariids cross 40 meteors/hour?",
  "sky-003-vandenberg-april22": "Will SpaceX nail the April 22 California launch?",
  "sky-004-falcon9-cadence": "Will SpaceX hit 10 launches in 20 days?",
  "sky-005-mclass-flare-judging": "Will the Sun fire an M-class flare this week?",
  "sky-006-kp5-geomagnetic": "Will a G1+ solar storm hit Earth this week?",
  "sky-007-xclass-flare-window": "Will an X-class solar flare strike in the next 3 weeks?",
  "weather-001-tbilisi-warm-day": "Will Tbilisi cross 22°C on April 27?",
  "weather-002-tbilisi-may-day-rain": "Will Tbilisi see real rain on May Day?",
  "weather-003-stockholm-frost": "Will Stockholm drop near freezing this week?",
  "weather-004-london-heathrow-rain": "Will it actually rain in London on April 30?",
  "weather-005-tbilisi-clear-eta": "Will Tbilisi have clear skies for the Eta Aquariids?",
  "weather-006-tbilisi-dry-week": "Will Tbilisi go a full week without rain?",
  "weather-007-nyc-warm-may7": "Will New York hit shorts weather on May 7?",
  "natural-001-m6-judging-week": "Will an M6+ earthquake hit somewhere this week?",
  "natural-002-m5-near-tbilisi": "Will an M5+ quake shake somewhere near Tbilisi?",
  "natural-003-new-volcanic-eruption": "Will a new volcano start erupting in the next 3 weeks?",
  "natural-004-firms-large-wildfire-us": "Will a major US wildfire flare up in the next 3 weeks?",
  "natural-005-named-tropical-cyclone": "Will a named tropical storm form anywhere on Earth?",
  "natural-006-reykjanes-swarm": "Will Iceland get another big earthquake swarm?",
};

export function displayTitle(meta: MarketMetadata): string {
  return meta.simpleTitle ?? SIMPLE_TITLES[meta.id] ?? meta.title;
}
