<template>
  <svg
    :class="['chevron-up', className]"
    fill="none"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      class="path"
      d="M8.94922 10L11.9746 13.0254L15 10"
      stroke="black"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.00846"
    />
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChevronUp",
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
