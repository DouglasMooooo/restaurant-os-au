-- RestaurantOS AU — add an Australian preset without altering existing rows.
-- Run separately from the defaults migration because PostgreSQL requires a
-- newly added enum value to commit before it can be used by a column default.
ALTER TYPE "TaxRegime" ADD VALUE IF NOT EXISTS 'AU_GST';
