<template>
  <div class="div-subsection">
    <div class="text-wrapper-21">Our Cosmic Journey</div>
    <p class="orangopus-began-as-a">
      <span class="span">Orangopus began as a spark </span>
      <span class="text-wrapper-22">
        — a vision to build a non-profit, open-source playground where
        creativity has no gravitational limits.
        <br />
        <br />
        We believe in an inclusive multiverse where creators from all
        backgrounds can launch ideas, find mentors, and collaborate freely —
        all powered by the infinite potential of open-source technology.
      </span>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DivSubsection",
});
</script>

<style>
.div-subsection {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 17.18px;
  padding: 57.27px;
  position: relative;
  width: 100%;
}

.div-subsection .text-wrapper-21 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 45.8px;
  font-weight: 500;
  letter-spacing: -1.37px;
  line-height: 55.0px;
  margin-top: -0.72px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: fit-content;
}

.div-subsection .orangopus-began-as-a {
  color: transparent;
  font-family: "Manrope", Helvetica;
  font-size: 17.2px;
  font-weight: 500;
  letter-spacing: -0.52px;
  line-height: 20.6px;
  position: relative;
  width: 408.02px;
}

.div-subsection .span {
  color: #ffffff;
  letter-spacing: -0.09px;
}

.div-subsection .text-wrapper-22 {
  color: #ffffff80;
  letter-spacing: -0.09px;
}
</style>
