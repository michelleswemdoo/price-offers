<template>
  <!-- Loading state -->
  <StatusBanner v-if="isLoading || isPending" role="status" aria-live="polite">
    <template #icon>
      <Spinner />
    </template>
    Loading price offers...
  </StatusBanner>

  <!-- Error state -->
  <StatusBanner
    v-else-if="isError"
    variant="error"
    role="alert"
    aria-live="assertive"
    :auto-focus="true"
    :show-retry="Boolean(onRetry)"
    @retry="onRetry && onRetry()"
  >
    <template #icon>
      <span
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600"
        aria-hidden="true"
      >
        !
      </span>
    </template>
    Oops! Something went wrong: {{ errorMessage }} Please try again.
  </StatusBanner>

  <!-- No results -->
  <StatusBanner
    v-else-if="filteredOffers.length === 0"
    role="status"
    aria-live="polite"
  >
    <template #icon>
      <span
        class="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500"
        aria-hidden="true"
      >
        –
      </span>
    </template>
    No offers found for the selected destinations. Try adjusting your filters.
  </StatusBanner>

  <ul class="space-y-3" v-else>
    <li
      v-for="offer in filteredOffers"
      :key="offer.uuid"
      class="p-4 sm:pr-20 bg-white rounded-lg shadow border border-gray-300"
    >
      <PriceOfferCard :price-offer="offer" />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { PriceOffer } from '../types';
import PriceOfferCard from './PriceOfferCard.vue';
import Spinner from '../../../components/Spinner.vue';
import StatusBanner from '../../../components/StatusBanner.vue';

const props = defineProps<{
  origin: string;
  destination: string;
  priceOffers: PriceOffer[];
  isLoading: boolean;
  isError: boolean;
  error: string | Error | unknown;
  isPending: boolean;
  onRetry?: () => void;
}>();

const filteredOffers = computed(() =>
  props.priceOffers.filter(
    (offer) =>
      (!props.origin || offer.origin === props.origin) &&
      (!props.destination || offer.destination === props.destination),
  ),
);

// Convert unknown error into a readable message
const errorMessage = computed(() => {
  if (!props.error) return 'Unknown error';
  if (typeof props.error === 'string') return props.error;
  if (props.error instanceof Error) return props.error.message;
  return 'Something went wrong';
});
</script>
