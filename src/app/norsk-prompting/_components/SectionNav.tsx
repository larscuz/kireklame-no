import Link from "next/link";

const links = [
  { href: "/norsk-prompting/prompt-utvider", label: "Prompt-utvider" },
  { href: "/norsk-prompting/regler", label: "Regler" },
  { href: "/norsk-prompting/ordforrad", label: "Ordforråd" },
  { href: "/norsk-prompting/maler", label: "Maler" },
  { href: "/norsk-prompting/eksempler", label: "Eksempler" },
  { href: "/norsk-prompting/changelog", label: "Endringslogg" },
];

type Props = {
  currentPath: string;
};

export default function SectionNav({ currentPath }: Props) {
  return (
    <nav className="np-nav overflow-x-auto rounded-2xl border border-[rgb(var(--border))] p-2 shadow-[0_16px_36px_rgba(2,6,23,0.3)]">
      <ul className="flex min-w-max gap-2">
        {links.map((link, index) => {
          const active = currentPath === link.href || (link.href !== "/norsk-prompting" && currentPath.startsWith(link.href));

          return (
            <li key={link.href} className="np-nav-item">
              <Link
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "border border-zinc-300/35 bg-zinc-300/10 font-semibold text-zinc-100 shadow-[inset_0_0_0_1px_rgba(212,212,216,0.25)]"
                    : "border border-transparent text-[rgb(var(--fg))] hover:border-[rgb(var(--border))] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                <span
                  className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full border px-1 text-[10px] font-semibold ${
                    active
                      ? "border-zinc-300/35 bg-zinc-300/14 text-zinc-100"
                      : "border-[rgb(var(--border))] text-[rgb(var(--muted))]"
                  }`}
                >
                  {index + 1}
                </span>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
