import type { Metadata } from "next";
import Link from "next/link";
import { DocPage, DocSection } from "@/components/marketing/doc-page";

export const metadata: Metadata = {
  title: "Documentation — RestaurantOS AU",
  description: "API, accessibility and Australian setup notes for RestaurantOS AU.",
};

const docs = [
  {
    href: "/docs/api",
    title: "API & MCP",
    description: "Connect an AI client via MCP or use this self-hosted instance as a backend for your website.",
  },
  {
    href: "/docs/accessibility",
    title: "Accessibility",
    description: "Keyboard, screen-reader and reduced-motion information.",
  },
  {
    href: "/docs/australia",
    title: "Australian setup",
    description: "Sydney defaults, CSV imports, current implementation limits and operator checks.",
  },
];

export default function DocsIndexPage() {
  return (
    <DocPage title="Documentation" updated="30 September 2026">
      <DocSection heading="Guides">
        <div className="flex flex-col divide-y divide-border/60 rounded-xl border border-border/60">
          {docs.map((doc) => (
            <Link
              key={doc.href}
              href={doc.href}
              className="flex flex-col gap-1 p-4 transition-colors hover:bg-secondary"
            >
              <span className="text-sm font-medium text-foreground">{doc.title}</span>
              <span className="text-sm text-muted-foreground">{doc.description}</span>
            </Link>
          ))}
        </div>
      </DocSection>

      <DocSection heading="Full setup & architecture docs">
        <p>
          Installation, environment variables, and the upstream architecture reference live in the{" "}
          <a
            href="https://github.com/Raktim94/nodedr-restaurant-pos"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4"
          >
            NodeDR upstream source repository
          </a>
          &rsquo;s README and docs folder.
        </p>
      </DocSection>
    </DocPage>
  );
}
