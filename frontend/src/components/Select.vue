<template>
  <label class="sr-only" :for="id">{{ label }}</label>
  <select
    :id="id"
    v-model="selectedOption"
    :disabled="disabled"
    class="w-full border border-gray-300 bg-white rounded-md px-2 py-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-700 focus:border-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <option disabled value="">{{ placeholder }}</option>
    <option
      v-for="option in selectOptions"
      :key="option.code"
      :value="option.code"
    >
      {{ option.name }}
    </option>
  </select>
</template>

<script setup lang="ts">
interface Option {
  name: string;
  code: string;
}

const selectedOption = defineModel<string>('modelValue');

const props = withDefaults(
  defineProps<{
    label?: string;
    placeholder?: string;
    id: string;
    disabled?: boolean;
    selectOptions?: Option[];
  }>(),
  {
    label: '',
    placeholder: 'Please select an option',
    disabled: false,
    selectOptions: () => [],
  },
);
</script>
