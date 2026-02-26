export const formatAmount = (
  amount?: number | null,
  currency: string = 'EUR',
  locale: string = 'de-DE',
  fallback: string = '0,00 €',
  options?: Intl.NumberFormatOptions,
): string => {
  if (amount == null || isNaN(amount) || currency == null) return fallback;

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
};
