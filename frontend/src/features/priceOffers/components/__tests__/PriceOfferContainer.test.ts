import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/vue';
import userEvent from '@testing-library/user-event';
import { ref } from 'vue';
import PriceOfferContainer from '../PriceOfferContainer.vue';
import { usePriceOffers } from '../../composables/usePriceOffers';

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

const mockRoute: { query: Record<string, string> } = { query: {} };
const mockReplace = vi.fn();

const dataRef = ref(mockOffers);
const errorRef = ref<unknown>(null);
const isPendingRef = ref(false);
const isErrorRef = ref(false);
const isLoadingRef = ref(false);
const isRefetchingRef = ref(false);
const refetchMock = vi.fn();

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
  useRouter: () => ({ replace: mockReplace }),
}));

vi.mock('../../composables/usePriceOffers');

function renderComponent() {
  return render(PriceOfferContainer);
}

describe('PriceOfferContainer', () => {
  beforeEach(() => {
    vi.mocked(usePriceOffers as ReturnType<typeof vi.fn>).mockReturnValue({
      data: dataRef,
      error: errorRef,
      isPending: isPendingRef,
      isError: isErrorRef,
      isLoading: isLoadingRef,
      isRefetching: isRefetchingRef,
      refetch: refetchMock,
    });

    mockRoute.query = {};
    mockReplace.mockReset();
    dataRef.value = mockOffers;
    errorRef.value = null;
    isPendingRef.value = false;
    isErrorRef.value = false;
    isLoadingRef.value = false;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Unit-style behavior (filters and routing)', () => {
    test('renders heading, filters and disabled reset button initially', () => {
      renderComponent();

      // Title
      expect(
        screen.getByRole('heading', { name: /price offers/i }),
      ).toBeInTheDocument();

      // Two filter selects
      const selects = screen.getAllByRole('combobox');
      expect(selects).toHaveLength(2);

      // Reset button disabled when no filters selected
      const resetButton = screen.getByRole('button', {
        name: /reset filters/i,
      });
      expect(resetButton).toBeDisabled();
    });

    test('initializes filters from route query params', () => {
      mockRoute.query = { origin: 'MAD', destination: 'LHR' };

      renderComponent();

      const selects = screen.getAllByRole('combobox');
      expect(selects[0]).toHaveValue('MAD');
      expect(selects[1]).toHaveValue('LHR');
    });

    test('updates router query when filters change', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderComponent();

      const selects = screen.getAllByRole('combobox');
      const originSelect = selects[0] as HTMLSelectElement;
      const destinationSelect = selects[1] as HTMLSelectElement;

      await user.selectOptions(originSelect, 'BER');
      await user.selectOptions(destinationSelect, 'BCN');

      // Fast-forward time until all timers have been executed
      await vi.runAllTimersAsync();

      expect(mockReplace).toHaveBeenCalled();
      const lastCall =
        mockReplace.mock.calls[mockReplace.mock.calls.length - 1]?.[0];
      expect(lastCall?.query).toMatchObject({
        origin: 'BER',
        destination: 'BCN',
      });
    });

    test('enables and resets filters when reset button is clicked', async () => {
      const user = userEvent.setup();
      renderComponent();

      const selects = screen.getAllByRole('combobox');
      const originSelect = selects[0] as HTMLSelectElement;
      const destinationSelect = selects[1] as HTMLSelectElement;
      const resetButton = screen.getByRole('button', {
        name: /reset filters/i,
      });

      // Select some filters
      await user.selectOptions(originSelect, 'MAD');
      await user.selectOptions(destinationSelect, 'LHR');

      expect(resetButton).not.toBeDisabled();

      // Click reset
      await user.click(resetButton);

      expect(originSelect).toHaveValue('');
      expect(destinationSelect).toHaveValue('');
      expect(resetButton).toBeDisabled();
    });
  });

  describe('Integration with PriceOfferList and data source', () => {
    test('derives origin and destination options from fetched data', () => {
      renderComponent();

      // Options for unique origins/destinations from mockOffers
      expect(screen.getByRole('option', { name: 'BER' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'MAD' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'BCN' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'LHR' })).toBeInTheDocument();
    });

    test('filters rendered offers when origin filter changes', async () => {
      const user = userEvent.setup();
      renderComponent();

      // Initially both offers should be rendered via PriceOfferList + PriceOfferCard
      expect(screen.getAllByTestId('price-offer-card')).toHaveLength(
        mockOffers.length,
      );

      const selects = screen.getAllByRole('combobox');
      const originSelect = selects[0] as HTMLSelectElement;
      await user.selectOptions(originSelect, 'BER');

      const cards = screen.getAllByTestId('price-offer-card');
      expect(cards).toHaveLength(1);
      expect(cards[0]).toHaveTextContent('BER');
      expect(cards[0]).toHaveTextContent('BCN');
    });
  });
});
