<template>
  <footer class="footer">
    <div class="footer-background">
      <div class="footer-particles"></div>
    </div>
    <div class="footer-content">
      <div class="footer-main">
        <div class="footer-brand">
          <img
            class="logo"
            alt="Orangopus Logo"
            src="https://c.animaapp.com/bX3QfjDJ/img/simplification-1.svg"
          />
          <p class="brand-description">
            Pushing the boundaries of open-source innovation and creative collaboration.
          </p>
        </div>
        <div class="footer-links">
          <div class="link-group">
            <h3>Community</h3>
            <a href="#" class="footer-link">Discord</a>
            <a href="#" class="footer-link">GitHub</a>
            <a href="#" class="footer-link">Blog</a>
          </div>
          <div class="link-group">
            <h3>Support</h3>
            <a href="#" class="footer-link">Donate</a>
            <a href="#" class="footer-link">Help Center</a>
            <a href="#" class="footer-link">Contact</a>
          </div>
          <div class="link-group">
            <h3>Resources</h3>
            <a href="#" class="footer-link">Documentation</a>
            <a href="#" class="footer-link">API</a>
            <a href="#" class="footer-link">Tutorials</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="copyright">© Orangopus 2125 - All rights reserved across the galaxy.</p>
        <div class="social-icons">
          <a href="#" class="social-icon" title="Twitter">
            <img src="https://c.animaapp.com/bX3QfjDJ/img/social-icons-1.svg" alt="Twitter" />
            <div class="icon-glow"></div>
          </a>
          <a href="#" class="social-icon" title="Discord">
            <img src="https://c.animaapp.com/bX3QfjDJ/img/social-icons.svg" alt="Discord" />
            <div class="icon-glow"></div>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
});
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  padding: 80px 40px 40px;
  color: #ffffff;
  position: relative;
  overflow: hidden;
}

.footer-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.footer-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(1px 1px at 10% 20%, rgba(255, 85, 0, 0.3), transparent),
    radial-gradient(1px 1px at 30% 80%, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(2px 2px at 70% 40%, rgba(255, 85, 0, 0.2), transparent),
    radial-gradient(1px 1px at 90% 60%, rgba(255, 255, 255, 0.1), transparent);
  background-size: 300px 300px, 200px 200px, 400px 400px, 250px 250px;
  animation: footer-float 15s ease-in-out infinite;
}

@keyframes footer-float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.footer-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-main {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 60px;
  margin-bottom: 60px;
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.logo {
  height: 30px;
  width: auto;
  filter: drop-shadow(0 0 20px rgba(255, 85, 0, 0.3));
}

.brand-description {
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  max-width: 300px;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.link-group h3 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 20px 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.footer-link {
  display: block;
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 400;
  text-decoration: none;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  position: relative;
}

.footer-link:hover {
  color: #ff5500;
  transform: translateX(5px);
}

.footer-link::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #ff5500, transparent);
  transition: width 0.3s ease;
  transform: translateY(-50%);
}

.footer-link:hover::before {
  width: 8px;
}

.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.copyright {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
}

.social-icons {
  display: flex;
  gap: 20px;
}

.social-icon {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transition: all 0.3s ease;
  overflow: hidden;
}

.social-icon:hover {
  background: rgba(255, 85, 0, 0.2);
  border-color: rgba(255, 85, 0, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 85, 0, 0.3);
}

.social-icon img {
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
  transition: all 0.3s ease;
  z-index: 2;
  position: relative;
}

.social-icon:hover img {
  filter: brightness(1) invert(0);
}

.icon-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle, rgba(255, 85, 0, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.social-icon:hover .icon-glow {
  opacity: 1;
}

@media (max-width: 768px) {
  .footer {
    padding: 60px 20px 30px;
  }
  
  .footer-main {
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 40px;
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .social-icons {
    gap: 15px;
  }
  
  .social-icon {
    width: 45px;
    height: 45px;
  }
  
  .social-icon img {
    width: 20px;
    height: 20px;
  }
}
</style>
