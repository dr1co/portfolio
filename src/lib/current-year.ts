import { cacheLife } from "next/cache";

/** Current year, cached so prerendering stays deterministic under Cache Components. */
export async function currentYear(): Promise<number> {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}
