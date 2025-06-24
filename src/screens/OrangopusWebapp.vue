<template>
  <div class="orangopus-webapp">
    <!-- Auth Page View -->
    <AuthPage 
      v-if="showAuth" 
      :initial-mode="authMode" 
      @close="showAuth = false" 
      @success="handleAuthSuccess"
      @resend-success="handleResendSuccess"
    />
    
    <!-- Main App Content -->
    <div v-else>
      <Navigation 
        @navigate-to-dashboard="showDashboard = true" 
        @navigate-to-profile="showProfile = true"
        @show-auth="showAuthPage"
      />
      <Notification ref="notification" />
      
      <!-- Landing Page View -->
      <div v-if="!showDashboard && !showProfile" class="landing-page">
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
        <PressKitSection />
        <CTASection />
        <Footer />
        <DonateButton />
      </div>
      
      <!-- Dashboard View -->
      <div v-else-if="showDashboard" class="dashboard-view">
        <div class="dashboard-header">
          <button @click="showDashboard = false" class="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </button>
        </div>
        <Dashboard @project-created="handleProjectCreated" />
      </div>
      
      <!-- Profile View -->
      <div v-else-if="showProfile" class="profile-view">
        <div class="profile-header">
          <button @click="showProfile = false" class="back-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </button>
        </div>
        <UserProfile @profile-updated="handleProfileUpdated" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { authService, AuthState } from "@/services/authService";
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
// @ts-ignore
import DonateButton from "@/components/DonateButton.vue";
import Dashboard from "@/components/Dashboard.vue";
import UserProfile from "@/components/UserProfile.vue";
import AuthPage from "@/components/AuthPage.vue";
import PressKitSection from "@/components/PressKitSection.vue";

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
    DonateButton,
    Dashboard,
    UserProfile,
    AuthPage,
    PressKitSection
  },
  data() {
    return {
      showAuth: false,
      authMode: 'login' as 'login' | 'signup',
      showDashboard: false,
      showProfile: false,
      authState: {
        user: null,
        loading: false,
        error: null
      } as AuthState,
      unsubscribe: () => {}
    };
  },
  mounted() {
    this.initializeAnimations();
    this.handleUrlParameters();
    
    // Subscribe to auth state changes
    this.unsubscribe = authService.subscribe((state) => {
      this.authState = state;
    });
  },
  beforeUnmount() {
    this.unsubscribe();
  },
  methods: {
    showAuthPage(mode: 'login' | 'signup' = 'login') {
      this.authMode = mode;
      this.showAuth = true;
    },
    
    handleAuthSuccess() {
      this.showAuth = false;
      const notification = this.$refs.notification as NotificationComponent;
      if (notification) {
        notification.success(
          'Welcome!',
          'You have successfully signed in to Orangopus.'
        );
      }
    },

    handleResendSuccess() {
      const notification = this.$refs.notification as NotificationComponent;
      if (notification) {
        notification.success(
          'Email Sent!',
          'A new confirmation email has been sent to your inbox.'
        );
      }
    },

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
    },
    
    handleProfileUpdated(user: any) {
      // Handle profile updates
      console.log('Profile updated:', user);
      const notification = this.$refs.notification as NotificationComponent;
      if (notification) {
        notification.success(
          'Profile Updated!',
          'Your profile has been updated successfully.'
        );
      }
    },

    handleUrlParameters() {
      // Handle URL parameters for authentication errors (both query params and hash)
      const urlParams = new URLSearchParams(window.location.search);
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      
      // Check query parameters first
      let error = urlParams.get('error');
      let errorCode = urlParams.get('error_code');
      let errorDescription = urlParams.get('error_description');
      
      // If not found in query params, check hash params
      if (!error) {
        error = hashParams.get('error');
        errorCode = hashParams.get('error_code');
        errorDescription = hashParams.get('error_description');
      }
      
      if (error) {
        const notification = this.$refs.notification as NotificationComponent;
        if (notification) {
          let message = error;
          if (errorCode === 'otp_expired') {
            message = 'The email confirmation link has expired. Please try signing up again.';
          } else if (errorDescription) {
            message = decodeURIComponent(errorDescription);
          }
          
          notification.error(
            'Authentication Error',
            message
          );
        }
        
        // Clear the URL parameters to prevent showing the error again
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
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

/* Loading animations */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ff5500;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Dashboard and Profile Views */
.dashboard-view,
.profile-view {
  padding-top: 70px;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
}

.dashboard-header,
.profile-header {
  position: fixed;
  top: 70px;
  left: 0;
  right: 0;
  z-index: 999;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 40px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 16px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateX(-4px);
}

.back-button svg {
  width: 18px;
  height: 18px;
}

/* Landing Page */
.landing-page {
  display: flex;
  flex-direction: column;
}

/* Responsive Design */
@media (max-width: 768px) {
  .dashboard-header,
  .profile-header {
    padding: 12px 20px;
  }
  
  .back-button {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .back-button svg {
    width: 16px;
    height: 16px;
  }
}
</style>
