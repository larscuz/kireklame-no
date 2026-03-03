import Link from "next/link";
import Badge from "./Badge";
import CoverImg from "./CoverImg";
import { CompanyCardModel } from "@/lib/types";
import { aiLevelLabel, priceLevelLabel, typeLabel } from "@/lib/utils";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export default async function CompanyCard({ company, index }: { company: CompanyCardModel; index: number }) {
  const locale = await getLocale();
  const cover = company.cover_image || "/covers/cover-1.jpg";

  return (
    <div
      className="liquid-card group flex flex-col items-center text-center p-8"
      style={{
        borderRadius: index % 2 === 0 ? '40% 60% 70% 30% / 40% 50% 60% 50%' : '60% 40% 30% 70% / 60% 30% 70% 40%'
      }}
    >
      <Link href={localizePath(locale, `/selskap/${company.slug}`)} className="block w-full">
        <div className="relative w-full aspect-square liquid-blob mb-6 bg-black/50 overflow-hidden shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
          <CoverImg
            src={cover}
            alt={company.name}
            className="h-full w-full object-cover object-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition duration-1000 ease-out mix-blend-luminosity hover:mix-blend-normal"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        <div>
          <h2 className="text-3xl font-extrabold tracking-tighter text-white mb-2" style={{ textShadow: '0 0 20px rgba(255,255,255,0.4), 0 0 40px rgba(100,200,255,0.2)' }}>
            {company.name}
          </h2>

          <div className="text-sm font-bold uppercase tracking-widest text-[#f0f5ff]/70 flex flex-wrap justify-center items-center gap-3 mb-4">
            <span style={{ textShadow: '0 0 10px rgba(100,255,100,0.5)' }}>AI: {aiLevelLabel(company.ai_level, locale)}</span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span style={{ textShadow: '0 0 10px rgba(255,100,100,0.5)' }}>{typeLabel(company.company_type, locale)}</span>
            {company.location?.name && (
              <>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span>{company.location.name}</span>
              </>
            )}
          </div>

          {company.short_description && (
            <p className="text-[14px] leading-relaxed text-white/60 mx-auto max-w-sm line-clamp-3">
              {company.short_description}
            </p>
          )}

          {company.tags?.length ? (
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {company.tags.slice(0, 3).map((t) => (
                <span key={t.slug} className="text-[10px] font-bold uppercase tracking-widest text-white/30">
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
