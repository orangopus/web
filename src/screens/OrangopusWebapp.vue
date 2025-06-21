<template>
  <div class="orangopus-webapp">
    <Navigation />
    <Notification ref="notification" />
    <div id="home">
      <Header />
    </div>
    <MissionStatement />
    <div id="github">
      <GitHubIntegration @share-repository="handleRepositoryShare" />
    </div>
    <div id="community">
      <SocialFeed @project-created="handleProjectCreated" />
    </div>
    <div id="projects">
      <ProjectShowcase @project-created="handleProjectCreated" />
    </div>
    <div id="team">
      <TeamSection />
    </div>
    <JourneySection />
    <div id="faq">
      <FAQSection />
    </div>
    <CTASection />
    <Footer />
    <DonateButton />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navigation from "@/components/Navigation.vue";
import Notification from "@/components/Notification.vue";
import Header from "@/components/Header.vue";
import MissionStatement from "@/components/MissionStatement.vue";
// @ts-ignore
import GitHubIntegration from "@/components/GitHubIntegration.vue";
// @ts-ignore
import SocialFeed from "@/components/SocialFeed.vue";
import ProjectShowcase from "@/components/ProjectShowcase.vue";
import TeamSection from "@/components/TeamSection.vue";
import JourneySection from "@/components/JourneySection.vue";
import FAQSection from "@/components/FAQSection.vue";
import CTASection from "@/components/CTASection.vue";
import Footer from "@/components/Footer.vue";
import DonateButton from "@/components/DonateButton.vue";

interface NotificationComponent {
  success: (title: string, message: string, duration?: number) => void;
  error: (title: string, message: string, duration?: number) => void;
  warning: (title: string, message: string, duration?: number) => void;
  info: (title: string, message: string, duration?: number) => void;
}

export default defineComponent({
  name: "OrangopusWebapp",
  components: {
    Navigation,
    Notification,
    Header,
    MissionStatement,
    GitHubIntegration,
    SocialFeed,
    ProjectShowcase,
    TeamSection,
    JourneySection,
    FAQSection,
    CTASection,
    Footer,
    DonateButton
  },
  data() {
    return {
      // Component data
    };
  },
  mounted() {
    this.initializeAnimations();
  },
  methods: {
    initializeAnimations() {
      // Initialize scroll animations
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });
    },

    handleRepositoryShare(repository: any) {
      // Handle repository sharing to social feed
      console.log('Repository shared:', repository);
      const notification = this.$refs.notification as NotificationComponent;
      if (notification) {
        notification.success(
          'Repository Shared!',
          `${repository.name} has been shared to the community feed.`
        );
      }
    },

    handleProjectCreated(project: any) {
      // Handle project creation from showcase or social feed
      console.log('Project created:', project);
      const notification = this.$refs.notification as NotificationComponent;
      if (notification) {
        notification.success(
          'Project Created!',
          `${project.title} has been added to the showcase.`
        );
      }
    }
  }
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

/* Add padding to account for fixed navigation */
#home {
  padding-top: 70px;
}

/* Light theme styles */
.light-theme {
  background-color: #ffffff;
  color: #000000;
}

.light-theme .orangopus-webapp {
  background-color: #ffffff;
}

/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: "Manrope", Helvetica, Arial, sans-serif;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  color: #ffffff;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
}

/* Animation classes */
.animate-on-scroll {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.animate-on-scroll.animate-in {
  opacity: 1;
  transform: translateY(0);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 85, 0, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 85, 0, 0.7);
}

/* Selection styles */
::selection {
  background: rgba(255, 85, 0, 0.3);
  color: #ffffff;
}

/* Focus styles */
*:focus {
  outline: 2px solid rgba(255, 85, 0, 0.5);
  outline-offset: 2px;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Loading animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Utility classes */
.text-gradient {
  background: linear-gradient(135deg, #ffffff 0%, #ff5500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glow-effect {
  box-shadow: 0 0 20px rgba(255, 85, 0, 0.3);
}

.hover-lift {
  transition: transform 0.3s ease;
}

.hover-lift:hover {
  transform: translateY(-5px);
}

/* Responsive utilities */
@media (max-width: 768px) {
  .hide-mobile {
    display: none !important;
  }
}

@media (min-width: 769px) {
  .hide-desktop {
    display: none !important;
  }
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .glass-effect {
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.5);
  }
}
</style>
