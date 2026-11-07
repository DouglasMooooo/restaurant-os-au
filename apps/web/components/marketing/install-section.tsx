import Link from "next/link";
import { Reveal, RevealGroup, RevealItem } from "@/components/marketing/reveal";

export function InstallSection() {
  return (
    <section id="get-started" className="mx-auto max-w-6xl px-4 py-24 sm:px-6">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Start with a local demonstration
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Run this source tree with Docker Compose. Demo data is clearly labelled and is not a real menu or opening stock count.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mx-auto mt-8 max-w-xl">
        <pre className="overflow-x-auto rounded-xl border border-border/60 bg-card p-4 text-sm text-foreground">
          <code>./install.sh --demo</code>
        </pre>
      </Reveal>

      <RevealGroup className="mx-auto mt-12 grid max-w-4xl gap-5 sm:grid-cols-2">
        <RevealItem className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="text-[15px] font-semibold text-foreground">Create an empty restaurant</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Run <code>./install.sh</code> without the demo flag, then create the owner account at <code>/signup</code>.
          </p>
        </RevealItem>
        <RevealItem className="rounded-2xl border border-border/60 bg-card p-6">
          <h3 className="text-[15px] font-semibold text-foreground">Configure Sydney defaults</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            New installs use AUD, Australia/Sydney and the AU GST preset. Confirm each menu item&rsquo;s tax treatment with a qualified adviser.
          </p>
          <Link href="/docs/australia" className="mt-4 inline-block text-sm font-medium text-primary underline underline-offset-4">
            Australian setup and import guide
          </Link>
        </RevealItem>
      </RevealGroup>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-muted-foreground">
        Based on NodeDR OrderRestro under AGPL-3.0-only. This is an independent adaptation, not an official NodeDR release. See the source and notices before redistributing.
      </p>
    </section>
  );
}
