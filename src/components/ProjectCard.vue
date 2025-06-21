<template>
  <div class="project-card">
    <div class="project-header">
      <div class="language-tag">
        <VuesaxBulkHashtag2 class="icon" />
        <span>{{ project.language || 'Unknown' }}</span>
      </div>
    </div>
    <div class="project-content">
      <div class="project-name">
        <VuesaxBulkCode4 class="icon" />
        <h3>{{ project.name }}</h3>
      </div>
      <p class="project-description">{{ project.description || 'No description available' }}</p>
    </div>
    <div class="project-footer">
      <div class="project-stats">
        <div class="stat">
          <VuesaxBulkStar3 class="icon" />
          <span>{{ project.stars }}</span>
        </div>
        <div class="stat">
          <VuesaxBulkHierarchy2 class="icon" />
          <span>{{ project.forks }}</span>
        </div>
      </div>
      <a :href="project.repoUrl" target="_blank" rel="noopener noreferrer" class="repo-link">
        View Repository
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import VuesaxBulkCode4 from "../icons/VuesaxBulkCode4/VuesaxBulkCode4.vue";
import VuesaxBulkHashtag2 from "../icons/VuesaxBulkHashtag2.vue";
import VuesaxBulkHierarchy2 from "../icons/VuesaxBulkHierarchy2/VuesaxBulkHierarchy2.vue";
import VuesaxBulkStar3 from "../icons/VuesaxBulkStar3/VuesaxBulkStar3.vue";

interface Project {
  id: number;
  language: string | null;
  name: string;
  description: string | null;
  stars: number;
  forks: number;
  repoUrl: string;
}

export default defineComponent({
  name: "ProjectCard",
  components: {
    VuesaxBulkCode4,
    VuesaxBulkHashtag2,
    VuesaxBulkHierarchy2,
    VuesaxBulkStar3,
  },
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true,
    },
  },
});
</script>

<style scoped>
.project-card {
  position: relative;
  backdrop-filter: blur(89.42px);
  border: 1.84px solid rgba(255, 255, 255, 0.11);
  border-radius: 43.98px;
  display: flex;
  flex-direction: column;
  gap: 43.98px;
  overflow: hidden;
  padding: 53.15px;
  width: 608px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
}

.project-card:hover {
  transform: translateY(-5px);
  border-color: rgba(255, 85, 0, 0.3);
  box-shadow: 0 20px 40px rgba(255, 85, 0, 0.1);
}

.project-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('https://c.animaapp.com/bX3QfjDJ/img/frame-36729.png');
  background-size: cover;
  background-position: center;
  opacity: 0.1;
  z-index: -1;
}

.project-card::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 85, 0, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  z-index: -1;
}

.project-header, .project-content, .project-footer {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 5.73px;
}

.language-tag, .project-name, .project-stats {
  display: flex;
  align-items: center;
  gap: 5.73px;
}

.language-tag {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 715.82px;
  padding: 5.73px 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.language-tag span {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.42px;
}

.icon {
  width: 31.49px;
  height: 31.49px;
  flex-shrink: 0;
}

.project-name h3 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 36.61px;
  font-weight: 500;
  letter-spacing: -1.10px;
  line-height: 44.03px;
  margin: 0;
}

.project-description {
  color: rgba(255, 255, 255, 0.5);
  font-family: "Manrope", Helvetica;
  font-size: 25.6px;
  font-weight: 400;
  letter-spacing: -0.77px;
  line-height: 30.72px;
  margin: 0;
}

.project-footer {
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.project-stats {
  gap: 11.45px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5.73px;
  background-color: rgba(255, 255, 255, 0.05);
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat span {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.48px;
  line-height: 19.2px;
}

.repo-link {
  color: #ff5500;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.48px;
  line-height: 19.2px;
  text-decoration: none;
  padding: 12px 20px;
  border: 1px solid #ff5500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.repo-link:hover {
  background-color: #ff5500;
  color: #ffffff;
  text-decoration: none;
}

@media (max-width: 768px) {
  .project-card {
    width: 100%;
    max-width: 500px;
    padding: 30px;
    gap: 30px;
  }
  
  .project-name h3 {
    font-size: 28px;
    line-height: 34px;
  }
  
  .project-description {
    font-size: 20px;
    line-height: 24px;
  }
  
  .project-footer {
    flex-direction: column;
    gap: 20px;
    align-items: stretch;
  }
}
</style>
