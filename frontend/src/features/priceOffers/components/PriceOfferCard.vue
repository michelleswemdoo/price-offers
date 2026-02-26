<template>
  <div
    data-testid="price-offer-card"
    class="flex justify-between items-center mb-2 text-gray-800"
  >
    <!-- Desktop: line -->
    <div class="hidden sm:flex items-center flex-1 gap-10">
      <span class="font-semibold text-lg">{{ priceOffer.origin }}</span>
      <span class="w-80 border-t border-gray-300"></span>
      <span class="font-semibold">{{ priceOffer.destination }}</span>
    </div>

    <!-- Mobile: simple arrow -->
    <div class="flex sm:hidden items-center flex-1">
      <span class="flex font-semibold">
        {{ priceOffer.origin }} → {{ priceOffer.destination }}
      </span>
    </div>

    <div class="text-sm flex flex-col items-center gap-1 text-black">
      <span class="text-sm self-end">Flight from</span>
      <span data-testid="price" class="font-bold text-2xl">
        {{
          formatAmount(priceOffer.price.amount, priceOffer.price.currency)
        }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PriceOffer } from '../types';
import { formatAmount } from '../utils/formatAmount';
defineProps<{
  priceOffer: PriceOffer;
}>();
</script>
