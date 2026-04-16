import { PublicKey } from '@solana/web3.js';

export function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export function isValidEmail(email: string): boolean {
  // RFC 5322 simplified — requires local@domain.tld minimum
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export function isValidCoordinates(lat: number, lon: number): boolean {
  return (
    isFinite(lat) && isFinite(lon) &&
    !isNaN(lat) && !isNaN(lon) &&
    lat >= -90 && lat <= 90 &&
    lon >= -180 && lon <= 180
  );
}

export function sanitizeString(s: string, maxLength: number): string {
  return s.trim().slice(0, maxLength);
}
