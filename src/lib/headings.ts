import GithubSlugger from "github-slugger";

export type Heading = { id: string; text: string };

function plainText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[`*_~]/g, "")
    .trim();
}

/** Level-2 headings of an MDX source, with the same ids `rehype-slug` assigns (both use github-slugger). */
export function getHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
    const match = !inFence && /^##\s+(.+?)\s*#*\s*$/.exec(line);
    if (match) {
      const text = plainText(match[1]);
      headings.push({ id: slugger.slug(text), text });
    }
  }
  return headings;
}
