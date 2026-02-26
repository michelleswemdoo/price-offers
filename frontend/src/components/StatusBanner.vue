<template>
  <div
    ref="bannerRef"
    :class="[
      'text-center py-8 rounded-lg border focus:outline-none',
      variantClass,
    ]"
    :role="role"
    :aria-live="ariaLive"
    tabindex="-1"
  >
    <div class="flex flex-col items-center gap-3">
      <div v-if="$slots.icon">
        <slot name="icon" />
      </div>
      <p class="text-base">
        <slot />
      </p>
      <button
        v-if="showRetry"
        type="button"
        class="mt-2 inline-flex items-center rounded-md bg-pink-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-pink-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-700"
        @click="$emit('retry')"
      >
        Retry
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'error';
    role?: 'status' | 'alert';
    ariaLive?: 'polite' | 'assertive' | 'off';
    autoFocus?: boolean;
    showRetry?: boolean;
  }>(),
  {
    variant: 'info',
    role: 'status',
    ariaLive: 'polite',
    autoFocus: false,
    showRetry: false,
  },
);

defineEmits<{
  retry: [];
}>();

const bannerRef = ref<HTMLElement | null>(null);

watch(
  () => props.autoFocus,
  (value) => {
    if (value && bannerRef.value) {
      bannerRef.value.focus();
    }
  },
  { immediate: true },
);

const variantClass = computed(() =>
  props.variant === 'error'
    ? 'border-red-200 bg-red-50 text-red-700'
    : 'border-gray-200 bg-gray-50 text-gray-600',
);
</script>

