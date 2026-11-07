# RestaurantOS AU implementation status

## Delivered in this source tree

- Imported the pinned NodeDR OrderRestro source archive as the single foundation; no other candidate code is mixed in. The output snapshot does not contain upstream Git history.
- Australian defaults for new restaurants/branches: AUD, `Australia/Sydney`, country AU, inclusive price mode and GST tax label.
- `AU_GST` selectable preset. The existing per-item tax rate remains authoritative; the preset does not classify an item or claim tax compliance.
- Seeded demonstration tenant is explicitly named as demo data, uses AUD/Sydney settings, and creates 30 tables.
- Existing upstream CSV menu and ingredient importers retained. Menu example shows 10% as an illustrative GST rate; an empty menu template remains available in the app.
- Container names and local image tags are fork-specific. The official upstream image updater is disabled by default, preventing accidental replacement of this fork.
- Upstream license, copyright, notice, trademark guidance and upstream source are retained.
- Applied production dependency overrides for three moderate advisories found in `pnpm audit --prod`; the repeat production audit reported no known vulnerabilities. A full audit still reports one low-severity development-tool `deepmerge` advisory with no patched release.

## Not yet complete or production-verified

This is an adapted upstream application, **not yet a production-ready Sydney ERP**. The readable task asks for substantially more work than can be honestly represented as complete by changing defaults. In particular:

- The user-provided task cuts off mid-list after “Utilities / W…”, so its remaining requirements are unavailable.
- Node 24.22.0 and pnpm 11.25.0 are present, but Docker/Compose and PostgreSQL are absent. `pnpm typecheck`, `pnpm test` (371 backend tests passed, 13 skipped; 59 web tests passed), and `pnpm build` succeeded. The Next.js login page returned HTTP 200; the backend did not start without a working PostgreSQL-backed configuration, so the proxied API health check returned HTTP 500. The full supported Docker Compose path remains unverified here.
- A full dependency audit was run. Three moderate production transitive findings were mitigated by patched overrides; the production audit is clean. The remaining full-tree audit finding is low severity, development-only `deepmerge` 4.3.1 with no patched version published. No backup-restore test, penetration test, Australian accountant review, hardware test, or load/concurrency acceptance test was run.
- Australian GST requires an item-by-item classification. ATO guidance says dine-in food and hot takeaway food are taxable where the taxable-supply conditions are met; other foods may be GST-free or taxable depending on kind and supply context. Confirm real menu rates with a registered tax professional before using live prices or receipts. See [ATO GST-free food guidance](https://www.ato.gov.au/api/public/content/0-d5b4612a-b7f7-4fea-b46b-e5adf657055c) and the [ATO Detailed Food List](https://www.ato.gov.au/law/view/pdf?DocID=GII%2FGSTIIFL1%2FNAT%2FATO%2F00001&PiT=20230628000001&filename=law%2Fview%2Fpdf%2Fpbr%2Fgstii-fl1c4.pdf).
- The specified customer QR policies—shared active dining session, multi-guest session flow, location permission only on submit, 100 m risk signal, employee fallback, QR-token rotation and explicit session-close/reset behavior—need a dedicated acceptance pass and likely backend/UI changes. Existing QR ordering must not be assumed to satisfy every policy.
- The brief requires confirmed fulfillment/preparation inventory depletion exactly once, receipt de-duplication, partial receipt/returns, immutable movement corrections and lot/expiry controls. Upstream roadmap and self-audit describe some inventory workflows, but each specified path needs acceptance testing; upstream notes say checkout consumption can allow negative stock.
- Split bill/settlement and some purchasing workflows are marked incomplete in upstream roadmap material. Audit, refund/void, EFTPOS, mixed tender and end-of-day reconciliation need an Australian service-flow verification before use.
- Payroll and operating expenses may exist upstream but need an explicit test against this restaurant’s actual workflow and the truncated expense list.
- Custom fork container images have local build tags; no RestaurantOS AU registry exists yet. The self-update service is disabled. Production hosting needs an operator-managed release and update process, HTTPS reverse proxy, backup/restore, monitoring and incident response.

## Current license constraint

The foundation is AGPL-3.0-only. Commercial use is possible under that license, but providing this modified software to users over a network requires providing those users the corresponding modified source under AGPL. A closed-source commercial derivative would require a separate license. This fork retains AGPL; do not relicense it as proprietary.

## Next acceptance sequence

1. Install Docker Engine + Compose on a clean Sydney-target environment, generate secrets, start with `./install.sh --demo`, and verify migrations, health endpoint, demo login and 30-table display.
2. Run the existing lint/typecheck/build/test commands and dependency/security scans from the pinned commit, then run focused API/UI acceptance for the customer QR, KDS persistence/recovery, inventory ledger and settlement races.
3. Test Australian tax-inclusive receipts on taxable, GST-free and mixed orders with an Australian tax professional; validate ABN/receipt settings and GST reports against current ATO/accounting guidance.
4. Review and complete the explicit QR/GPS, session/bill, procurement/receiving, inventory event and end-of-day acceptance requirements before live service.
5. Complete HTTPS, authorization, restore, printer/EFTPOS and staff training checks using the actual restaurant’s devices and processes.
