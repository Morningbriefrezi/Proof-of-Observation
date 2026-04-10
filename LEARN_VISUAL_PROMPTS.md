# LEARN PAGE — VISUAL UPGRADE PROMPTS

Goal: add real images to the Learn page without breaking any existing functionality.
Each prompt is self-contained and safe to run independently.

Run in order: VIS-P1 → VIS-P2 → VIS-P3 → VIS-P4

---

## VIS-PROMPT 1 — Planet Images

```
I'm building Stellar for Colosseum Frontier. The Planets tab shows text cards
but has no images. I need to add a real NASA/ESA image to each planet card —
visible as a thumbnail in the collapsed state, and as a larger image when expanded.

Read this file fully: src/app/chat/page.tsx

---

PART A — Create the image folder and download planet images

Create the folder: public/images/planets/

Use these NASA public domain image URLs (direct link, no auth needed).
Save them as the filenames shown:

mercury.jpg  — https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/600px-Mercury_in_true_color.jpg
venus.jpg    — https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/600px-Venus-real_color.jpg
earth.jpg    — https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg
mars.jpg     — https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/600px-OSIRIS_Mars_true_color.jpg
jupiter.jpg  — https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg
saturn.jpg   — https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/600px-Saturn_during_Equinox.jpg
uranus.jpg   — https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/600px-Uranus2.jpg
neptune.jpg  — https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/600px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg

Download script (run once from project root):
  mkdir -p public/images/planets
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/600px-Mercury_in_true_color.jpg" -o public/images/planets/mercury.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/600px-Venus-real_color.jpg" -o public/images/planets/venus.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/600px-The_Earth_seen_from_Apollo_17.jpg" -o public/images/planets/earth.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/600px-OSIRIS_Mars_true_color.jpg" -o public/images/planets/mars.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/600px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg" -o public/images/planets/jupiter.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/600px-Saturn_during_Equinox.jpg" -o public/images/planets/saturn.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/600px-Uranus2.jpg" -o public/images/planets/uranus.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/600px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg" -o public/images/planets/neptune.jpg

---

PART B — Add image field to PLANETS array

For each planet in the PLANETS array, add:
  img: '/images/planets/mercury.jpg'   (adjust filename per planet)

---

PART C — Update PlanetsTab to show images

In the collapsed card header, replace the plain emoji circle with a real image:

  Replace:
    <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
      style={{ background: `${p.color}18`, border: `1px solid ${p.color}40` }}>
      {p.emoji}
    </div>

  With:
    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 relative"
      style={{ border: `1px solid ${p.color}40` }}>
      <Image
        src={p.img}
        alt={p.name['en']}
        fill
        className="object-cover"
        sizes="40px"
      />
    </div>

In the expanded section, add a full-width planet image BEFORE the facts/kids content:

    <div className="relative w-full rounded-xl overflow-hidden mb-2" style={{ height: '160px' }}>
      <Image
        src={p.img}
        alt={p.name[locale]}
        fill
        className="object-cover"
        sizes="(max-width: 672px) 100vw, 672px"
      />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,11,20,0.8) 0%, transparent 60%)' }} />
      <p className="absolute bottom-2 left-3 text-white text-xs font-semibold opacity-80">{p.name[locale]}</p>
    </div>

Import Image from 'next/image' at the top of the file.

Add to next.config.ts (if not already):
  images: {
    domains: [],   // local images don't need domain config
  }

---

TESTING:
1. Open Planets tab — each planet card should show a real photo as the round thumbnail
2. Tap any planet — full-width photo appears at top of expanded section
3. Photos should not distort the layout or overflow
4. Kids Mode toggle should still work with images present
5. "Observe Tonight →" CTA should still appear below the image
```

---

## VIS-PROMPT 2 — Deep Sky Object Images

```
I'm building Stellar for Colosseum Frontier. The Deep Sky tab shows text cards
but has no images. I need to add a real Hubble/NASA image to each of the 10
deep sky objects.

Read this file fully: src/app/chat/page.tsx

---

PART A — Download DSO images

  mkdir -p public/images/dso
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg/600px-Orion_Nebula_-_Hubble_2006_mosaic_18000.jpg" -o public/images/dso/m42.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Andromeda_Galaxy_%28with_h-alpha%29.jpg/600px-Andromeda_Galaxy_%28with_h-alpha%29.jpg" -o public/images/dso/m31.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Pleiades_large.jpg/600px-Pleiades_large.jpg" -o public/images/dso/m45.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Crab_Nebula.jpg/600px-Crab_Nebula.jpg" -o public/images/dso/m1.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Messier_13_Hubble_WikiSky.jpg/600px-Messier_13_Hubble_WikiSky.jpg" -o public/images/dso/m13.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1c/M57_The_Ring_Nebula.JPG/600px-M57_The_Ring_Nebula.JPG" -o public/images/dso/m57.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Omega_Nebula.jpg/600px-Omega_Nebula.jpg" -o public/images/dso/m17.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Messier51_sRGB.jpg/600px-Messier51_sRGB.jpg" -o public/images/dso/m51.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Lagoon_Nebula_from_the_Mount_Lemmon_SkyCenter_Schulman_Telescope_courtesy_Adam_Block.jpg/600px-Lagoon_Nebula_from_the_Mount_Lemmon_SkyCenter_Schulman_Telescope_courtesy_Adam_Block.jpg" -o public/images/dso/m8.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Double_Cluster_h_Persei_and_Chi_Persei.jpg/600px-Double_Cluster_h_Persei_and_Chi_Persei.jpg" -o public/images/dso/ngc869.jpg

---

PART B — Add img field to DSO array

For each object, add: img: '/images/dso/m42.jpg' (using the correct filename per object)

---

PART C — Update DeepSkyTab to show images

Same pattern as planets:
- Collapsed header: replace emoji circle with a rounded image thumbnail (w-10 h-10)
- Expanded: full-width image (height: 160px) with gradient overlay and object name, before the desc text

---

TESTING:
1. All 10 deep sky objects should show Hubble/telescope images
2. Kids Mode should still work
3. Layout should remain clean with no overflow
```

---

## VIS-PROMPT 3 — Constellation Visual Guide (New Tab Section)

```
I'm building Stellar for Colosseum Frontier. I want to add a visual constellation
guide — a new sub-section within the Learn page showing the 12 most important
constellations with a star-map style image and a 2-line description.

This is NOT a new tab. Add it as a new section inside the existing Planets tab,
below the planet list, separated by a section divider.

Read this file fully: src/app/chat/page.tsx

---

PART A — Download constellation images

  mkdir -p public/images/constellations
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/OrionCC.jpg/600px-OrionCC.jpg" -o public/images/constellations/orion.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Ursa_Major_constellation_map.svg/600px-Ursa_Major_constellation_map.svg.png" -o public/images/constellations/ursa-major.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/CassiopeiaCC.jpg/600px-CassiopeiaCC.jpg" -o public/images/constellations/cassiopeia.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/ScorpiusCC.jpg/600px-ScorpiusCC.jpg" -o public/images/constellations/scorpius.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/CygnusCC.jpg/600px-CygnusCC.jpg" -o public/images/constellations/cygnus.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c6/LeoCC.jpg/600px-LeoCC.jpg" -o public/images/constellations/leo.jpg

---

PART B — Add a CONSTELLATIONS data array

const CONSTELLATIONS = [
  {
    id: 'orion',
    name: { en: 'Orion', ka: 'ორიონი' },
    img: '/images/constellations/orion.jpg',
    season: { en: 'Winter', ka: 'ზამთარი' },
    stars: 7,
    desc: { en: 'The Hunter — easiest constellation to find. Three bright stars form the famous belt.', ka: 'მონადირე — ყველაზე ადვილად მოსაძებნი. სამი კაშკაში ვარსკვლავი ქმნის სარტყელს.' },
    highlight: { en: 'Contains the Orion Nebula (M42) and red supergiant Betelgeuse', ka: 'შეიცავს ორიონის ნისლეულს (M42) და ბეთელგეიზეს' },
    color: '#f97316',
  },
  {
    id: 'ursa-major',
    name: { en: 'Ursa Major', ka: 'დიდი დათვი' },
    img: '/images/constellations/ursa-major.jpg',
    season: { en: 'Year-round (north)', ka: 'მთელი წელი (ჩრდილოეთი)' },
    stars: 7,
    desc: { en: 'The Great Bear — contains the Big Dipper, which points to the North Star.', ka: 'დიდი დათვი — შეიცავს "დიდ ჩარხს", რომელიც ჩრდილოეთის ვარსკვლავისკენ მიუთითებს.' },
    highlight: { en: 'The two end stars of the Big Dipper always point toward Polaris', ka: 'ჩარხის ორი ბოლო ვარსკვლავი ყოველთვის პოლარისისკენ მიუთითებს' },
    color: '#38f0ff',
  },
  {
    id: 'cassiopeia',
    name: { en: 'Cassiopeia', ka: 'კასიოპეა' },
    img: '/images/constellations/cassiopeia.jpg',
    season: { en: 'Autumn/Winter', ka: 'შემოდგომა/ზამთარი' },
    stars: 5,
    desc: { en: 'The Queen — W or M shape in the north sky. Never sets from Georgia.', ka: 'დედოფალი — W ან M ფორმა ჩრდილოეთ ცაზე. საქართველოდან არასოდეს ჩადის.' },
    highlight: { en: 'Opposite Ursa Major across the pole — use it when the Dipper is low', ka: 'პოლუსის მეორე მხარეს დიდი დათვის პირდაპირ — გამოიყენე, როდესაც ჩარხი დაბლაა' },
    color: '#8B5CF6',
  },
  {
    id: 'scorpius',
    name: { en: 'Scorpius', ka: 'მორიელი' },
    img: '/images/constellations/scorpius.jpg',
    season: { en: 'Summer', ka: 'ზაფხული' },
    stars: 18,
    desc: { en: 'The Scorpion — one of the most dramatic constellations with a curved tail dipping into the Milky Way.', ka: 'მორიელი — ერთ-ერთი ყველაზე დრამატული. მოხრილი კუდი ირმის ნახტომში ეშვება.' },
    highlight: { en: 'Antares is a red supergiant at its heart — 700× the Sun\'s diameter', ka: 'ანტარესი წითელი ზეგიგანტია — მზის 700-ჯერ დიდი' },
    color: '#ef4444',
  },
  {
    id: 'cygnus',
    name: { en: 'Cygnus', ka: 'გედი' },
    img: '/images/constellations/cygnus.jpg',
    season: { en: 'Summer/Autumn', ka: 'ზაფხული/შემოდგომა' },
    stars: 9,
    desc: { en: 'The Swan — forms a clear cross (Northern Cross) flying along the Milky Way.', ka: 'გედი — ნათელ ჯვარს ქმნის (ჩრდილოეთის ჯვარი) ირმის ნახტომში.' },
    highlight: { en: 'Deneb marks the tail — one of the most luminous stars visible to the naked eye', ka: 'დენები კუდს ნიშნავს — ერთ-ერთი ყველაზე ნათელი ვარსკვლავი' },
    color: '#FFD166',
  },
  {
    id: 'leo',
    name: { en: 'Leo', ka: 'ლომი' },
    img: '/images/constellations/leo.jpg',
    season: { en: 'Spring', ka: 'გაზაფხული' },
    stars: 9,
    desc: { en: 'The Lion — a prominent spring constellation with a backwards question-mark shape called the Sickle.', ka: 'ლომი — გაზაფხულის თვალსაჩინო თანავარსკვლავედი. კითხვის ნიშნის ფორმა "მამელს" ქმნის.' },
    highlight: { en: 'Regulus, its brightest star, sits almost exactly on the ecliptic', ka: 'რეგულუსი, ყველაზე კაშკაში ვარსკვლავი, ეკლიპტიკაზე ზის' },
    color: '#34d399',
  },
];

---

PART C — Add ConstellationsSection component and render it in PlanetsTab

Create a ConstellationsSection component in the same file (or inline in PlanetsTab).

Add a section divider after the planet list:
  <div className="mt-2 pt-4 border-t border-white/[0.05]">
    <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-3">
      {locale === 'ka' ? 'თანავარსკვლავედები' : 'Constellations'}
    </p>
    <div className="flex flex-col gap-3">
      {CONSTELLATIONS.map(c => (
        <div key={c.id} className="glass-card overflow-hidden">
          <div className="relative w-full" style={{ height: '120px' }}>
            <Image src={c.img} alt={c.name['en']} fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(7,11,20,0.85) 40%, transparent 100%)' }} />
            <div className="absolute inset-0 flex flex-col justify-center px-4 gap-1">
              <div className="flex items-center gap-2">
                <p className="text-white font-bold text-base">{c.name[locale]}</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${c.color}20`, color: c.color, border: `1px solid ${c.color}30` }}>
                  {c.season[locale]}
                </span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed max-w-[240px]">{c.desc[locale]}</p>
              <p className="text-xs mt-0.5" style={{ color: c.color }}>{c.highlight[locale]}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>

Place this after the closing </div> of the planets list, still inside the PlanetsTab return.

---

TESTING:
1. Planets tab should show constellation cards below the planet list
2. Each card shows a star-map photo on the right with text overlaid on left
3. Season badge visible on each card
4. Cards should not be tappable/expandable — static display only
```

---

## VIS-PROMPT 4 — Telescope Visual Setup Guide

```
I'm building Stellar for Colosseum Frontier. The Telescopes tab has text
instructions but no visual aids. I need to add illustrated setup diagrams
for the 3 main telescope types a beginner encounters:
  1. Basic refractor (70mm / 90mm)
  2. Newtonian reflector (Dobsonian)
  3. GoTo computerized mount

Each telescope type gets a visual card at the top of its relevant level
in TelescopesTab.tsx. This is a visual guide — photos of the real telescope
with key parts labeled.

Read this file fully: src/components/sky/TelescopesTab.tsx

---

PART A — Download telescope images

  mkdir -p public/images/telescopes
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Refractor_telescope_%28aka%29.jpg/600px-Refractor_telescope_%28aka%29.jpg" -o public/images/telescopes/refractor.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Dobsonian_telescope.jpg/600px-Dobsonian_telescope.jpg" -o public/images/telescopes/dobsonian.jpg
  curl -L "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/Celestron_NexStar_5SE.jpg/600px-Celestron_NexStar_5SE.jpg" -o public/images/telescopes/goto.jpg

---

PART B — Add a SCOPE_INTROS array

Define this above the TelescopesTab component:

const SCOPE_INTROS: Partial<Record<Level, { img: string; title: string; subtitle: string; parts: string[] }>> = {
  beginner: {
    img: '/images/telescopes/refractor.jpg',
    title: 'The 70–90mm Refractor',
    subtitle: 'Most common beginner scope. Great for Moon, planets, and star clusters.',
    parts: ['Lens cap (remove before use!)', 'Focuser — turn to sharpen the image', 'Eyepiece — swap for more magnification', 'Finderscope — points at your target first', 'Tripod — keep it stable on flat ground'],
  },
  intermediate: {
    img: '/images/telescopes/dobsonian.jpg',
    title: 'The Dobsonian Reflector',
    subtitle: 'Maximum aperture for the price. The best visual telescope at any budget.',
    parts: ['Primary mirror (bottom) — collects light', 'Secondary mirror (top) — redirects to eyepiece', 'Rocker box — smooth alt-az movement', 'No tripod needed — sits on the ground', 'Collimation cap — check alignment each session'],
  },
  advanced: {
    img: '/images/telescopes/goto.jpg',
    title: 'The GoTo Computerized Mount',
    subtitle: 'Point at any of 40,000+ objects automatically. Essential for astrophotography.',
    parts: ['Hand controller — enter any object name', 'RA/Dec axes — follow Earth\'s rotation', 'Polar axis — align with Polaris first', 'Motor drives — track objects as sky moves', 'USB port — connect to computer for imaging'],
  },
};

---

PART C — Add scope intro card to TelescopesTab render

At the top of the cards list, before rendering the guide cards, check if
SCOPE_INTROS[level] exists and if so render:

  {SCOPE_INTROS[level] && (() => {
    const intro = SCOPE_INTROS[level]!;
    return (
      <div className="glass-card overflow-hidden mb-1">
        <div className="relative w-full" style={{ height: '180px' }}>
          <Image src={intro.img} alt={intro.title} fill className="object-cover" sizes="(max-width: 672px) 100vw, 672px" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(7,11,20,1) 0%, rgba(7,11,20,0.4) 60%, transparent 100%)' }} />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-white font-bold text-base">{intro.title}</p>
            <p className="text-slate-400 text-xs mt-0.5">{intro.subtitle}</p>
          </div>
        </div>
        <div className="p-4 pt-3">
          <p className="text-[10px] uppercase tracking-widest text-slate-600 mb-2">Key Parts</p>
          <div className="flex flex-col gap-1.5">
            {intro.parts.map((part, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="font-bold flex-shrink-0 mt-0.5" style={{ color: activeConfig.color }}>
                  {i + 1}
                </span>
                <span className="text-slate-300">{part}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  })()}

Import Image from 'next/image' at the top of TelescopesTab.tsx.

---

TESTING:
1. Beginner level — refractor photo + 5 labeled parts appear before the guide cards
2. Intermediate level — Dobsonian photo + parts
3. Advanced level — GoTo mount photo + parts
4. Pro level — no intro card (no image defined for it)
5. Switching levels should swap the intro card correctly
6. Image should be crisp, not blurry or pixelated on mobile
```
