<template>
  <button
    :class="buttonClasses"
    :disabled="disabled"
    @click="onClick"
    :type="type"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  disabled?: boolean;
  variant?: 'primary'; // only primary for now
  type: 'button' | 'submit';
}>();

const emit = defineEmits(['click']);

// Define variant styles for easy management
const variantStyles: Record<string, string> = {
  primary: 'bg-pink-700 text-white hover:bg-pink-900 focus:ring-blue-900',
};

const buttonClasses = computed(() => {
  let classes =
    'px-3 py-1 rounded-lg transition ease-in-out duration-150 text-md md:w-80 w-full';

  // Add variant styles
  if (props.variant) {
    classes += ' ' + (variantStyles[props.variant] || '');
  }

  // Disabled state
  if (props.disabled) {
    classes += ' cursor-not-allowed opacity-50';
  }

  return classes;
});

const onClick = () => {
  if (!props.disabled) emit('click');
};
</script>
