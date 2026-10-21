import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {};

/** Global element → component mapping for MDX case studies (required by `@next/mdx`). */
export function useMDXComponents(): MDXComponents {
  return components;
}
