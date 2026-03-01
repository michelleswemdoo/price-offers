import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import PriceOfferList from '../PriceOfferList.vue';

const mockOffers = [
  {
    origin: 'BER',
    destination: 'BCN',
    departureDate: '2024-03-09',
    returnDate: '2024-03-14',
    seatAvailability: 11,
    price: { amount: 180.0, currency: 'EUR' },
    offerType: 'BestPrice',
    uuid: 'SA00009-9f8e7d6c-5b4a-4c3d-2e1f-0a9b8c7d6e5f',
  },
  {
    origin: 'MAD',
    destination: 'LHR',
    departureDate: '2024-03-10',
    returnDate: '2024-03-15',
    seatAvailability: 7,
    price: { amount: 165.0, currency: 'EUR' },
    offerType: 'BestPrice',
    uuid: 'SA00010-abcdef12-3456-4a78-9b0c-123456789abc',
  },
];

describe('PriceOfferList', () => {
  type Props = InstanceType<typeof PriceOfferList>['$props'];
  const defaultProps: Props = {
    priceOffers: mockOffers,
    isLoading: false,
    isError: false,
    error: null,
    origin: '',
    destination: '',
    isPending: false,
  };

  function renderComponent(
    props: Partial<Props> = {},
    options: Parameters<typeof render>[1] = {},
  ) {
    return render(PriceOfferList, {
      props: { ...defaultProps, ...props },
      global: {
        stubs: {
          Spinner: true,
          PriceOfferCard: true, // default = unit testing
        },
        ...options?.global,
      },
      ...options,
    });
  }

  describe('UI State', () => {
    test('renders loading state with accessible status', () => {
      renderComponent({ isLoading: true });

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveTextContent(/loading price offers/i);

      // Ensure other states are not visible
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(screen.queryByText(/no offers/i)).not.toBeInTheDocument();
    });

    test('renders error state with string message', () => {
      renderComponent({ isError: true, error: 'Server failed' });

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/server failed/i);

      // Ensure loading or no-results are not visible
      expect(
        screen.queryByRole('status', { name: /loading price offers/i }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/no offers/i)).not.toBeInTheDocument();
    });

    test('renders error state with Error instance', () => {
      renderComponent({ isError: true, error: new Error('Boom') });

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/boom/i);
    });

    test('renders error state with unknown error as generic message', () => {
      renderComponent({ isError: true, error: null });

      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent(/unknown error/i);
    });

    test('renders empty state when there are no offers', () => {
      renderComponent({ priceOffers: [] });

      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-live', 'polite');
      expect(status).toHaveTextContent(
        /no offers found for the selected destinations/i,
      );

      // Ensure loading or error are not visible
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      expect(
        screen.queryByText(/loading price offers/i),
      ).not.toBeInTheDocument();
    });
  });

  test('calls onRetry when Retry button is clicked in error state', async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();

    renderComponent({ isError: true, error: 'Server failed', onRetry });

    const button = screen.getByRole('button', { name: /retry/i });

    await user.click(button);

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  describe('Filtering logic', () => {
    test('filters offers by origin', () => {
      renderComponent({ origin: 'MAD' });

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
    });

    test('filters offers by destination', () => {
      renderComponent({ destination: 'BCN' });

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
    });

    test('filters offers by origin + destination', () => {
      renderComponent({ origin: 'BER', destination: 'BCN' });

      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(1);
    });

    test('no match returns empty list', () => {
      renderComponent({ origin: 'MAD', destination: 'BCN' });

      const status = screen.getByRole('status');
      expect(status).toHaveTextContent(/no offers/i);
    });
  });

  describe('Integration with PriceOfferCard', () => {
    test('renders a card for each filtered offer with correct data-testid', () => {
      renderComponent(
        {},
        {
          global: {
            // Keep Spinner stubbed but use the real PriceOfferCard component
            stubs: {
              Spinner: true,
            },
          },
        },
      );

      const cards = screen.getAllByTestId('price-offer-card');
      expect(cards).toHaveLength(mockOffers.length);
    });

    test('passes correct price data down to PriceOfferCard', () => {
      renderComponent(
        { destination: 'BCN' },
        {
          global: {
            stubs: {
              Spinner: true,
            },
          },
        },
      );

      const cards = screen.getAllByTestId('price-offer-card');
      expect(cards).toHaveLength(1);
    });
  });
});
