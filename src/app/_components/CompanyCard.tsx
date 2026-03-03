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
    <div className="group spatial-card rounded-[2rem] overflow-hidden">
      <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="block">
        <div className="relative aspect-[16/11] overflow-hidden rounded-t-[2rem] m-2">
          <CoverImg
            src={cover}
            alt={company.name}
            className="h-full w-full object-cover object-center group-hover:scale-[1.05] transition duration-700 ease-out"
          />

          <div className="absolute inset-x-3 bottom-3 flex flex-wrap gap-2 z-10 glass-pill px-4 py-2 w-max text-white shadow-lg border-white/20">
            <span className="font-semibold text-xs uppercase tracking-widest">
              AI: {aiLevelLabel(company.ai_level, locale)}
            </span>
            <span className="opacity-50">|</span>
            <span className="font-semibold text-xs uppercase tracking-widest">
              {typeLabel(company.company_type, locale)}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent mix-blend-multiply" />
        </div>

        <div className="p-6 md:p-8 pt-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-2xl font-bold tracking-tight text-white mb-2">{company.name}</div>
              <div className="text-sm font-medium text-white/50 flex items-center gap-2">
                {company.location?.name && <span>{company.location.name}</span>}
                {company.location?.name && <span className="w-1 h-1 rounded-full bg-white/20" />}
                <span>{priceLevelLabel(company.price_level, locale)}</span>
              </div>
            </div>
          </div>

          {company.short_description && (
            <p className="mt-4 text-[15px] leading-relaxed text-white/70 line-clamp-2 font-medium">
              {company.short_description}
            </p>
          )}

          {company.tags?.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {company.tags.slice(0, 3).map((t) => (
                <span key={t.slug} className="text-[11px] font-bold uppercase tracking-wider text-white/40 border border-white/10 rounded-full px-3 py-1">
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
