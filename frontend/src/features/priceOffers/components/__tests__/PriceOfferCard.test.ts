import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/vue';
import PriceOfferCard from '../PriceOfferCard.vue';
import { formatAmount } from '../../utils/formatAmount';

describe('PriceOfferCard', () => {
  const mockPriceOffer = {
    origin: 'BER',
    destination: 'BCN',
    departureDate: '2024-03-10',
    returnDate: '2024-03-15',
    seatAvailability: 7,
    price: { amount: 165.0, currency: 'EUR' },
    offerType: 'BestPrice',
    uuid: 'SA00010-abcdef12-3456-4a78-9b0c-123456789abc',
  };

  test('renders origin and destination on desktop', () => {
    render(PriceOfferCard, { props: { priceOffer: mockPriceOffer } });

    expect(screen.getByText('BER')).toBeInTheDocument();
    expect(screen.getByText('BCN')).toBeInTheDocument();
  });

  test('renders origin → destination on mobile', () => {
    render(PriceOfferCard, { props: { priceOffer: mockPriceOffer } });

    expect(screen.getByText('BER → BCN')).toBeInTheDocument();
  });

  test('renders the formatted price', () => {
    render(PriceOfferCard, { props: { priceOffer: mockPriceOffer } });

    const priceElement = screen.getByTestId('price');

    expect(priceElement).toBeInTheDocument();

    const expectedPrice = formatAmount(
      mockPriceOffer.price.amount,
      mockPriceOffer.price.currency,
    );
    expect(priceElement.textContent).toBe(expectedPrice);
  });
});
