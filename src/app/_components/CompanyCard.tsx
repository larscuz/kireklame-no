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
    <div className="terminal-card block p-6 group mb-8 relative overflow-hidden">
      <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="flex flex-col md:flex-row gap-8">

        {/* Security Footage / Cover */}
        <div className="relative w-full md:w-64 shrink-0 aspect-video md:aspect-square border border-[#00ff00] overflow-hidden bg-black">
          <CoverImg
            src={cover}
            alt={company.name}
            className="h-full w-full object-cover object-center grayscale contrast-125 opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
          />
          <div className="absolute top-2 right-2 text-[8px] bg-black text-[#00ff00] px-1 border border-[#00ff00]">
            CAM_01_REC
          </div>
        </div>

        {/* Console Data */}
        <div className="flex-1 flex flex-col gap-2">

          <h2 className="text-3xl md:text-5xl font-bold uppercase text-[#00ff00] mb-4 group-hover:text-white transition-colors">
            <span className="opacity-50 mr-2">{'>'}</span>{company.name}
            <span className="inline-block w-3 h-6 bg-[#00ff00] animate-pulse ml-2" />
          </h2>

          <div className="flex flex-col gap-1 text-sm uppercase text-[#00ff00]/80">
            <div><span className="opacity-50 w-24 inline-block">[DAT_TYPE] :</span> {typeLabel(company.company_type, locale)}</div>
            <div><span className="opacity-50 w-24 inline-block">[SYS_AI]   :</span> {aiLevelLabel(company.ai_level, locale)}</div>
            <div><span className="opacity-50 w-24 inline-block">[LOC_ID]   :</span> {company.location?.name || "NULL"}</div>
            <div><span className="opacity-50 w-24 inline-block">[VAL_TIER] :</span> {priceLevelLabel(company.price_level, locale)}</div>
            {company.is_verified && (
              <div><span className="opacity-50 w-24 inline-block">[AUTH]     :</span> <span className="text-black bg-[#00ff00] px-1 ml-1 font-bold">VERIFIED_TRUE</span></div>
            )}
          </div>

          {company.short_description && (
            <p className="text-sm text-[#00ff00]/60 mt-4 border-l-2 border-[#00ff00]/30 pl-4 py-1">
              /* {company.short_description} */
            </p>
          )}

          {company.tags?.length ? (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-[#00ff00]/50">
              {company.tags.slice(0, 5).map((t) => (
                <span key={t.slug}>--arg {t.name}</span>
              ))}
            </div>
          ) : null}

        </div>
      </Link>
    </div>
  );
}
