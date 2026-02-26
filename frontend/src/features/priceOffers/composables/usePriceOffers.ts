import { useQuery } from '@tanstack/vue-query';
import { getPriceOffers } from '../services/getPriceOffers';
import type { PriceOffer } from '../types';

export const usePriceOffers = () => {
  const { data, error, isPending, isError, refetch, isRefetching, isLoading } =
    useQuery<PriceOffer[], Error>({
      queryKey: ['priceOffers'],
      queryFn: getPriceOffers,
    });

  return {
    data,
    error,
    isPending,
    isError,
    refetch,
    isRefetching,
    isLoading,
  };
};
