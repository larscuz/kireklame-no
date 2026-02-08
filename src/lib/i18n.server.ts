import { cookies, headers } from "next/headers";
import { getLocaleFromHeaders, type Locale } from "./i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const cookieLocale = cookieStore.get("lang")?.value?.toLowerCase() ?? "";
  if (cookieLocale.startsWith("en")) return "en";
  if (cookieLocale.startsWith("no")) return "no";
  return getLocaleFromHeaders(headerStore);
}
