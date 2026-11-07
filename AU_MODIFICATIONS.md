# RestaurantOS AU change record

This source tree is adapted from [NodeDR OrderRestro](https://github.com/Raktim94/nodedr-restaurant-pos) at upstream `master` commit `2e974ab56a1c955d94a8b46708ea0cdc7eaa0546` (observed 7 November 2026). It is not an official NodeDR release. The upstream `LICENSE`, `NOTICE`, `COPYRIGHT`, and trademark policy are retained. All listed changes were made on **7 November 2026**.

## Changed files

- `README.md` — fork identity, launch instructions, status and license notes.
- `docker-compose.yml`, `install.sh` — separate container/image identity; upstream image updater disabled by default so it cannot overwrite this fork.
- `apps/backend/prisma/schema.prisma` and `apps/backend/prisma/migrations/20261107000100_add_au_gst_regime/migration.sql`, `apps/backend/prisma/migrations/20261107000200_au_defaults/migration.sql` — Australian defaults and tax preset.
- `apps/backend/prisma/seed.ts` — labelled Sydney demo tenant, AUD and 30 demonstration tables.
- `apps/backend/src/common/services/branch-time.service.ts` — Sydney timezone fallback.
- `apps/backend/src/main.ts` — fork API documentation identity.
- `apps/backend/src/modules/imports/templates.ts`, `docs/examples/menu-items.csv` — 10% illustrative Australian GST example rate.
- `apps/web/app/layout.tsx`, `apps/web/app/login/page.tsx`, `apps/web/app/signup/page.tsx`, `apps/web/components/layout/app-shell.tsx`, `apps/web/components/layout/brand-footer.tsx`, `apps/web/lib/format.ts` — fork identity and AUD/Australian locale display defaults.
- `apps/web/components/layout/logo.tsx`, `apps/web/components/marketing/marketing-nav.tsx`, `apps/web/components/marketing/claimed-landing.tsx`, `apps/web/components/marketing/doc-page.tsx`, `apps/web/components/marketing/features.tsx`, `apps/web/components/marketing/security-section.tsx`, `apps/web/components/marketing/install-section.tsx`, `apps/web/components/marketing/marketing-footer.tsx` — AU fork branding, local installer instructions, and corrected source/security attribution.
- `apps/web/app/docs/page.tsx`, `apps/web/app/docs/australia/page.tsx` — upstream repository attribution and Australian setup documentation entry point.
- `packages/types/src/tax.ts` — AU GST preset and country default.
- `pnpm-workspace.yaml`, `pnpm-lock.yaml` — patched transitive dependency overrides for advisories found during the local audit.
- `docs/OPEN_SOURCE_EVALUATION.md`, `AU_IMPLEMENTATION_STATUS.md`, `docs/AU_SETUP_AND_IMPORTS.md` — evaluation, implementation status and operator guidance.

The source package is licensed under AGPL-3.0-only. A modified network service must offer its corresponding source to its users under the license. Keep this record, the upstream copyright/notice files, and the modified-source offer together when distributing or operating this fork.
