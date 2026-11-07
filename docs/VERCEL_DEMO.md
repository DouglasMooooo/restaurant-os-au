# Vercel interactive demo

Live preview: https://vercel-demo-peach-six.vercel.app

Vercel project: `vercel-demo` (Douglas Mo's Vercel account). The app source is isolated in `vercel-demo/` and was deployed from the Vercel CLI on 7 November 2026.

## What it demonstrates

- A responsive 30-table floor view with selectable tables and sample balances.
- A per-table QR code and customer ordering page with menu categories, kitchen notes, order submission, order history, waiter calls and bill requests.
- A browsable sample menu; adding dishes and sending an order updates local browser storage and refreshes open tabs on the same browser origin.
- Sample inventory and weekly revenue views.
- AUD and Sydney restaurant context.

## What it does not do

This is a front-end-only demonstration. It contains fictional sample values, stores state in browser local storage and uses no PostgreSQL database or ERP API. QR links open a guest ordering page, but orders synchronize only between tabs in the same browser; a scan on another device cannot send orders to the manager screen. Order, kitchen and payment actions are simulated. Demo QR links use visible table numbers, not the secure, rotatable tokens required by the full system. Do not enter real staff, customer, supplier or financial data. It is not suitable for restaurant operations.

The primary ERP source remains the NestJS/Next.js/PostgreSQL project described in [AU_IMPLEMENTATION_STATUS.md](../AU_IMPLEMENTATION_STATUS.md). Vercel hosts this isolated demo rather than the Compose-based ERP services.

## Redeploy

Install pnpm and run `pnpm install` from this directory, then `pnpm build`. To deploy the production domain, run `pnpm dlx vercel --prod` from `vercel-demo/` while authenticated to the Vercel account that owns the `vercel-demo` project.
