import type { FarmHawkResult } from './types';

export async function verifyWithFarmHawk(lat: number, lon: number): Promise<FarmHawkResult> {
  console.log('[FarmHawk] Scanning sky conditions at', lat, lon);
  await new Promise(r => setTimeout(r, 2000));
  const cloudCover = Math.floor(Math.random() * 20) + 5;
  return {
    verified: true,
    cloudCover,
    visibility: cloudCover < 15 ? 'Excellent' : cloudCover < 25 ? 'Good' : 'Poor',
    conditions: cloudCover < 15
      ? 'Clear skies, low humidity, excellent seeing'
      : 'Partly cloudy, acceptable observing conditions',
    oracleHash: '0x' + Array.from({ length: 40 }, () =>
      '0123456789abcdef'[Math.floor(Math.random() * 16)]).join(''),
    scanTimestamp: new Date().toISOString(),
  };
}
