<template>
  <div class="macbook-pro-1-subsection">
    <img
      class="simplification-2"
      alt="Simplification"
      src="https://c.animaapp.com/bX3QfjDJ/img/simplification-1.svg"
    />
    <div class="frame-26">
      <div class="frame-27">
        <div class="frame-28">
          <div class="text-wrapper-29">Donate</div>
          <div class="ellipse-2" />
          <div class="text-wrapper-29">Help Center</div>
          <div class="ellipse-2" />
          <div class="text-wrapper-29">Merch</div>
          <div class="ellipse-2" />
          <div class="text-wrapper-29">Terms &amp; Conditions</div>
        </div>
        <p class="text-wrapper-30">
          (C) Orangopus 2125 - All rights reserved across the galaxy.
        </p>
      </div>
      <div class="frame-29">
        <SocialIcons1 class="social-icons-2" />
        <SocialIcons class="social-icons-2" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SocialIcons from "../../../icons/SocialIcons/SocialIcons.vue";
import SocialIcons1 from "../../../icons/SocialIcons1.vue";

export default defineComponent({
  name: "MacbookPro1Subsection",
  components: {
    SocialIcons,
    SocialIcons1,
  },
});
</script>

<style>
.macbook-pro-1-subsection {
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

.macbook-pro-1-subsection .simplification-2 {
  flex: 0 0 auto;
  position: relative;
}

.macbook-pro-1-subsection .frame-26 {
  align-items: center;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 22.91px;
  position: relative;
  width: 294.92px;
}

.macbook-pro-1-subsection .frame-27 {
  align-items: center;
  align-self: stretch;
  display: flex;
  flex: 0 0 auto;
  flex-direction: column;
  gap: 13.6px;
  position: relative;
  width: 100%;
}

.macbook-pro-1-subsection .frame-28 {
  align-items: center;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 17.18px;
  margin-left: -22.80px;
  margin-right: -22.80px;
  position: relative;
}

.macbook-pro-1-subsection .text-wrapper-29 {
  color: #ffffff;
  font-family: "Inter", Helvetica;
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: -0.46px;
  line-height: 11.5px;
  margin-top: -0.72px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: fit-content;
}

.macbook-pro-1-subsection .ellipse-2 {
  background-color: #ffffff;
  border-radius: 1.07px;
  height: 2.15px;
  position: relative;
  transform: rotate(180deg);
  width: 2.15px;
}

.macbook-pro-1-subsection .text-wrapper-30 {
  color: #ffffff;
  font-family: "Inter", Helvetica;
  font-size: 11.5px;
  font-weight: 400;
  letter-spacing: -0.46px;
  line-height: 11.5px;
  margin-left: -8.04px;
  margin-right: -8.04px;
  position: relative;
  text-align: center;
  white-space: nowrap;
  width: fit-content;
}

.macbook-pro-1-subsection .frame-29 {
  align-items: flex-start;
  display: inline-flex;
  flex: 0 0 auto;
  gap: 12.11px;
  position: relative;
}

.macbook-pro-1-subsection .social-icons-2 {
  height: 18.17px !important;
  position: relative !important;
  width: 18.17px !important;
}
</style>
