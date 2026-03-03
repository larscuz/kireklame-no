import Link from "next/link";
import Badge from "./Badge";
import CoverImg from "./CoverImg";
import { CompanyCardModel } from "@/lib/types";
import { aiLevelLabel, priceLevelLabel, typeLabel } from "@/lib/utils";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export default async function CompanyCard({ company }: { company: CompanyCardModel }) {
  const locale = await getLocale();
  const cover = company.cover_image || "/covers/cover-1.jpg";

  return (
    <div className="block border-b-4 border-[rgb(var(--border))] group pb-12 mb-12 last:border-b-0">
      <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="block">

        {/* Cinematic Cover Cut */}
        <div className="relative w-full aspect-[21/9] lg:aspect-[3/1] overflow-hidden bg-black group-hover:opacity-90 transition-opacity">
          <CoverImg
            src={cover}
            alt={company.name}
            className="h-full w-full object-cover object-center grayscale group-hover:grayscale-0 transition-all duration-700 blur-[2px] group-hover:blur-0 scale-105 group-hover:scale-100"
          />
        </div>

        {/* Editorial Body */}
        <div className="mt-8 flex flex-col md:flex-row gap-8 justify-between items-start">

          <div className="flex-1">
            <div className="flex flex-wrap items-baseline gap-4 mb-2 text-sm font-bold uppercase tracking-widest text-[rgb(var(--np-accent))]">
              <span>{typeLabel(company.company_type, locale)}</span>
              <span className="w-1.5 h-1.5 bg-[rgb(var(--border))] rounded-full" />
              <span>AI {aiLevelLabel(company.ai_level, locale)}</span>
            </div>

            <h2 className="text-5xl lg:text-7xl font-black tracking-tighter uppercase text-[rgb(var(--fg))] mb-6 group-hover:text-[rgb(var(--np-accent))] transition-colors">
              {company.name}
            </h2>

            {company.short_description && (
              <p className="text-lg md:text-xl text-[rgb(var(--muted))] max-w-3xl leading-relaxed font-medium">
                {company.short_description}
              </p>
            )}

            {company.tags?.length ? (
              <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-xs font-bold uppercase tracking-widest text-[rgb(var(--muted))]">
                {company.tags.slice(0, 5).map((t, i) => (
                  <span key={t.slug}>
                    {t.name}
                    {i < Math.min(company.tags!.length, 5) - 1 ? <span className="mx-2 opacity-30">/</span> : null}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <div className="md:w-48 shrink-0 flex flex-col gap-4 text-sm font-semibold uppercase tracking-wider text-[rgb(var(--muted))] border-l-2 border-[rgb(var(--border))] pl-6 my-auto">
            <div>
              <span className="block text-[10px] opacity-50 mb-1">{locale === "en" ? "Location" : "Sted"}</span>
              {company.location?.name || "—"}
            </div>
            <div>
              <span className="block text-[10px] opacity-50 mb-1">{locale === "en" ? "Pricing" : "Pris"}</span>
              {priceLevelLabel(company.price_level, locale)}
            </div>
            {company.is_verified && (
              <div className="text-[rgb(var(--fg))] mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-[rgb(var(--np-accent))] rounded-full animate-pulse" />
                {locale === "en" ? "Verified" : "Verifisert"}
              </div>
            )}
          </div>

        </div>
      </Link>
    </div>
  );
}
