export function formatCurrency(
  value: number | string,
  // RestaurantOS AU default; tenant settings still override both values.
  currency = "AUD",
  locale = "en-AU",
): string {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}
