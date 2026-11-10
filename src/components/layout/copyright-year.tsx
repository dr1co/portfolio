import { currentYear } from "@/lib/current-year";

/** Current year for the footer. */
export async function CopyrightYear() {
  return <>{await currentYear()}</>;
}
