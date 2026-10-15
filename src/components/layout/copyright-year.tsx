import { cacheLife } from "next/cache";

/** Current year, cached so prerendering stays deterministic under Cache Components. */
export async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
