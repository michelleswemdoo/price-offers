import type { PriceOffer } from '../types';
import { axiosInstance } from '../../../libs/axios';

export const getPriceOffers = async (): Promise<PriceOffer[]> => {
  try {
    const response = await axiosInstance.get<PriceOffer[]>('/price-offers');
    return response.data;
  } catch (error) {
    console.log('Failed to fetch price offers', error);
    throw error;
  }
};
