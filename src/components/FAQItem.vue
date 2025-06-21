<template>
  <div class="faq-item">
    <div class="faq-question" @click="toggleAnswer">
      <span>{{ question }}</span>
      <div class="chevron-container">
        <ChevronUp2 v-if="!isOpen" class="chevron" />
        <ChevronUp3 v-else class="chevron" />
      </div>
    </div>
    <div class="faq-answer-container" :class="{ 'open': isOpen }">
      <p class="faq-answer">{{ answer }}</p>
    </div>
    <div class="faq-divider"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ChevronUp2 from "../icons/ChevronUp2.vue";
import ChevronUp3 from "../icons/ChevronUp3.vue";

export default defineComponent({
  name: "FAQItem",
  components: {
    ChevronUp2,
    ChevronUp3,
  },
  props: {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    toggleAnswer() {
      this.isOpen = !this.isOpen;
    },
  },
});
</script>

<style scoped>
.faq-item {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.faq-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 85, 0, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(255, 85, 0, 0.1);
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.3px;
  line-height: 1.4;
  cursor: pointer;
  padding: 24px 30px;
  transition: all 0.3s ease;
  position: relative;
}

.faq-question:hover {
  background: rgba(255, 85, 0, 0.1);
}

.faq-question span {
  flex: 1;
  margin-right: 20px;
}

.chevron-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.faq-item:hover .chevron-container {
  background: rgba(255, 85, 0, 0.2);
  transform: scale(1.1);
}

.chevron {
  width: 16px;
  height: 16px;
  transition: all 0.3s ease;
  filter: brightness(0) invert(1);
}

.faq-item:hover .chevron {
  filter: brightness(1) invert(0);
}

.faq-answer-container {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease, padding 0.3s ease;
  background: rgba(255, 255, 255, 0.02);
}

.faq-answer-container.open {
  max-height: 200px;
  padding: 0 30px 24px;
}

.faq-answer {
  color: rgba(255, 255, 255, 0.8);
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 400;
  letter-spacing: -0.2px;
  line-height: 1.6;
  margin: 0;
  padding-top: 16px;
}

.faq-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  margin: 0 30px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.faq-item:hover .faq-divider {
  opacity: 1;
}

@media (max-width: 768px) {
  .faq-question {
    font-size: 16px;
    padding: 20px 24px;
  }
  
  .faq-answer-container.open {
    padding: 0 24px 20px;
  }
  
  .faq-answer {
    font-size: 15px;
  }
  
  .chevron-container {
    width: 28px;
    height: 28px;
  }
  
  .chevron {
    width: 14px;
    height: 14px;
  }
}
</style>
