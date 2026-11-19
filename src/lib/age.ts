import { cacheLife } from "next/cache";

/** Today's age from a birth month, cached so prerendering stays deterministic under Cache Components. */
export async function age(birthMonth: string): Promise<number> {
  "use cache";
  cacheLife("days");
  return ageOn(birthMonth, new Date());
}

/**
 * Age in whole years on `today`, from a `"YYYY-MM"` birth month. Only the month is known,
 * so the birthday counts from the 1st of the following month: never early, at most a month late.
 */
export function ageOn(birthMonth: string, today: Date): number {
  const [year, month] = birthMonth.split("-").map(Number);
  const passed = today.getMonth() + 1 > month;
  return today.getFullYear() - year - (passed ? 0 : 1);
}
