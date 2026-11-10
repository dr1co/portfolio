/** Human-readable experience from a start year, e.g. "4+ years". */
export function experienceLabel(since: number, year: number): string {
  const years = year - since;
  if (years < 1) return "Less than a year";
  return `${years}+ ${years === 1 ? "year" : "years"}`;
}
