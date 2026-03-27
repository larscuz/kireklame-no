import { redirect } from "next/navigation";

import { getCompanyBySlug } from "@/lib/supabase/server";
import { localizePath } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n.server";

export const dynamic = "force-dynamic";

export default async function CompanyContactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getLocale();
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (company?.website) {
    redirect(`/go/${slug}`);
  }

  redirect(localizePath(locale, company ? `/selskap/${slug}` : "/selskaper"));
}
