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
    <nav className="np-nav overflow-x-auto rounded-2xl border border-[rgb(var(--border))] p-2.5 shadow-[0_16px_36px_rgba(2,6,23,0.34)]">
      <ul className="flex min-w-max gap-2">
        {links.map((link, index) => {
          const active = currentPath === link.href || (link.href !== "/norsk-prompting" && currentPath.startsWith(link.href));

          return (
            <li key={link.href} className="np-nav-item">
              <Link
                href={link.href}
                className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "border border-zinc-300/35 bg-zinc-300/14 font-semibold text-zinc-100 shadow-[0_10px_22px_rgba(2,6,23,0.3)]"
                    : "border border-transparent text-[rgb(var(--fg))]/90 hover:border-zinc-300/35 hover:bg-zinc-300/08 hover:text-zinc-100"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-semibold ${
                    active
                      ? "border-zinc-300/35 bg-zinc-300/14 text-zinc-100"
                      : "border-[rgb(var(--border))] bg-[rgb(var(--bg))]/65 text-[rgb(var(--muted))]"
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
