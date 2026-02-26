export interface PriceOffer {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  seatAvailability: number;
  price: {
    amount: number;
    currency: string;
  };
  offerType: string;
  uuid: string;
}

export interface PriceOffersListProps {
  origin: string;
  destination: string;
  priceOffers: PriceOffer[];
  isLoading: boolean;
  isError: boolean;
  error: string | Error | unknown;
  isPending: boolean;
}
