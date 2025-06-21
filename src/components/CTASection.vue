<template>
  <section class="cta-section">
    <div class="cta-background">
      <div class="pulse-rings">
        <div class="ring ring-1"></div>
        <div class="ring ring-2"></div>
        <div class="ring ring-3"></div>
      </div>
      <div class="energy-waves">
        <div class="wave wave-1"></div>
        <div class="wave wave-2"></div>
        <div class="wave wave-3"></div>
      </div>
    </div>
    <div class="cta-content">
      <h2 class="cta-title animate-on-scroll">Ready to Join the Open-Source Frontier?</h2>
      <p class="cta-description animate-on-scroll">
        Build freely. Collaborate globally. Launch fearlessly. Orangopus is
        your creative command center.
      </p>
      <div class="cta-buttons animate-on-scroll">
        <button class="btn btn-secondary">
          <span>Join Our Discord</span>
          <div class="btn-particles"></div>
        </button>
        <button class="btn btn-primary">
          <span>Start Building Now</span>
          <div class="btn-particles"></div>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "CTASection",
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
.cta-section {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120px 40px;
  position: relative;
  overflow: hidden;
  min-height: 80vh;
}

.cta-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.1) 0%, rgba(0, 0, 0, 0.8) 50%, rgba(255, 85, 0, 0.1) 100%);
  border-radius: 30px;
  overflow: hidden;
}

.pulse-rings {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid rgba(255, 85, 0, 0.3);
  border-radius: 50%;
  animation: pulse 3s ease-in-out infinite;
}

.ring-1 {
  width: 200px;
  height: 200px;
  animation-delay: 0s;
}

.ring-2 {
  width: 300px;
  height: 300px;
  animation-delay: 1s;
}

.ring-3 {
  width: 400px;
  height: 400px;
  animation-delay: 2s;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.8;
  }
}

.energy-waves {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.wave {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 85, 0, 0.1), transparent);
  animation: wave-flow 4s ease-in-out infinite;
}

.wave-1 {
  animation-delay: 0s;
}

.wave-2 {
  animation-delay: 1.33s;
}

.wave-3 {
  animation-delay: 2.66s;
}

@keyframes wave-flow {
  0% {
    transform: translateX(-100%) translateY(0);
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    transform: translateX(100%) translateY(0);
    opacity: 0;
  }
}

.cta-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
  max-width: 800px;
  text-align: center;
}

.cta-title {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: clamp(36px, 5vw, 60px);
  font-weight: 700;
  letter-spacing: -1px;
  line-height: 1.2;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #ff5500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.cta-title.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.cta-description {
  color: rgba(255, 255, 255, 0.8);
  font-family: "Manrope", Helvetica;
  font-size: clamp(18px, 2.5vw, 24px);
  font-weight: 400;
  letter-spacing: -0.3px;
  line-height: 1.5;
  margin: 0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.2s;
}

.cta-description.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.cta-buttons {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.4s;
}

.cta-buttons.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.btn {
  position: relative;
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 20px 40px;
  border-radius: 50px;
  cursor: pointer;
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
  text-transform: uppercase;
  min-width: 200px;
}

.btn span {
  position: relative;
  z-index: 2;
}

.btn-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.3), transparent),
    radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,0.2), transparent);
  background-size: 50px 50px, 30px 30px;
  animation: particle-float 3s ease-in-out infinite;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn:hover .btn-particles {
  opacity: 1;
}

@keyframes particle-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.btn-primary {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  box-shadow: 0 10px 40px rgba(255, 85, 0, 0.4);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 50px rgba(255, 85, 0, 0.6);
  background: linear-gradient(135deg, #ff7a00 0%, #ff5500 100%);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-3px);
  box-shadow: 0 15px 50px rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .cta-section {
    padding: 80px 20px;
    min-height: 60vh;
  }
  
  .cta-content {
    gap: 30px;
  }
  
  .cta-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
  
  .btn {
    width: 100%;
    min-width: auto;
    padding: 18px 30px;
    font-size: 16px;
  }
  
  .ring-1 { width: 150px; height: 150px; }
  .ring-2 { width: 200px; height: 200px; }
  .ring-3 { width: 250px; height: 250px; }
}
</style>
