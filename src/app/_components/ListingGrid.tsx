import { CompanyCardModel } from "@/lib/types";
import CompanyCard from "./CompanyCard";
import { getLocale } from "@/lib/i18n.server";
import AdSlot from "./AdSlot";
import type { SponsorAd } from "@/lib/ads";

export default async function ListingGrid({
  companies,
  gridBannerAd,
  gridBannerAd2,
  gridBannerAd3,
}: {
  companies: CompanyCardModel[];
  gridBannerAd?: SponsorAd | null;
  gridBannerAd2?: SponsorAd | null;
  gridBannerAd3?: SponsorAd | null;
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

  // On desktop (3 columns), place a full-width banner between row 2 and row 3.
  const bannerInsertAfterCompanyIndex = 5;
  const shouldInsertGridBanner =
    Boolean(gridBannerAd) && companies.length > bannerInsertAfterCompanyIndex;

  // Second full-width grid banner between row 4 and row 5.
  // Keep one banner per two company rows.
  const banner2InsertAfterCompanyIndex = 11;
  const shouldInsertGridBanner2 =
    Boolean(gridBannerAd2) && companies.length >= banner2InsertAfterCompanyIndex + 2;

  // Third full-width grid banner between row 6 and row 7.
  const banner3InsertAfterCompanyIndex = 17;
  const shouldInsertGridBanner3 =
    Boolean(gridBannerAd3) && companies.length >= banner3InsertAfterCompanyIndex + 2;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((c, index) => (
        <div key={c.id} className="contents">
          <CompanyCard company={c} />
          {shouldInsertGridBanner && index === bannerInsertAfterCompanyIndex ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <AdSlot
                ad={gridBannerAd ?? null}
                sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                variant="banner"
                locale={locale}
              />
            </div>
          ) : null}
          {shouldInsertGridBanner2 && index === banner2InsertAfterCompanyIndex ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <AdSlot
                ad={gridBannerAd2 ?? null}
                sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                variant="banner"
                locale={locale}
              />
            </div>
          ) : null}
          {shouldInsertGridBanner3 && index === banner3InsertAfterCompanyIndex ? (
            <div className="sm:col-span-2 lg:col-span-3">
              <AdSlot
                ad={gridBannerAd3 ?? null}
                sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                variant="banner"
                locale={locale}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
