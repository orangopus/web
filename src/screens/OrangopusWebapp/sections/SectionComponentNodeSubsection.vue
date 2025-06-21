<template>
  <div class="section-component-node-subsection">
    <div class="text-wrapper-23">FAQ</div>
    <div class="frame-19">
      <div class="frame-20">
        <div class="text-wrapper-24">What is Orangopus?</div>
        <ChevronUp2 class="chevron-up" />
      </div>
      <div class="rectangle" />
      <div class="frame-20">
        <div class="text-wrapper-24">Who is this for?</div>
        <ChevronUp2 class="chevron-up" />
      </div>
      <div class="rectangle" />
      <div class="frame-21">
        <div class="frame-20">
          <p class="text-wrapper-24">How do I get started?</p>
          <ChevronUp3 class="chevron-up" />
        </div>
        <p class="text-wrapper-25">
          Answering the above question blah blah.
        </p>
      </div>
      <div class="rectangle" />
      <div class="frame-20">
        <p class="text-wrapper-24">How can I support the project?</p>
        <ChevronUp2 class="chevron-up" />
      </div>
      <div class="rectangle" />
      <div class="frame-20">
        <p class="text-wrapper-24">Where does all your money go?</p>
        <ChevronUp2 class="chevron-up" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChevronUp2 from "../../../icons/ChevronUp2.vue";
import ChevronUp3 from "../../../icons/ChevronUp3.vue";

export default defineComponent({
  name: "SectionComponentNodeSubsection",
  components: {
    ChevronUp2,
    ChevronUp3,
  },
});
</script>

<style>
.section-component-node-subsection {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 22.91px;
  padding: 57.27px;
  position: relative;
  width: 100%;
}

.section-component-node-subsection .text-wrapper-23 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 45.8px;
  font-weight: 400;
  letter-spacing: -1.83px;
  line-height: 45.8px;
  margin-top: -0.72px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: fit-content;
}

.section-component-node-subsection .frame-19 {
  align-items: flex-start;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 22.91px;
  max-width: 357.91px;
  position: relative;
  width: 100%;
}

.section-component-node-subsection .frame-20 {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  justify-content: space-between;
  position: relative;
  width: 100%;
}

.section-component-node-subsection .text-wrapper-24 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 17.2px;
  font-weight: 400;
  letter-spacing: -0.69px;
  line-height: 17.2px;
  margin-top: -0.72px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}

.section-component-node-subsection .chevron-up {
  height: 17.18px !important;
  position: relative !important;
  width: 17.18px !important;
}

.section-component-node-subsection .rectangle {
  align-self: stretch;
  background-color: #ffffff2b;
  height: 1px;
  position: relative;
  width: 100%;
}

.section-component-node-subsection .frame-21 {
  align-items: flex-start;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 11.45px;
  position: relative;
  width: 100%;
}

.section-component-node-subsection .text-wrapper-25 {
  color: #ffffff80;
  font-family: "Manrope", Helvetica;
  font-size: 11.5px;
  font-weight: 400;
  letter-spacing: -0.46px;
  line-height: 17.2px;
  position: relative;
  white-space: nowrap;
  width: fit-content;
}
</style>
