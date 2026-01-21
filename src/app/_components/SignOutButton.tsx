"use client";

import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function SignOutButton({ className, children }: Props) {
  const router = useRouter();

  async function onSignOut() {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    await supabase.auth.signOut();
    router.push("/auth");
    router.refresh();
  }

  return (
    <button type="button" onClick={onSignOut} className={className}>
      {children ?? "Logg ut"}
    </button>
  );
}
