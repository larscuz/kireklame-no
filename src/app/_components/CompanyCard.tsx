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
    <div className="lens-card group rounded-2xl flex flex-col overflow-hidden hover:-translate-y-1">
      <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="block flex-1 flex flex-col">
        <div className="relative aspect-[16/11] overflow-hidden">
          <CoverImg
            src={cover}
            alt={company.name}
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            <span className="bg-black/40 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white border border-white/10 px-3 py-1 rounded-full drop-shadow-md">
              <span className="opacity-60 mr-1">AI:</span> {aiLevelLabel(company.ai_level, locale)}
            </span>
            <span className="bg-black/40 backdrop-blur-md text-[11px] font-bold uppercase tracking-wider text-white border border-white/10 px-3 py-1 rounded-full drop-shadow-md">
              {typeLabel(company.company_type, locale)}
            </span>
          </div>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">{company.name}</h2>
              <div className="mt-1 text-sm font-medium text-white/50 flex items-center gap-2">
                {company.location?.name && <span>{company.location.name}</span>}
                {company.location?.name && <span className="w-1 h-1 rounded-full bg-white/20" />}
                <span>{priceLevelLabel(company.price_level, locale)}</span>
              </div>
            </div>
          </div>

          {company.short_description && (
            <p className="text-[15px] leading-relaxed text-white/70 line-clamp-2 mt-1 mb-auto">
              {company.short_description}
            </p>
          )}

          {company.tags?.length ? (
            <div className="mt-5 flex flex-wrap gap-2 pt-4 border-t border-white/10">
              {company.tags.slice(0, 3).map((t) => (
                <span key={t.slug} className="text-[11px] font-semibold uppercase tracking-wider text-white/50 border border-white/10 rounded-full px-3 py-1">
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
