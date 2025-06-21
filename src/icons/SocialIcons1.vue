<template>
  <svg
    :class="['social-icons-1', className]"
    fill="none"
    height="20"
    viewBox="0 0 19 20"
    width="19"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g class="g" clip-path="url(#clip0_1_1417)">
      <path
        class="path"
        d="M14.6474 2.30713H17.2015L11.6215 8.68473L18.1859 17.3632H13.046L9.02027 12.0998L4.41389 17.3632H1.85821L7.8266 10.5416L1.5293 2.30713H6.79969L10.4386 7.11812L14.6474 2.30713ZM13.751 15.8344H15.1662L6.03068 3.7556H4.51194L13.751 15.8344Z"
        fill="white"
      />
    </g>
    <defs class="defs">
      <clipPath class="clip-path" id="clip0_1_1417">
        <rect
          class="rect"
          fill="white"
          height="18.1709"
          transform="translate(0.772156 0.865723)"
          width="18.1709"
        />
      </clipPath>
    </defs>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SocialIcons1",
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
