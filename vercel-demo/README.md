# RestaurantOS AU demo

This isolated Next.js project is the public, front-end-only demonstration at https://vercel-demo-peach-six.vercel.app.

The manager view has a per-table QR dialog. Its QR opens `/table/NN`, a guest menu with add-to-order, kitchen note, submit, waiter-request and bill-request interactions. Demo state is stored in local storage and shared between tabs on the same browser origin.

The tables, menu, stock, and sales are fictional examples. Orders submitted from a different device cannot sync to the manager screen because this demo has no API or shared database. It has no PostgreSQL connection, real checkout or real payment processing. QR URLs use visible table numbers and are not suitable for production.

Run locally with `pnpm install`, `pnpm dev`; verify a production build with `pnpm build`.

The Vercel project uses `vercel-demo/` as its monorepo root and deploys from the `main` branch of the private GitHub repository. See [`../docs/VERCEL_DEMO.md`](../docs/VERCEL_DEMO.md) for scope and the full ERP's current limitations.
