import { isHttpsUrl } from "./links";
import { siteConfig } from "./site-config";

export type BuildInfo = { short: string; url?: string };

const SHA_PATTERN = /^[0-9a-f]{7,40}$/i;

/** The commit this build was made from, or null when CI didn't provide a valid `COMMIT_SHA`. */
export function getBuildInfo(
  sha: string | undefined = process.env.COMMIT_SHA,
  repoUrl: string = siteConfig.sourceRepoUrl,
): BuildInfo | null {
  if (!sha || !SHA_PATTERN.test(sha)) return null;
  const short = sha.slice(0, 7);
  if (!isHttpsUrl(repoUrl)) return { short };
  return { short, url: `${repoUrl.replace(/\/$/, "")}/commit/${sha}` };
}
