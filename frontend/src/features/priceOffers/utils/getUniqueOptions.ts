import type { PriceOffer } from '../types';
export const getUniqueOptions = (
  items: PriceOffer[] | undefined,
  key: keyof PriceOffer,
) => {
  if (!items) return [];
  return [...new Set(items.map((item) => item[key]))].map((val) => ({
    name: String(val),
    code: String(val),
  }));
};
