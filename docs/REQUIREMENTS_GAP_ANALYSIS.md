# Requirements gap analysis

Review date: 7 November 2026. This checks the readable part of the supplied brief against the source code and project status. It is not a production acceptance sign-off. The brief ends in section 12 at “Utilities / W…”, so later requirements could not be reviewed.

## Present in the foundation

- TypeScript modular monolith, Next.js, NestJS, PostgreSQL/Prisma, Docker Compose and realtime gateway.
- Menu catalogue, categories, modifiers, CSV import, tax snapshots, guest QR menu, idempotent order submission, waiter/bill requests and table QR rotation.
- Staff POS orders, table/order lifecycle, discounts, void reasons, mixed payment settlement, manual cash/EFTPOS recording, refunds and receipt output.
- Persisted kitchen orders/tickets, kitchen screen and realtime notifications.
- Suppliers, purchase requests/orders, goods receipts, supplier invoices/payments, stock batches, append-only stock movement ledger, waste and weighted-average costing.
- Recipes and stock deduction at checkout with duplicate-deduction protection; sales-driven stock return is recorded separately from monetary refunds.
- Reports, CSV export, accounting/expenses, role-based access control and audit log.

These modules exist in the upstream foundation, but their presence alone does not prove every requested workflow is accepted for this restaurant.

## Work still required before production use

| Area | Gap / acceptance needed |
|---|---|
| Dining session | No first-class dining-session record ties the table visit, multiple guests, add-on rounds, requests, bill and close together. Current QR flow reuses an open order, which is not the same as preserving session history. |
| QR location checks | No configured restaurant coordinates/radius check at submit, staff verification fallback, or explicit record that location is only a risk signal. |
| Recipe costing | Recipe rows lack effective-dated/versioned history; historical cost and theoretical consumption reporting need verification. |
| Units | Ingredient has one stock/recipe unit. Purchase-to-stock conversions (e.g. carton to kg) are explicitly deferred; “each/pack/carton” mappings and dimensional conversions need implementation. |
| Stocktake | Adjustments exist, but a count-sheet stocktake workflow, approval/reconciliation and auditable variance report need acceptance. |
| Inventory events | Confirm depletion timing against “prepared/fulfilled”; test cancellations, prepared waste, returns, refunds and concurrent checkout against a real database. |
| Procurement | Exercise approval, partial receipt, invoice matching/discrepancy, returns and duplicate receipt prevention end to end. |
| Table billing | Accept table transfer, merge/split, discounts, partial/mixed tender, checkout races and end-of-day reconciliation in the restaurant workflow. |
| Analytics | Confirm all requested KPIs and definitions exist and reconcile to the canonical payment/stock/expense ledgers; distinguish estimated recipe COGS from actual costs and operating expenses. |
| AU operations | Confirm GST classification per actual menu, receipts, ABN/business details, GST reports, Sydney day boundaries, backups, restore, HTTPS, EFTPOS/printer hardware and staff permissions. |
| Deployment | Docker/PostgreSQL were unavailable in the build environment; a clean Compose install, migrations, database backup/restore and health checks remain unverified. |
| Original brief | Remaining section 12 operating expense categories and any following sections are not available because the pasted file is truncated. |

## Release gate

Treat this as a development base only. Do not load real menus, staff details or live financial records until the database-backed workflows above pass acceptance on a clean deployment and the restaurant supplies its actual menu, supplier catalogue, opening stock, prices, business details and address. AGPL-3.0-only obligations remain in force.
