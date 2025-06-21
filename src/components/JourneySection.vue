<template>
  <section class="journey-section">
    <div class="journey-background">
      <div class="journey-stars"></div>
      <div class="journey-nebula"></div>
    </div>
    <div class="journey-content">
      <h2 class="section-title animate-on-scroll">Our Cosmic Journey</h2>
      <p class="journey-description animate-on-scroll">
        <span class="highlight">Orangopus began as a spark</span>
        — a vision to build a non-profit, open-source playground where
        creativity has no gravitational limits.
        <br /><br />
        We believe in an inclusive multiverse where creators from all
        backgrounds can launch ideas, find mentors, and collaborate freely —
        all powered by the infinite potential of open-source technology.
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "JourneySection",
  mounted() {
    this.observeElements();
  },
  methods: {
    observeElements() {
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
    }
  }
});
</script>

<style scoped>
.journey-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120px 40px;
  gap: 60px;
  position: relative;
  overflow: hidden;
  min-height: 80vh;
}

.journey-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.journey-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(1px 1px at 15% 25%, #fff, transparent),
    radial-gradient(1px 1px at 35% 75%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 55% 35%, #fff, transparent),
    radial-gradient(1px 1px at 75% 85%, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 95% 15%, #fff, transparent);
  background-size: 250px 250px, 350px 350px, 200px 200px, 300px 300px, 180px 180px;
  animation: journey-twinkle 12s ease-in-out infinite;
}

.journey-nebula {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(ellipse at 30% 40%, rgba(255, 85, 0, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse at 70% 60%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 50% 20%, rgba(255, 85, 0, 0.05) 0%, transparent 40%);
  animation: journey-drift 40s ease-in-out infinite;
}

@keyframes journey-twinkle {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

@keyframes journey-drift {
  0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
  33% { transform: translateX(-30px) translateY(-20px) rotate(1deg); }
  66% { transform: translateX(20px) translateY(30px) rotate(-1deg); }
}

.journey-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  max-width: 1000px;
  text-align: center;
}

.section-title {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: clamp(48px, 6vw, 72px);
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1.1;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #ff5500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.section-title.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.journey-description {
  color: rgba(255, 255, 255, 0.8);
  font-family: "Manrope", Helvetica;
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 400;
  letter-spacing: -0.3px;
  line-height: 1.6;
  margin: 0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.2s;
}

.journey-description.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.highlight {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
  position: relative;
}

.highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #ff5500, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.journey-description.animate-in .highlight::after {
  opacity: 1;
  animation: journey-highlight-glow 3s ease-in-out infinite;
}

@keyframes journey-highlight-glow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@media (max-width: 768px) {
  .journey-section {
    padding: 80px 20px;
    gap: 40px;
    min-height: 60vh;
  }
  
  .journey-content {
    gap: 30px;
  }
  
  .section-title {
    font-size: clamp(36px, 8vw, 56px);
  }
  
  .journey-description {
    font-size: clamp(18px, 4vw, 24px);
  }
}
</style>
