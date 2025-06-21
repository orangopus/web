<template>
  <div class="orangopus-webapp">
    <Header />
    <MissionStatement />
    <ProjectShowcase />
    <TeamSection />
    <JourneySection />
    <FAQSection />
    <CTASection />
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/components/Header.vue";
import MissionStatement from "@/components/MissionStatement.vue";
import ProjectShowcase from "@/components/ProjectShowcase.vue";
import TeamSection from "@/components/TeamSection.vue";
import JourneySection from "@/components/JourneySection.vue";
import FAQSection from "@/components/FAQSection.vue";
import CTASection from "@/components/CTASection.vue";
import Footer from "@/components/Footer.vue";

export default defineComponent({
  name: "OrangopusWebapp",
  components: {
    Header,
    MissionStatement,
    ProjectShowcase,
    TeamSection,
    JourneySection,
    FAQSection,
    CTASection,
    Footer,
  },
});
</script>

<style>
.orangopus-webapp {
  background-color: #000000;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  overflow-x: hidden;
}
</style>
