// Stars-as-currency rules.
//
// 100 Stars = 1 GEL of discount. Discount is capped at 30% of the product
// price. Stars are always burned in 100-Star increments — the slider on
// checkout snaps to this, and the server re-validates on order confirmation
// so a tampered client cannot bypass the cap.

export const STARS_PER_GEL = 100;
export const MAX_BURN_RATIO = 0.30;
export const BURN_INCREMENT = 100;

export function starsToGEL(stars: number): number {
  return stars / STARS_PER_GEL;
}

/**
 * Largest amount of Stars the user can burn against a GEL-priced product:
 * limited by 30% of price AND by the on-chain balance, snapped DOWN to a
 * 100-Star increment.
 */
export function computeMaxBurn(priceGEL: number, balance: number): number {
  if (priceGEL <= 0 || balance <= 0) return 0;
  const maxByPrice = Math.floor((priceGEL * MAX_BURN_RATIO) * STARS_PER_GEL);
  const cap = Math.min(maxByPrice, balance);
  return Math.floor(cap / BURN_INCREMENT) * BURN_INCREMENT;
}

export type ValidateBurnResult =
  | { ok: true; gelDiscount: number }
  | { ok: false; reason: string };

export function validateBurn(args: {
  priceGEL: number;
  stars: number;
  balance: number;
}): ValidateBurnResult {
  const { priceGEL, stars, balance } = args;
  if (!Number.isFinite(stars) || stars < 0 || !Number.isInteger(stars)) {
    return { ok: false, reason: 'Stars must be a non-negative integer' };
  }
  if (stars === 0) return { ok: true, gelDiscount: 0 };
  if (stars % BURN_INCREMENT !== 0) {
    return { ok: false, reason: `Stars must be in increments of ${BURN_INCREMENT}` };
  }
  if (stars > balance) {
    return { ok: false, reason: 'Insufficient Stars balance' };
  }
  const max = computeMaxBurn(priceGEL, balance);
  if (stars > max) {
    return { ok: false, reason: `Maximum burn is ${max} Stars (${MAX_BURN_RATIO * 100}% of price)` };
  }
  return { ok: true, gelDiscount: starsToGEL(stars) };
}
