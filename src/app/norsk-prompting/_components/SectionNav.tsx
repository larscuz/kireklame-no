import Link from "next/link";

const links = [
  { href: "/norsk-prompting/prompt-utvider", label: "Prompt-utvider" },
  { href: "/norsk-prompting/marketing-skills/kampanje-assistent", label: "Kampanje-assistent" },
  { href: "/norsk-prompting/algoritmer", label: "Algoritmer" },
  { href: "/norsk-prompting/ordforrad", label: "Ordforråd" },
  { href: "/norsk-prompting/changelog", label: "KI-verktøy" },
];

type Props = {
  currentPath: string;
};

export default function SectionNav({ currentPath }: Props) {
  return (
    <nav className="np-nav rounded-2xl border border-[rgb(var(--border))] p-2.5 shadow-[0_16px_36px_rgba(2,6,23,0.34)]">
      <ul className="flex flex-wrap gap-2">
        {links.map((link, index) => {
          const activePrefix =
            link.href === "/norsk-prompting/marketing-skills/kampanje-assistent"
              ? "/norsk-prompting/marketing-skills"
              : link.href;
          const active =
            currentPath === link.href ||
            (activePrefix !== "/norsk-prompting" && currentPath.startsWith(activePrefix));

          return (
            <li key={link.href} className="np-nav-item">
              <Link
                href={link.href}
                className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition ${
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
