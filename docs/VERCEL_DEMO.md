# Vercel interactive demo

Live preview: https://vercel-demo-peach-six.vercel.app

Vercel project: `vercel-demo` (Douglas Mo's Vercel account). The app source is isolated in `vercel-demo/` and was deployed from the Vercel CLI on 7 November 2026.

## What it demonstrates

- A responsive 30-table floor view with selectable tables and sample balances.
- A browsable sample menu; adding dishes and sending an order updates the local preview state.
- Sample inventory and weekly revenue views.
- AUD and Sydney restaurant context.

## What it does not do

This is a front-end-only demonstration. It contains fictional sample values, stores no state on a server and uses no PostgreSQL database or ERP API. Order, kitchen and payment buttons only simulate changes in the open browser tab. Do not enter real staff, customer, supplier or financial data. It is not suitable for restaurant operations.

The primary ERP source remains the NestJS/Next.js/PostgreSQL project described in [AU_IMPLEMENTATION_STATUS.md](../AU_IMPLEMENTATION_STATUS.md). Vercel hosts this isolated demo rather than the Compose-based ERP services.

## Redeploy

Install pnpm and run `pnpm install` from this directory, then `pnpm build`. To deploy the production domain, run `pnpm dlx vercel --prod` from `vercel-demo/` while authenticated to the Vercel account that owns the `vercel-demo` project.
