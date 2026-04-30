import resume from "@/data/resume.json";

const SITE_URL = "https://github.com/Farisatif/my-fares-cv";
const SITE_NAME = "Fares Ahmed — Portfolio";
const DEFAULT_OG = "/og-image.png";

/**
 * Build a deduplicated meta array for a TanStack route's `head()` function.
 * Centralises title, description, Open Graph and Twitter tags so every page
 * gets a consistent baseline without copy-pasting.
 */
export function buildMeta(opts: {
  title: string;
  description: string;
  /** Path under SITE_URL — leave undefined to skip the canonical link. */
  path?: string;
  /** Override OG image. Defaults to the bundled site OG. */
  image?: string;
  /** "website" (default) or "article" / "profile". */
  ogType?: "website" | "article" | "profile";
}) {
  const { title, description, image = DEFAULT_OG, ogType = "website" } = opts;
  const url = opts.path ? `${SITE_URL}${opts.path}` : undefined;
  return [
    { title },
    { name: "description", content: description },
    { name: "author", content: resume.personal.name },
    // Open Graph
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: ogType },
    { property: "og:image", content: image },
    ...(url ? [{ property: "og:url", content: url }] : []),
    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
  ];
}

/**
 * Build the "Person" JSON-LD structured data block for the site owner.
 * Search engines use this to surface rich profile information (photo,
 * job title, links to social profiles) directly in results.
 */
export function buildPersonJsonLd() {
  const p = resume.personal;
  const sameAs: string[] = [];
  if (p.github) sameAs.push(`https://${p.github.replace(/^https?:\/\//, "")}`);
  if (p.linkedin) sameAs.push(`https://${p.linkedin.replace(/^https?:\/\//, "")}`);
  if (p.website) sameAs.push(`https://${p.website.replace(/^https?:\/\//, "")}`);
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: p.name,
    jobTitle: p.en?.title,
    description: p.en?.bio,
    image: p.avatar,
    email: p.email ? `mailto:${p.email}` : undefined,
    address: p.en?.location
      ? { "@type": "PostalAddress", addressLocality: p.en.location }
      : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    url: SITE_URL,
  };
}
