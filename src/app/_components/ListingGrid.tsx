import { CompanyCardModel } from "@/lib/types";
import CompanyCard from "./CompanyCard";
import { getLocale } from "@/lib/i18n.server";
import AdSlot from "./AdSlot";
import type { SponsorAd } from "@/lib/ads";

export default async function ListingGrid({
  companies,
  inlineAd,
  gridBannerAd,
  gridBannerAd2,
  gridBannerAd3,
}: {
  companies: CompanyCardModel[];
  inlineAd?: SponsorAd | null;
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

  const inlineInsertAt = 3;
  const shouldInsertInline = Boolean(inlineAd) && companies.length > inlineInsertAt;

  // On desktop (3 columns), keep inline card at slot #4, then place a full-width
  // banner between row 2 and row 3.
  const bannerInsertAfterCompanyIndex = shouldInsertInline ? 4 : 5;
  const shouldInsertGridBanner =
    Boolean(gridBannerAd) && companies.length > bannerInsertAfterCompanyIndex;

  // Second full-width grid banner between row 4 and row 5.
  // Keep one banner per two company rows.
  const banner2InsertAfterCompanyIndex = shouldInsertInline ? 10 : 11;
  const shouldInsertGridBanner2 =
    Boolean(gridBannerAd2) && companies.length >= banner2InsertAfterCompanyIndex + 2;

  // Third full-width grid banner between row 6 and row 7.
  const banner3InsertAfterCompanyIndex = shouldInsertInline ? 16 : 17;
  const shouldInsertGridBanner3 =
    Boolean(gridBannerAd3) && companies.length >= banner3InsertAfterCompanyIndex + 2;

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {companies.map((c, index) => (
        <div key={c.id} className="contents">
          <CompanyCard company={c} />
          {shouldInsertInline && index === inlineInsertAt - 1 ? (
            <>
              <div className="sm:hidden">
                <AdSlot
                  ad={inlineAd ?? null}
                  sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                  openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                  variant="banner"
                  compact
                  locale={locale}
                />
              </div>
              <div className="hidden sm:block">
                <AdSlot
                  ad={inlineAd ?? null}
                  sponsorLabel={locale === "en" ? "Sponsored" : "Sponset"}
                  openLinkFallback={locale === "en" ? "Open link" : "Åpne lenke"}
                  variant="card"
                  locale={locale}
                />
              </div>
            </>
          ) : null}
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
