import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },
  // Only the Docker build sets BUILD_STANDALONE; `next start` and Vercel need the regular output.
  output: process.env.BUILD_STANDALONE === "1" ? "standalone" : undefined,
  // The case-study page reads its MDX source from disk to build the table of contents.
  outputFileTracingIncludes: {
    "/projects/*": ["src/content/case-studies/**/*.mdx"],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "@shikijs/rehype",
        {
          themes: { light: "github-light-default", dark: "github-dark" },
          defaultColor: false,
          addLanguageClass: true,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
