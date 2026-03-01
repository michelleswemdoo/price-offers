<template>
  <header>
    <div class="flex items-center justify-center p-4 bg-white shadow">
      <!-- Page Title-->
      <h1 class="ml-4 text-xl font-bold text-pink-700">Price Offers</h1>
    </div>
  </header>
  <main
    class="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 py-8"
  >
    <!-- Page Filters -->
    <section aria-labelledby="filters-heading">
      <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-1">
          <h2 id="filters-heading" class="text-lg font-semibold text-gray-800">
            Filter offers
          </h2>
          <p class="text-sm text-gray-600">
            Choose an origin and destination to narrow down the available
            offers.
          </p>
        </div>
      </div>
      <div class="my-4 flex flex-col gap-4 sm:flex-row sm:gap-6">
        <Select
          v-model="selectedOrigin"
          id="origins"
          label="Origin"
          :select-options="originOptions"
        />
        <Select
          v-model="selectedDestination"
          id="destinations"
          label="Destination"
          :select-options="destinationOptions"
        />
        <Button
          type="button"
          @click="resetFilters"
          variant="primary"
          :disabled="!selectedOrigin && !selectedDestination"
          >Reset Filters</Button
        >
      </div>
      <p
        v-if="isRefetching"
        class="text-xs text-gray-500"
        role="status"
        aria-live="polite"
      >
        Refreshing offers...
      </p>
    </section>

    <!-- Page Offers -->
    <section>
      <PriceOfferList
        :origin="selectedOrigin"
        :destination="selectedDestination"
        :price-offers="data ?? []"
        :is-loading="isLoading"
        :is-error="isError"
        :error="error"
        :is-pending="isPending"
        :on-retry="refetch"
      />
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePriceOffers } from '../composables/usePriceOffers';
import type { PriceOffer } from '../types';
import PriceOfferList from './PriceOfferList.vue';
import Select from '../../../components/Select.vue';
import Button from '../../../components/Button.vue';

const route = useRoute();
const router = useRouter();

const selectedOrigin = ref((route.query.origin as string) || '');
const selectedDestination = ref((route.query.destination as string) || '');

let updateQueryTimeout: ReturnType<typeof setTimeout> | null = null;

watch([selectedOrigin, selectedDestination], ([newOrigin, newDestination]) => {
  if (updateQueryTimeout) {
    clearTimeout(updateQueryTimeout);
  }

  updateQueryTimeout = setTimeout(() => {
    router.replace({
      query: {
        ...route.query,
        origin: newOrigin || undefined,
        destination: newDestination || undefined,
      },
    });
  }, 300);
});

onUnmounted(() => {
  if (updateQueryTimeout) {
    clearTimeout(updateQueryTimeout);
  }
});

const { data, error, isPending, isError, isLoading, isRefetching, refetch } =
  usePriceOffers();

const getUniqueOptions = (
  items: PriceOffer[] | undefined,
  key: keyof PriceOffer,
) => {
  if (!items) return [];
  return [...new Set(items.map((item) => item[key]))].map((val) => ({
    name: String(val),
    code: String(val),
  }));
};

// Computed to generate the origins options based on the fetched data
const originOptions = computed(() => getUniqueOptions(data.value, 'origin'));

// Computed to generate the Destinations options based on the fetched data
const destinationOptions = computed(() =>
  getUniqueOptions(data.value, 'destination'),
);

const resetFilters = () => {
  selectedOrigin.value = '';
  selectedDestination.value = '';
};
</script>
