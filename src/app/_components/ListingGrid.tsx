import { CompanyCardModel } from "@/lib/types";
import CompanyCard from "./CompanyCard";
import { getLocale } from "@/lib/i18n.server";
import AdSlot from "./AdSlot";
import type { SponsorAd } from "@/lib/ads";

export default async function ListingGrid({
  companies,
  inlineAd,
}: {
  companies: CompanyCardModel[];
  inlineAd?: SponsorAd | null;
}) {
  const locale = await getLocale();
  if (!companies.length) {
    return (
      <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-8 text-[rgb(var(--muted))] shadow-soft">
        {locale === "en"
          ? "No results. Try adjusting filters or your search."
          : "Ingen treff. Prøv å justere filtre eller søkeord."}
      </div>
    );
  }

  // Place the inline ad between row 2 and row 3 on 3-column grids:
  // after 5 company cards (ad becomes card #6 in the stream).
  const insertAt = 5;
  const shouldInsert = Boolean(inlineAd) && companies.length >= 6;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((c, index) => (
        <div key={c.id} className="contents">
          <CompanyCard company={c} />
          {shouldInsert && index === insertAt - 1 ? (
            <AdSlot
              ad={inlineAd ?? null}
              sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
              openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
              variant="card"
              locale={locale}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
