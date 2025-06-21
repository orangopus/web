<template>
  <svg
    :class="['chevron-up-3', className]"
    fill="none"
    height="18"
    viewBox="0 0 18 18"
    width="18"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="path"
      d="M6.77192 10.9586L8.93757 8.79297L11.1032 10.9586"
      stroke="white"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="0.721881"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChevronUp3",
  props: {
    className: {
      type: String,
      default: "",
    },
  },
});
</script>

<style>
</style>
