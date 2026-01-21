function hostFromUrl(url: string) {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return h.startsWith("www.") ? h.slice(4) : h;
  } catch {
    return "";
  }
}

function isLikelyCompanyDomain(host: string) {
  if (!host) return false;

  // Unngå store plattformer/community
  const block = [
    "facebook.com",
    "instagram.com",
    "linkedin.com",
    "tiktok.com",
    "youtube.com",
    "youtu.be",
    "vimeo.com",
    "x.com",
    "twitter.com",
    "github.com",
    "medium.com"
  ];
  if (block.some((d) => host === d || host.endsWith("." + d))) return false;

  return true;
}

export function extractCandidateDomains(links: string[]): string[] {
  const domains = new Set<string>();

  for (const url of links) {
    const host = hostFromUrl(url);
    if (!isLikelyCompanyDomain(host)) continue;

    // Vi tar bare domenet, ikke hele url (dedupe)
    domains.add(host);
  }

  return Array.from(domains);
}

export function canonicalWebsiteFromDomain(domain: string) {
  // Vi velger https:// + domain som “website”
  return `https://${domain}`;
}
