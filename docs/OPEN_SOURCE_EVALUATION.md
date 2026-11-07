# RestaurantOS AU — open-source foundation evaluation

**Review date:** 7 November 2026  
**Scope note:** the supplied task file ends mid-bullet in section 12 (“W…”). This review covers the legible requirements only.

## Decision

**Primary foundation: [NodeDR OrderRestro](https://github.com/Raktim94/nodedr-restaurant-pos), subject to a full source checkout, dependency/security review and a successful local deployment before production use.** Its published stack is NestJS, Next.js, TypeScript, PostgreSQL, Prisma, Socket.IO and Docker Compose. Its declared feature set maps most closely to restaurant POS, tables/QR, KDS, recipe inventory and purchasing among the candidates. It is a better fit to the preferred stack than POS2 and a more restaurant-specific starting point than ERPNext/URY.

The repository is AGPL-3.0-only. Commercial operation is permitted, but modified network-accessible versions must provide their corresponding source under AGPL to their users; the repository NOTICE also requires retaining attribution and marking modified files with change dates. This works for an internally operated restaurant that can publish its modifications to users, and for an AGPL commercial product. It does **not** suit a future closed-source/proprietary derivative without a separate license from the rights holder. Confirm this business constraint before distributing or offering the modified service. No third-party code from another candidate is combined here.

The pinned NodeDR source archive was retrieved from the current `master` ref and imported into this output tree. A Git clone was not completed, so the source snapshot does not include upstream `.git` history. Candidate B, C and ERPNext were not imported. NodeDR was installed and checked locally: typecheck, full unit tests and production build passed. The full application could not be started because Docker Compose and PostgreSQL are absent here; the frontend login route did return HTTP 200, while the proxied API health check failed because the backend/database were unavailable. Do not treat upstream marketing/roadmap statuses as an independent acceptance test.

## Scoring

Scores are 1 (poor) to 5 (strong); weighted total is normalized to 100. The rubric is the task’s 30/20/15/15/10/10 split. Evidence is public repository material available on review date, not an executed code audit.

| Candidate | Functionality 30% | Code/testability 20% | Deploy/maintain 15% | Customization 15% | Security/reliability 10% | License 10% | Total / 100 |
|---|---:|---:|---:|---:|---:|---:|---:|
| NodeDR OrderRestro | 4 | 3 | 4 | 4 | 2 | 2 | **68** |
| satisfecho/pos (POS2) | 3 | 3 | 4 | 3 | 2 | 2 | **59** |
| URY | 3 | 2 | 2 | 2 | 2 | 2 | **46** |
| ERPNext (reference) | 2 | 4 | 4 | 2 | 3 | 2 | **56** |

License score is low for all candidates because the brief anticipates future commercialization and no proprietary licensing intent/exception was provided. These licenses allow commercial use, but impose copyleft conditions. The scores are directional: no code or vulnerability scan could be completed.

## Candidate findings

### A — NodeDR OrderRestro

- **Availability/revision:** public; `master` HEAD observed as `2e974ab56a1c955d94a8b46708ea0cdc7eaa0546` using `git ls-remote`. No stable release tag was verified; use that observed commit only after independently rechecking it.
- **License/notice:** repository `LICENSE` is AGPL-3.0-only. `NOTICE` identifies Nodedr Infotech Private Limited and Raktim Ranjit, requires attribution, and says modified versions must retain notices and identify changed files/dates. No standalone `NOTICE` is asserted for the other projects where GitHub returned 404.
- **Architecture/deployment:** NestJS API, Next.js App Router UI, PostgreSQL/Prisma, Socket.IO, pnpm/Turborepo, Docker Compose. Docs describe a single-server stack and VPS support; this is suitable in shape for a Sydney VPS and one restaurant.
- **Implemented vs gaps:** repository describes POS, tables/QR, KDS, menu, stock/recipes, purchasing and reports. Its own roadmap marks split billing/payment pending; purchasing returns/price variance/reorder suggestions pending; it records checkout-time stock consumption with negative stock allowed. The roadmap also lists base CI as not done. Australian GST configuration/ATO-grade tax outputs, GST-inclusive/exclusive treatment validation, location checks, QR rotation, detailed audit acceptance, payroll/expenses, and the requested complete workflows need independent verification or implementation. It is India-oriented (UPI/GST presets); UPI must not be surfaced as the Australian payment path.
- **Security/maintenance:** active project with a self-audit report and security docs, but project-authored claims are not independent evidence. This review did not enumerate dependency advisories, inspect unresolved issues, or review source. The disclosed checkout behavior allowing stock below zero is not a fit for controlled receiving/stock operations without a deliberate policy decision.
- **Localization estimate:** medium-high: configure AUD, Australia/Sydney and a GST tax regime; remove/disable India defaults; map receipt/tax semantics; implement the missing QR/GPS policies, manual EFTPOS settlement and operations controls; then test with an Australian accountant and actual devices.
- **Local verification:** `pnpm install --frozen-lockfile`, `pnpm typecheck`, `pnpm test`, and `pnpm build` succeeded after security fixes. The login page returned HTTP 200 from Next.js. Full stack was not started: this host has no Docker/Compose or PostgreSQL service, so the proxied API health route failed. The snapshot lacks upstream `.git` history.
- **Dependency audit:** first `pnpm audit --prod` found three moderate vulnerable transitive packages (`@hono/node-server`, `glob`, `minimatch`); patched version overrides were applied and the repeat production audit reported no known vulnerabilities. The full dependency audit then had one remaining low-severity dev-tool issue in `deepmerge` 4.3.1 (no patched version published). It is only reached through Nest CLI/Jest development tooling, not the runtime dependency graph. Recheck the advisory before release.

### B — satisfecho/pos (POS2)

- **Availability/revision:** public; `master` HEAD observed as `df20712ed88eb2456066e07b6476d89ab0521d64` using `git ls-remote`; no verified stable release tag found in this review. Its changelog/roadmap publishes dated shipped work through 2026-09-14.
- **License/notice:** LICENSE is GNU AGPL v3 (or later). GitHub returned 404 for a root NOTICE file.
- **Architecture/deployment:** Angular SPA, FastAPI/SQLModel, PostgreSQL 18, Redis pub/sub, WebSocket bridge and Docker Compose/HAProxy. Strong self-host deployment story but it is a different backend and frontend stack than the preference.
- **Implemented vs gaps:** docs describe table QR menus, shared QR cart/history, staff POS, KDS, reports, manual cash/card-terminal marking, and supplier/provider inventory. Roadmap calls out incomplete order batch/audit/item-replacement work and a stricter pay-before-continue flow as planned. Not established from the cited evidence: ingredient recipe depletion, append-only inventory ledger, controlled procurement receiving, idempotent settlement, table-session privacy hardening, QR-token rotation, GPS policy or Australian tax fit.
- **Security/maintenance:** active, substantial commit history and extensive feature documentation. No independent security audit or resolved/unresolved vulnerability triage performed; public issue count alone is not a vulnerability assessment.
- **Localization estimate:** high: replace/disable hosted payment providers for the initial brief, formalize manual EFTPOS/cash, implement the ingredient/procurement model, and validate Australian GST/receipts and tax reporting.
- **Local start:** not attempted; no source checkout was obtained in this environment.

### C — ury-erp/ury

- **Availability/revision:** public; `version-2` HEAD observed as `79215b29d2161675344c29810ebb8b6fe710f9b6` using `git ls-remote`. Public releases page has `v3.0.0-beta.1`; the README warns the product is in active development and backward compatibility is not guaranteed. Stable release status is not established.
- **License/notice:** root LICENSE is AGPL-3.0; README states URY is built on ERPNext. No root NOTICE was found through GitHub (404). Audit the bundled ERPNext/Frappe and Python/JS dependencies and their notices before redistribution.
- **Architecture/deployment:** restaurant-focused app built on ERPNext/Frappe, with setup docs for ERPNext. It inherits ERPNext’s Python/JavaScript and MariaDB-oriented ecosystem, rather than the requested PostgreSQL preference. It is not a greenfield modular monolith to transplant into the preferred stack.
- **Implemented vs gaps:** its README advertises dine-in/takeaway/delivery POS, offline mode, kitchen display, KOT and analytics. Release notes show continuing beta work. Australian table QR and the full procurement/recipe stock ledger requirements are not proven by the reviewed material.
- **Security/maintenance:** recent activity and many pull requests are visible, but the project itself warns about compatibility changes. No local install or code-level security review completed.
- **Localization estimate:** high: ERPNext/Frappe deployment and operational model, restaurant-specific workflows, Australian GST, QR ordering, and the brief’s audit/inventory controls all require validation/customization.
- **Local start:** not attempted; no source checkout was obtained in this environment.

### ERP reference — frappe/erpnext

- **Availability/revision:** public; `develop` HEAD observed as `6a964cff42c9c7b6ff5c955df7bf43a4107c1f1e`. Public releases include v16.52.0 on 21 October 2026. Pin a supported stable series, not `develop`, for any deployment.
- **License/notice:** `license.txt` is GNU GPL v3 (or later). GitHub returned 404 for a root NOTICE file. GPLv3 is commercial-use compatible but software distributed as a combined/derivative work carries source-sharing obligations; it does not have AGPL’s network-use trigger by itself. Get legal review for the exact integration/distribution model.
- **Architecture/deployment:** mature general ERP with extensive accounting, stock, buying and manufacturing capabilities; Python/JavaScript on Frappe, MariaDB-centric operational stack. This is a useful reference for stock and procurement patterns, but not a PostgreSQL restaurant POS base.
- **Implemented vs gaps:** strong general ERP coverage, but restaurant tables/shared QR ordering, kitchen tickets and no-account customer workflow require a restaurant layer. Adapting it for the full restaurant UX is material work.
- **Security/maintenance:** active releases and a large project are positive maintenance signals, not proof of safe configuration. The public page showed a large open issue backlog; no issue-by-issue security classification or dependency audit was possible.
- **Localization estimate:** medium-high for tax/accounting (subject to AU localization status verification), high for table/KDS/QR restaurant flow and the requested interaction model.
- **Local start:** not attempted; no source checkout was obtained in this environment.

## Acceptance gates before production

1. Re-fetch and pin the selected commit; preserve upstream LICENSE, NOTICE, trademarks and file-level change notices. Publish the modified source to users of the network service as required by AGPL.
2. Build from a clean checkout using the upstream’s documented path. Run its existing lint/type-check/build/test suites and exercise signup, staff auth, QR session isolation, order submit/retry, kitchen recovery, payment idempotency, receiving deduplication and stock reversal.
3. Generate an SBOM and scan dependencies, images, secrets, Docker permissions and auth/session boundaries. Review upstream security findings and every open issue labeled security.
4. Implement Australian GST/AUD/Australia-Sydney configuration and validate receipts/reporting with an Australian tax professional. GPS must remain a risk signal only.
5. Do not call the resulting system production-ready until backups/restore, access controls, audit trails, concurrency, recovery, and end-of-day reconciliation are demonstrated against the actual restaurant workflow.

## Sources

- [NodeDR README and feature/stack/licensing claims](https://github.com/Raktim94/nodedr-restaurant-pos), [LICENSE](https://github.com/Raktim94/nodedr-restaurant-pos/blob/master/LICENSE), [NOTICE](https://github.com/Raktim94/nodedr-restaurant-pos/blob/master/NOTICE), [ROADMAP](https://github.com/Raktim94/nodedr-restaurant-pos/blob/master/ROADMAP.md)
- [POS2 README and architecture](https://github.com/satisfecho/pos), [LICENSE](https://github.com/satisfecho/pos/blob/master/LICENSE), [ROADMAP](https://github.com/satisfecho/pos/blob/master/ROADMAP.md)
- [URY README](https://github.com/ury-erp/ury/blob/version-2/README.md), [LICENSE](https://github.com/ury-erp/ury/blob/version-2/LICENSE), [releases](https://github.com/ury-erp/ury/releases)
- [ERPNext repository](https://github.com/frappe/erpnext), [license.txt](https://github.com/frappe/erpnext/blob/develop/license.txt), [releases](https://github.com/frappe/erpnext/releases)
