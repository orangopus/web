<template>
  <nav class="navigation" :class="{ 'scrolled': isScrolled }">
    <div class="nav-content">
      <div class="nav-brand">
        <img src="https://c.animaapp.com/bX3QfjDJ/img/simplification.svg" alt="Orangopus" class="nav-logo" />
      </div>
      
      <div class="nav-links">
        <a 
          v-for="link in navLinks" 
          :key="link.id"
          :href="link.href"
          @click="scrollToSection(link.href)"
          class="nav-link"
          :class="{ 'active': activeSection === link.id }"
        >
          {{ link.name }}
        </a>
      </div>
      
      <div class="nav-actions">
        <button @click="toggleTheme" class="theme-toggle">
          <span v-if="isDarkTheme">🌙</span>
          <span v-else>☀️</span>
        </button>
        <button @click="scrollToTop" class="scroll-top" :class="{ 'visible': showScrollTop }">
          <svg viewBox="0 0 24 24" fill="currentColor" class="scroll-icon">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
          </svg>
        </button>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface NavLink {
  id: string;
  name: string;
  href: string;
}

export default defineComponent({
  name: "Navigation",
  data() {
    return {
      isScrolled: false,
      activeSection: "home",
      showScrollTop: false,
      isDarkTheme: true,
      navLinks: [
        { id: "home", name: "Home", href: "#home" },
        { id: "github", name: "GitHub", href: "#github" },
        { id: "community", name: "Community", href: "#community" },
        { id: "projects", name: "Projects", href: "#projects" },
        { id: "team", name: "Team", href: "#team" },
        { id: "faq", name: "FAQ", href: "#faq" }
      ] as NavLink[]
    };
  },
  mounted() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
    this.observeSections();
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  methods: {
    handleScroll() {
      this.isScrolled = window.scrollY > 100;
      this.showScrollTop = window.scrollY > 500;
    },
    
    scrollToSection(href: string) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    },
    
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    },
    
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme;
      document.body.classList.toggle('light-theme', !this.isDarkTheme);
    },
    
    observeSections() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            if (id) {
              this.activeSection = id;
            }
          }
        });
      }, { 
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
      });

      // Observe all sections
      this.navLinks.forEach(link => {
        const element = document.querySelector(link.href);
        if (element) {
          observer.observe(element);
        }
      });
    }
  }
});
</script>

<style scoped>
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.navigation.scrolled {
  background: rgba(0, 0, 0, 0.93);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.nav-logo {
  height: 32px;
  width: auto;
  filter: drop-shadow(0 0 10px rgba(255, 85, 0, 0.3));
  transition: all 0.3s ease;
}

.nav-brand:hover .nav-logo {
  filter: drop-shadow(0 0 15px rgba(255, 85, 0, 0.5));
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-link {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  cursor: pointer;
}

.nav-link:hover {
  color: #ffffff;
}

.nav-link.active {
  color: #ff5500;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  border-radius: 1px;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.theme-toggle {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.scroll-top {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
}

.scroll-top.visible {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.scroll-top:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3);
}

.scroll-icon {
  width: 16px;
  height: 16px;
}

@media (max-width: 768px) {
  .nav-content {
    padding: 0 20px;
  }
  
  .nav-links {
    display: none;
  }
  
  .nav-actions {
    gap: 10px;
  }
  
  .theme-toggle, .scroll-top {
    padding: 6px 10px;
  }
}

/* Light theme styles */
.light-theme .navigation {
  background: rgba(255, 255, 255, 0.88);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.light-theme .navigation.scrolled {
  background: rgba(255, 255, 255, 0.93);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.light-theme .nav-link {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .nav-link:hover {
  color: #000000;
}

.light-theme .nav-link.active {
  color: #ff5500;
}

.light-theme .theme-toggle {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #000000;
}

.light-theme .theme-toggle:hover {
  background: rgba(0, 0, 0, 0.2);
  border-color: rgba(0, 0, 0, 0.3);
}
</style> 