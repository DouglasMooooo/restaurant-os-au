import Link from "next/link";
import { Logo } from "@/components/layout/logo";

const columns = [
  {
    title: "Product",
    links: [
      { href: "#features", label: "Features" },
      { href: "#security", label: "Security" },
      { href: "#get-started", label: "Get started" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "https://github.com/Raktim94/nodedr-restaurant-pos", label: "Upstream source" },
      { href: "/docs/australia", label: "Australian setup" },
      { href: "/docs/api", label: "API & MCP" },
      { href: "/docs/accessibility", label: "Accessibility statement" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Sign in" },
      { href: "/signup", label: "Create account" },
    ],
  },
];

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 px-4 py-14 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <Logo size={28} />
              <span className="text-sm font-semibold text-foreground">RestaurantOS AU</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              An Australian adaptation of NodeDR OrderRestro. Independently maintained; not an official NodeDR release.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {col.title}
              </h3>
              <ul className="mt-3 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            Upstream copyright belongs to Nodedr Infotech Private Limited and Raktim Ranjit. AGPL-3.0-only.
          </p>
          <p className="text-xs text-muted-foreground">Australian configuration; deployment review pending.</p>
        </div>
      </div>
    </footer>
  );
}
