# RestaurantOS AU demo

This isolated Next.js project is the public, front-end-only demonstration at https://vercel-demo-peach-six.vercel.app.

The manager view has a per-table QR dialog. Its QR opens `/table/NN`, a guest menu with add-to-order, kitchen note, submit, waiter-request and bill-request interactions. Demo state is stored in local storage and shared between tabs on the same browser origin.

The customer QR menu uses a 92-item bilingual menu snapshot and AUD prices supplied for demonstration (captured 8 November 2026). Menu data is static and should be confirmed before real service. The demo UI intentionally omits the restaurant name and street address. Table occupancy, stock, and sales remain illustrative sample data. Orders submitted from a different device cannot sync to the manager screen because this demo has no API or shared database. It has no PostgreSQL connection, real checkout or real payment processing. QR URLs use visible table numbers and are not suitable for production.

Run locally with `pnpm install`, `pnpm dev`; verify a production build with `pnpm build`.

The Vercel project uses `vercel-demo/` as its monorepo root and deploys from the `main` branch of the public GitHub repository. See [`../docs/VERCEL_DEMO.md`](../docs/VERCEL_DEMO.md) for scope and the full ERP's current limitations.
