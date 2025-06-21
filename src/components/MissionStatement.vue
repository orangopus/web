<template>
  <section class="mission-statement">
    <div class="mission-background">
      <div class="mission-particles"></div>
    </div>
    <div class="mission-content">
      <p class="mission-text animate-on-scroll">
        We're a <span class="highlight">100% open-source, non-profit collective</span> pushing the boundaries
        of what's possible in project creation.
        <br /><br />
        No gatekeepers. No agendas. Just ideas, experimentation, and a
        shared mission to make innovation accessible to all.
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "MissionStatement",
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
.mission-statement {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 40px;
  position: relative;
  overflow: hidden;
  min-height: 60vh;
}

.mission-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.mission-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(255, 85, 0, 0.2), transparent),
    radial-gradient(1px 1px at 60% 70%, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(3px 3px at 80% 20%, rgba(255, 85, 0, 0.15), transparent),
    radial-gradient(1px 1px at 40% 80%, rgba(255, 255, 255, 0.08), transparent);
  background-size: 400px 400px, 300px 300px, 500px 500px, 200px 200px;
  animation: mission-float 25s ease-in-out infinite;
}

@keyframes mission-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(0.5deg); }
  66% { transform: translateY(10px) rotate(-0.5deg); }
}

.mission-content {
  position: relative;
  z-index: 1;
  max-width: 900px;
  text-align: center;
}

.mission-text {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: clamp(24px, 3vw, 36px);
  font-weight: 400;
  letter-spacing: -0.5px;
  line-height: 1.6;
  margin: 0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.mission-text.animate-in {
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

.mission-text.animate-in .highlight::after {
  opacity: 1;
  animation: highlight-glow 2s ease-in-out infinite;
}

@keyframes highlight-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@media (max-width: 768px) {
  .mission-statement {
    padding: 80px 20px;
    min-height: 50vh;
  }
  
  .mission-text {
    font-size: clamp(20px, 4vw, 28px);
  }
}
</style>
