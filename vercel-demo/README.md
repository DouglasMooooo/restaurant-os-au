# RestaurantOS AU demo

This isolated Next.js project is the public, front-end-only demonstration at https://vercel-demo-peach-six.vercel.app.

The tables, menu, stock, and sales are fictional examples. Actions only update React state in the current tab. There is no API, persistent storage, PostgreSQL connection, real checkout, or real payment processing.

Run locally with `pnpm install`, `pnpm dev`; verify a production build with `pnpm build`.

The Vercel project uses `vercel-demo/` as its monorepo root and deploys from the `main` branch of the private GitHub repository. See [`../docs/VERCEL_DEMO.md`](../docs/VERCEL_DEMO.md) for scope and the full ERP's current limitations.
