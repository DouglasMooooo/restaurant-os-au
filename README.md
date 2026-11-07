# RestaurantOS AU

An Australian adaptation of [NodeDR OrderRestro](https://github.com/Raktim94/nodedr-restaurant-pos) for one Sydney restaurant. The upstream source snapshot is pinned to `2e974ab56a1c955d94a8b46708ea0cdc7eaa0546` (7 November 2026). This is an independent adaptation, not an official NodeDR release.

**Current status:** the AU defaults, database schema, import examples and fork-specific deployment identities are implemented. Typecheck, tests, production build, Prisma schema validation and a production dependency audit passed. The full Docker/PostgreSQL restaurant workflows have not been accepted or exercised here; see [AU_IMPLEMENTATION_STATUS.md](AU_IMPLEMENTATION_STATUS.md) before using live restaurant data.

## Run a local demonstration

Requires Docker Engine with the Docker Compose v2 plugin and Git Bash or WSL.

```bash
./install.sh --demo
```

Open `http://localhost:1995` and use `owner@demo.local` / `Password123!`. Demo menu, prices, stock, suppliers and transactions are examples only. Do not use the demo account for live operations.

For an empty restaurant, run `./install.sh` without `--demo`, then create the owner account at `/signup`. New installs default to AUD, `Australia/Sydney`, AU and the AU GST label. Existing restaurant configuration is preserved by the upgrade migrations.

See the [Australian setup and CSV import guide](docs/AU_SETUP_AND_IMPORTS.md) for secret setup, menu/ingredient templates and GST classification notes. Use [docs/OPEN_SOURCE_EVALUATION.md](docs/OPEN_SOURCE_EVALUATION.md) for the candidate audit and foundation decision.

## Online interactive preview

The separate [Vercel demo](https://vercel-demo-peach-six.vercel.app) is a front-end-only preview with fictional data. It demonstrates the floor plan, sample menu, stock overview, reports and a QR table-order flow. Demo orders and requests use browser-local storage and synchronize across tabs in the same browser only. There is no API or database, so scanned orders do not reach a different device or a real kitchen. It cannot process payments or run a restaurant. Its source is in [`vercel-demo/`](vercel-demo/); deploy it independently with `pnpm dlx vercel --prod` from that directory.

Vercel-hosted frontend demo status and storage notes are in [docs/VERCEL_DEMO.md](docs/VERCEL_DEMO.md).

## Technology and source

- Modular monolith: NestJS API, Next.js web app, shared TypeScript/Zod types
- PostgreSQL with Prisma; Docker Compose deployment; Socket.IO realtime
- Source archive retrieved from the upstream `master` ref listed above; the output snapshot does not include upstream Git history.
- No code from the other evaluated repositories was combined into this project.

## License and attribution

The project remains under the upstream **AGPL-3.0-only** license. The upstream `LICENSE`, `NOTICE`, `COPYRIGHT` and `TRADEMARK_POLICY.md` are retained. If this modified version is provided as a network service, AGPL requires offering users the corresponding modified source. A closed-source derivative needs a separate license from the rights holder. Change details and dates are in [AU_MODIFICATIONS.md](AU_MODIFICATIONS.md).

## Verification

In this workspace, `pnpm typecheck`, `pnpm test`, `pnpm build`, `prisma validate`, and `pnpm audit --prod` passed. The local Next.js login route returned HTTP 200. Docker and PostgreSQL were unavailable, so the full application/API startup and migration execution were not verified. The full dependency audit retains one low-severity development-only `deepmerge` advisory with no patched release; the production dependency audit is clean.
