"use client";

import { usePathname, useSearchParams } from "next/navigation";

type Props = {
  className?: string;
  onClick?: () => void;
};

function stripEnPrefix(pathname: string) {
  const stripped = pathname.replace(/^\/en(\/|$)/, "/");
  return stripped === "" ? "/" : stripped;
}

export default function LanguageSwitcher({ className, onClick }: Props) {
  const pathname = usePathname() || "/";
  const searchParams = useSearchParams();
  const qs = searchParams.toString();

  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  const targetPath = isEn
    ? stripEnPrefix(pathname)
    : pathname === "/"
      ? "/en"
      : `/en${pathname}`;

  const href = qs ? `${targetPath}?${qs}` : targetPath;
  const label = isEn ? "Norsk" : "English";
  const title = isEn ? "Bytt til norsk" : "Switch to English";

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    if (typeof document !== "undefined") {
      document.cookie = `lang=${isEn ? "no" : "en"}; path=/`;
    }
    onClick?.();
    if (typeof window !== "undefined") {
      window.location.href = href;
    }
  }

  return (
    <a
      href={href}
      className={className}
      title={title}
      aria-label={title}
      onClick={handleClick}
    >
      <span className="inline-flex items-center gap-2">
        <span aria-hidden="true" className="text-base leading-none">
          🌍
        </span>
        <span>{label}</span>
      </span>
    </a>
  );
}
