import Link from "next/link";

const links = [
  { href: "/norsk-prompting", label: "Oversikt" },
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
    <nav className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--card))] p-2">
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => {
          const active = currentPath === link.href || (link.href !== "/norsk-prompting" && currentPath.startsWith(link.href));

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`inline-flex rounded-xl px-3 py-2 text-sm transition ${
                  active
                    ? "border border-cyan-300/40 bg-cyan-300/15 font-semibold text-cyan-100"
                    : "border border-transparent text-[rgb(var(--fg))] hover:border-[rgb(var(--border))] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
