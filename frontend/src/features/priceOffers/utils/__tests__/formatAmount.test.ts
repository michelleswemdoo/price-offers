import { describe, test, expect } from 'vitest';
import { formatAmount } from '../formatAmount';

describe('formatAmount', () => {
  test('formats number as EUR currency in de-DE locale by default', () => {
    const result = formatAmount(180);

    expect(result).toMatch(/180/);
    expect(result).toMatch(/,/);
    expect(result).toMatch(/€/);
  });

  test('returns fallback for null, undefined, or NaN amount', () => {
    expect(formatAmount(null)).toBe('0,00 €');
    expect(formatAmount(undefined)).toBe('0,00 €');
   
    expect(formatAmount(NaN)).toBe('0,00 €');
  });

  test('returns fallback when currency is null', () => {
    // @ts-expect-error currency explicitly null to hit guard
    const result = formatAmount(100, null);
    expect(result).toBe('0,00 €');
  });

  test('accepts custom currency and locale', () => {
    const result = formatAmount(100, 'USD', 'en-US');
    expect(result).toMatch(/100/);
    expect(result).toMatch(/USD|\$/);
  });

  test('applies custom Intl.NumberFormat options', () => {
    const result = formatAmount(100, 'EUR', 'de-DE', 'fallback', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
   
    expect(result).toMatch(/100(?![.,]\d{2})/);
  });

  test('uses provided fallback string', () => {
    expect(formatAmount(null, 'EUR', 'de-DE', 'N/A')).toBe('N/A');
  });
});