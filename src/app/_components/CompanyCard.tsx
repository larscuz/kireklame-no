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
    <div className="liquid-hover-swell group relative overflow-visible flex flex-col mb-12">
      <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="flex flex-col h-full block">

        {/* Swelling Liquid Image */}
        <div className="relative w-full aspect-video md:aspect-[21/9] overflow-hidden rounded-[2rem] bg-black/40 shadow-2xl">
          <CoverImg
            src={cover}
            alt={company.name}
            className="h-full w-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
          />
          {company.is_verified && (
            <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse block" />
            </div>
          )}
        </div>

        {/* Minimal Typography */}
        <div className="mt-6 px-2">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white/80 group-hover:text-white transition-colors">
            {company.name}
          </h2>

          <div className="flex items-center gap-3 mt-4 text-sm font-medium text-white/40 uppercase tracking-widest">
            <span>{typeLabel(company.company_type, locale)}</span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span>AI {aiLevelLabel(company.ai_level, locale)}</span>
            {company.location?.name && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{company.location.name}</span>
              </>
            )}
          </div>
        </div>

      </Link>
    </div>
  );
}
