import Image from "next/image";
import { useId } from "react";

/** Captioned image for MDX. `alt` and `caption` are required; store files under `public/case-studies/<slug>/`. */
export function Figure({
  src,
  alt,
  caption,
  width,
  height,
}: {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}) {
  const captionId = useId();
  return (
    <figure aria-labelledby={captionId} className="my-8">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes="(min-width: 1024px) 70ch, 100vw"
        className="h-auto w-full rounded-lg border border-border"
      />
      <figcaption
        id={captionId}
        className="mt-2 text-center text-sm text-muted"
      >
        {caption}
      </figcaption>
    </figure>
  );
}
