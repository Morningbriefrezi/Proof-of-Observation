// IMO 2026 meteor shower calendar. Peaks and active windows track
// the International Meteor Organization's annual working list — peaks are
// stable to ±1 day year-on-year, so a static, year-cycled list is the
// authoritative form of this data, not a network dependency.
//
// Each entry stores the active window and peak as month/day pairs;
// `activeMeteorShower` resolves them against the current year and handles
// year-wrap for showers that straddle Dec/Jan (Quadrantids).

interface Shower {
  name: string;
  start: { month: number; day: number };
  end:   { month: number; day: number };
  peak:  { month: number; day: number };
  zhr:   number;
}

const SHOWERS: Shower[] = [
  { name: 'Quadrantids',           start: { month: 12, day: 28 }, end: { month: 1, day: 12 }, peak: { month: 1, day: 3 },  zhr: 110 },
  { name: 'Lyrids',                start: { month: 4,  day: 14 }, end: { month: 4, day: 30 }, peak: { month: 4, day: 22 }, zhr: 18  },
  { name: 'Eta Aquariids',         start: { month: 4,  day: 19 }, end: { month: 5, day: 28 }, peak: { month: 5, day: 6  }, zhr: 50  },
  { name: 'Alpha Capricornids',    start: { month: 7,  day: 3  }, end: { month: 8, day: 15 }, peak: { month: 7, day: 30 }, zhr: 5   },
  { name: 'Southern δ Aquariids',  start: { month: 7,  day: 12 }, end: { month: 8, day: 23 }, peak: { month: 7, day: 30 }, zhr: 25  },
  { name: 'Perseids',              start: { month: 7,  day: 17 }, end: { month: 8, day: 24 }, peak: { month: 8, day: 12 }, zhr: 100 },
  { name: 'Southern Taurids',      start: { month: 9,  day: 10 }, end: { month: 11,day: 20 }, peak: { month: 10,day: 10 }, zhr: 5   },
  { name: 'Draconids',             start: { month: 10, day: 6  }, end: { month: 10,day: 10 }, peak: { month: 10,day: 8  }, zhr: 10  },
  { name: 'Orionids',              start: { month: 10, day: 2  }, end: { month: 11,day: 7  }, peak: { month: 10,day: 21 }, zhr: 20  },
  { name: 'Northern Taurids',      start: { month: 10, day: 20 }, end: { month: 12,day: 10 }, peak: { month: 11,day: 12 }, zhr: 5   },
  { name: 'Leonids',               start: { month: 11, day: 6  }, end: { month: 11,day: 30 }, peak: { month: 11,day: 17 }, zhr: 15  },
  { name: 'Geminids',              start: { month: 12, day: 4  }, end: { month: 12,day: 17 }, peak: { month: 12,day: 14 }, zhr: 150 },
  { name: 'Ursids',                start: { month: 12, day: 17 }, end: { month: 12,day: 26 }, peak: { month: 12,day: 22 }, zhr: 10  },
];

const MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function dayOfYear(year: number, month: number, day: number): number {
  return Math.floor((Date.UTC(year, month - 1, day) - Date.UTC(year, 0, 0)) / 86400000);
}

export interface ActiveShower {
  name: string;
  zhr: number;
  peakLabel: string;
  daysFromPeak: number;
}

export function activeMeteorShower(now: Date): ActiveShower | null {
  const year = now.getUTCFullYear();
  const today = dayOfYear(year, now.getUTCMonth() + 1, now.getUTCDate());

  let best: { shower: Shower; daysFromPeak: number } | null = null;

  for (const s of SHOWERS) {
    const startDoy = dayOfYear(year, s.start.month, s.start.day);
    const endDoy   = dayOfYear(year, s.end.month, s.end.day);
    const peakDoy  = dayOfYear(year, s.peak.month, s.peak.day);

    // Year-wrap (Quadrantids): start in Dec, end in Jan.
    const inWindow = startDoy <= endDoy
      ? today >= startDoy && today <= endDoy
      : today >= startDoy || today <= endDoy;
    if (!inWindow) continue;

    // For wrapping showers, prefer the closer peak (this year vs. last year).
    let daysFromPeak: number;
    if (startDoy <= endDoy) {
      daysFromPeak = today - peakDoy;
    } else {
      const prevYearPeak = dayOfYear(year - 1, s.peak.month, s.peak.day) - 365;
      const a = today - peakDoy;
      const b = today - prevYearPeak;
      daysFromPeak = Math.abs(a) < Math.abs(b) ? a : b;
    }

    if (!best || s.zhr > best.shower.zhr) {
      best = { shower: s, daysFromPeak };
    }
  }

  if (!best) return null;
  const { shower, daysFromPeak } = best;
  return {
    name: shower.name,
    zhr: shower.zhr,
    peakLabel: `${MONTH_LABELS[shower.peak.month - 1]} ${shower.peak.day}`,
    daysFromPeak,
  };
}
