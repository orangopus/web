<template>
  <header class="header">
    <div class="header-background">
      <div class="stars"></div>
      <div class="stars2"></div>
      <div class="stars3"></div>
    </div>
    <img
      class="logo animate-fade-in"
      alt="Orangopus Logo"
      src="https://c.animaapp.com/bX3QfjDJ/img/simplification.svg"
    />
    <div class="header-content">
      <p class="header-subtitle animate-slide-up">
        A space for creators, developers, and dreamers to experiment, connect,
        and create without limits.
      </p>
      <h1 class="header-title animate-slide-up-delay">Unleash Your Ideas Into a Creative Cosmos</h1>
      <p class="header-description animate-slide-up-delay-2">
        Join a boundaryless, open-source universe where innovation,
        inclusivity, and collaboration collide to fuel your next big idea.
      </p>
      <div class="cta-buttons animate-fade-in-delay">
        <button class="btn btn-secondary">
          <span>Browse the Labs</span>
          <div class="btn-glow"></div>
        </button>
        <button class="btn btn-primary">
          <span>Begin Your Mission</span>
          <div class="btn-glow"></div>
        </button>
      </div>
    </div>
    <div class="contributors-info animate-fade-in-delay-2">
      <div class="contributors-avatars">
        <img
          class="avatar"
          alt="Contributor Avatar"
          src="https://c.animaapp.com/bX3QfjDJ/img/logo.svg"
        />
        <img
          class="avatar"
          alt="Contributor Avatar"
          src="https://c.animaapp.com/bX3QfjDJ/img/logo-1.svg"
        />
        <img
          class="avatar"
          alt="Contributor Avatar"
          src="https://c.animaapp.com/bX3QfjDJ/img/logo-2.svg"
        />
      </div>
      <div class="contributors-count">🎉 1000+ contributors</div>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Header",
});
</script>

<style scoped>
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 80px 20px;
  gap: 80px;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
}

.header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.stars, .stars2, .stars3 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
}

.stars {
  background-image: radial-gradient(2px 2px at 20px 30px, #eee, transparent),
                    radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                    radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                    radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                    radial-gradient(2px 2px at 160px 30px, #ddd, transparent);
  background-repeat: repeat;
  background-size: 200px 100px;
  animation: sparkle 8s linear infinite;
}

.stars2 {
  background-image: radial-gradient(2px 2px at 60px 20px, #fff, transparent),
                    radial-gradient(2px 2px at 120px 60px, rgba(255,255,255,0.8), transparent),
                    radial-gradient(1px 1px at 180px 50px, #ddd, transparent),
                    radial-gradient(1px 1px at 220px 90px, rgba(255,255,255,0.6), transparent);
  background-repeat: repeat;
  background-size: 300px 150px;
  animation: sparkle 12s linear infinite;
}

.stars3 {
  background-image: radial-gradient(1px 1px at 100px 10px, #fff, transparent),
                    radial-gradient(1px 1px at 200px 40px, rgba(255,255,255,0.8), transparent),
                    radial-gradient(1px 1px at 300px 80px, #ddd, transparent);
  background-repeat: repeat;
  background-size: 400px 200px;
  animation: sparkle 16s linear infinite;
}

@keyframes sparkle {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-100px); }
}

.logo {
  height: 30px;
  width: auto;
  filter: drop-shadow(0 0 20px rgba(255, 85, 0, 0.3));
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  max-width: 1000px;
  text-align: center;
}

.header-subtitle {
  color: #ff5500;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin: 0;
}

.header-title {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: clamp(48px, 8vw, 80px);
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1.1;
  margin: 0;
  background: linear-gradient(135deg, #ffffff 0%, #ff5500 50%, #ffffff 100%);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 3s ease-in-out infinite;
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.header-description {
  color: rgba(255, 255, 255, 0.8);
  font-family: "Manrope", Helvetica;
  font-size: clamp(18px, 3vw, 24px);
  font-weight: 400;
  line-height: 1.6;
  max-width: 700px;
  margin: 0;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}

.btn {
  position: relative;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.5px;
  padding: 18px 32px;
  border-radius: 50px;
  cursor: pointer;
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
  text-transform: uppercase;
}

.btn span {
  position: relative;
  z-index: 2;
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.btn:hover .btn-glow {
  left: 100%;
}

.btn-primary {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(255, 85, 0, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255, 85, 0, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 2px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(20px);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.contributors-info {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 15px 25px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.contributors-info:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.contributors-avatars {
  display: flex;
  align-items: center;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: -8px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.3s ease;
}

.avatar:hover {
  transform: scale(1.2);
  z-index: 10;
}

.contributors-count {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.5px;
}

/* Animations */
.animate-fade-in {
  animation: fadeIn 1s ease-out;
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out;
}

.animate-slide-up-delay {
  animation: slideUp 0.8s ease-out 0.2s both;
}

.animate-slide-up-delay-2 {
  animation: slideUp 0.8s ease-out 0.4s both;
}

.animate-fade-in-delay {
  animation: fadeIn 1s ease-out 0.6s both;
}

.animate-fade-in-delay-2 {
  animation: fadeIn 1s ease-out 0.8s both;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .header {
    padding: 60px 20px;
    gap: 60px;
  }
  
  .cta-buttons {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
