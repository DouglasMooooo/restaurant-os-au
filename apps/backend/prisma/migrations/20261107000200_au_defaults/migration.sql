-- RestaurantOS AU defaults apply to new records only. Existing restaurant
-- configuration is intentionally preserved for operators upgrading upstream.
ALTER TABLE "restaurants" ALTER COLUMN "currency" SET DEFAULT 'AUD';
ALTER TABLE "restaurants" ALTER COLUMN "timezone" SET DEFAULT 'Australia/Sydney';
ALTER TABLE "branches" ALTER COLUMN "country" SET DEFAULT 'AU';
ALTER TABLE "branches" ALTER COLUMN "taxRegime" SET DEFAULT 'AU_GST';
