# Sydney setup and CSV import guide

## Run with demonstration data

Prerequisites: Docker Engine with the Docker Compose v2 plugin, plus Git Bash or WSL for the installer. Open PowerShell is not a Bash shell. Do not expose the development defaults to the public internet.

From this project directory, run:

```bash
./install.sh --demo
```

The installer generates local secrets if `.env` does not exist, builds the app and database containers, runs migrations, and loads clearly labelled demonstration data. Open `http://localhost:1995` and sign in as `owner@demo.local` with password `Password123!`. This is a demo credential; do not use it for a live restaurant. The seeded menu, ingredient costs, suppliers and table activity are examples only.

For a real restaurant, use `./install.sh` without `--demo` and create an owner account at `/signup`. Add the real restaurant name, ABN, address, contact details, opening times, menu, suppliers and prices through settings/imports. Configure a strong unique `JWT_SECRET` and `POSTGRES_PASSWORD`; use HTTPS and `COOKIE_SECURE=true` behind a TLS reverse proxy. Keep the PostgreSQL and uploads volumes in a tested off-host backup plan.

New accounts default to AUD, `Australia/Sydney`, AU and the AU GST label. Existing tenant settings are preserved by migrations. Confirm tax status/rates and receipt settings for each real menu item before opening.

## Menu CSV

Use the in-app **Menu → Import** template or `docs/examples/menu-items.csv`. It contains the importer’s seven sample rows and import columns. To get a blank header-only file, choose the template download in the app. Save as UTF-8 CSV. Required fields are `name`, `category`, and `price`; prices are numeric AUD amounts. Empty optional cells are allowed.

Common columns include:

| Column | Meaning |
|---|---|
| `name`, `category`, `price` | Dish name, category and selling price in AUD |
| `half_price` | Optional smaller-portion price |
| `tax_rate_percent` | Per-item rate used by the pricing engine; enter the verified status/rate for the item, not a blanket assumption |
| `sku`, `description`, `station` | Optional product code, customer description and kitchen station |
| `is_veg`, `spice_level`, `prep_time_minutes` | Optional menu and kitchen metadata |
| `cost_price`, `calories`, `allergens` | Optional cost/nutrition/allergen fields; validate these before publishing |
| `available_from`, `available_to`, `is_active` | Optional daily availability window and active flag |

Tax examples in the file are for demonstrating import only. The ATO distinguishes foods and supply contexts; dine-in and hot takeaway food are generally taxable where the supply conditions apply, while some other foods may be GST-free. Confirm each item and any mixed/combo treatment with a registered tax professional. [ATO GST-free food guidance](https://www.ato.gov.au/api/public/content/0-d5b4612a-b7f7-4fea-b46b-e5adf657055c).

## Ingredient CSV

Use the in-app **Inventory → Import** template or `docs/examples/ingredients.csv`. Supported canonical units include `KG`, `G`, `L`, `ML`, `PIECE`, `DOZEN`, `PACK`, and `BOX` (the importer accepts aliases). Enter one row per stock item; do not use an ingredient example as an opening balance. Confirm conversion ratios for packaging units (for example, carton-to-each) before recording purchase quantities or recipes.

| Column | Meaning |
|---|---|
| `name`, `unit` | Ingredient/stock item and its base unit |
| `sku` | Optional unique stock code |
| `reorder_level` | Alert threshold in the same base unit |
| `cost_per_unit` | Demonstration/current cost per base unit in AUD |
| `opening_stock` | Opening quantity for a new item only; reconcile to a physical stocktake |
| `is_active` | Whether the item is active |

Imports are privileged, auditable write operations. Review the import preview and row errors before confirming. Keep a source copy of each final import file and the approved opening-stock count.
