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
    <div className="glass-panel group relative overflow-hidden flex flex-col">
      <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="flex flex-col h-full block">

        {/* Spatial Cover Image */}
        <div className="relative w-full aspect-[16/10] overflow-hidden rounded-t-[2rem] p-2 bg-black/20 shrink-0">
          <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
            <CoverImg
              src={cover}
              alt={company.name}
              className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 z-10">
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg rounded-full px-3 py-1 text-xs font-medium">
              AI: {aiLevelLabel(company.ai_level, locale)}
            </span>
            <span className="bg-white/10 backdrop-blur-md border border-white/20 text-white/90 shadow-lg rounded-full px-3 py-1 text-xs font-medium">
              {typeLabel(company.company_type, locale)}
            </span>
            {company.is_verified && (
              <span className="bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-blue-100 shadow-lg rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                {locale === "en" ? "Verified" : "Verifisert"}
              </span>
            )}
          </div>
        </div>

        {/* Glass Typography Area */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-white mb-2 group-hover:text-blue-100 transition-colors">
              {company.name}
            </h2>

            <div className="text-sm text-white/60 mb-4 flex items-center gap-2">
              <span>{company.location?.name || "—"}</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{priceLevelLabel(company.price_level, locale)}</span>
            </div>

            {company.short_description && (
              <p className="text-base text-white/80 leading-relaxed font-light mb-6 line-clamp-3">
                {company.short_description}
              </p>
            )}
          </div>

          {company.tags?.length ? (
            <div className="flex flex-wrap gap-1.5">
              {company.tags.slice(0, 3).map((t) => (
                <span key={t.slug} className="text-xs text-white/50 bg-white/5 px-2.5 py-1 rounded-lg">
                  {t.name}
                </span>
              ))}
            </div>
          ) : null}
        </div>

      </Link>
    </div>
  );
}
