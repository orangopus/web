<template>
  <section id="press-kit" class="press-kit-section">
    <div class="press-kit-background"></div>
    <div class="press-kit-content">
      <h2 class="section-title animate-on-scroll">PressKite</h2>
      <p class="section-description">
        Everything you need to write about Orangopus. For all press inquiries, please contact us at <a href="mailto:press@orangopus.org" class="press-email">press@orangopus.org</a>.
      </p>

      <div class="kit-grid">
        <!-- About Section -->
        <div class="kit-card about-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>
          </div>
          <h3 class="card-title">About Orangopus</h3>
          <p class="card-text">
            Orangopus is a grassroots nonprofit open collective making it easier for anyone, of any background, to create projects and get support without judgment or intolerance. We are building an inclusive, global community where creativity and collaboration thrive.
          </p>
        </div>

        <!-- Logo Downloads -->
        <div class="kit-card logo-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-7 11.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/></svg>
          </div>
          <h3 class="card-title">Logos & Branding</h3>
          <p class="card-text">
            Download our official logos and branding guidelines. Please do not alter our logos in any way.
          </p>
          <div class="logo-downloads">
            <a href="https://orangopus.presskite.com" download class="download-button">PressKite</a>
          </div>
        </div>

        <!-- Key Facts -->
        <div class="kit-card facts-card">
          <div class="card-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
          </div>
          <h3 class="card-title">Key Facts</h3>
          <ul class="facts-list">
            <li><span class="fact-label">Founded:</span> 2019</li>
            <li><span class="fact-label">Type:</span> Nonprofit Open Collective</li>
            <li><span class="fact-label">Community:</span> 35+ Creators</li>
            <li><span class="fact-label">Projects:</span> 25+ Hosted</li>
            <li><span class="fact-label">Mission:</span> To empower everyone to create without limits.</li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PressKitSection",
});
</script>

<style scoped>
.press-kit-section {
  padding: 100px 40px;
  background: linear-gradient(180deg, #0a0a0a 0%, #111111 100%);
  position: relative;
  overflow: hidden;
}
.press-kit-background {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(circle at 15% 85%, rgba(255, 85, 0, 0.1), transparent 30%);
  z-index: 1;
}
.press-kit-content {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  text-align: center;
}
.section-title {
  font-size: 3rem;
  font-weight: 700;
  color: #fff;
  margin-bottom: 20px;
}
.section-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
  max-width: 700px;
  margin: 0 auto 60px auto;
}
.press-email {
  color: #ff5500;
  text-decoration: none;
  transition: color 0.3s;
}
.press-email:hover {
  text-decoration: underline;
}
.kit-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  text-align: left;
}
.kit-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 30px;
  transition: all 0.3s ease;
}
.kit-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 85, 0, 0.3);
}
.card-icon {
  color: #ff5500;
  width: 40px;
  height: 40px;
  margin-bottom: 20px;
}
.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 15px;
}
.card-text {
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
}
.logo-downloads {
  margin-top: 20px;
  display: flex;
  gap: 15px;
}
.download-button {
  background: rgba(255, 85, 0, 0.2);
  color: #ff5500;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
}
.download-button:hover {
  background: #ff5500;
  color: #fff;
}
.facts-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.facts-list li {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 10px;
}
.fact-label {
  font-weight: 600;
  color: #fff;
}
</style> 