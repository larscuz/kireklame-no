import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {},
      },
    }
  );

  const { data } = await supabase.auth.getUser();
  return data.user;
}

export default async function SubmitPage() {
  const user = await getUser();

  // Legacy route: always use the detailed schema
  if (!user) {
    redirect("/auth?next=/register/company");
  }

  redirect("/register/company");
}
