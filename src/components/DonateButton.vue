<template>
  <div class="donate-button-container" :class="{ 'expanded': isExpanded }">
    <div class="donate-button" @click="toggleExpand">
      <div class="donate-icon">
        <svg viewBox="0 0 24 24" fill="currentColor" class="heart-icon">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
      </div>
      <span class="donate-text">Support Us</span>
    </div>
    
    <div class="donate-panel" v-if="isExpanded">
      <div class="panel-header">
        <h3>Support Orangopus</h3>
        <button @click="toggleExpand" class="close-btn">
          <svg viewBox="0 0 24 24" fill="currentColor" class="close-icon">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      
      <div class="panel-content">
        <p class="support-text">
          Help us continue building amazing tools for developers. Your support enables us to:
        </p>
        
        <ul class="benefits-list">
          <li>✨ Keep the platform free and open source</li>
          <li>🚀 Add new features and improvements</li>
          <li>🛠️ Maintain and support the community</li>
          <li>📚 Create educational content and tutorials</li>
        </ul>
        
        <div class="donation-options">
          <div class="donation-amounts">
            <button 
              v-for="amount in donationAmounts" 
              :key="amount"
              @click="selectAmount(amount)"
              class="amount-btn"
              :class="{ 'selected': selectedAmount === amount }"
            >
              ${{ amount }}
            </button>
          </div>
          
          <div class="custom-amount">
            <label for="custom-amount">Custom Amount:</label>
            <input 
              id="custom-amount"
              v-model="customAmount"
              type="number"
              min="1"
              placeholder="Enter amount"
              class="custom-input"
              @input="selectCustomAmount"
            />
          </div>
        </div>
        
        <a 
          :href="opencollectiveUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="donate-link"
          @click="handleDonate"
        >
          <div class="donate-cta">
            <span class="cta-text">Donate via OpenCollective</span>
            <svg viewBox="0 0 24 24" fill="currentColor" class="external-icon">
              <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
            </svg>
          </div>
        </a>
        
        <div class="donation-info">
          <p>💝 All donations are processed securely through OpenCollective</p>
          <p>🔒 Your information is protected and never shared</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DonateButton",
  data() {
    return {
      isExpanded: false,
      selectedAmount: 10,
      customAmount: "",
      donationAmounts: [5, 10, 25, 50, 100],
      opencollectiveUrl: "https://opencollective.com/orangopus"
    };
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
    },
    
    selectAmount(amount: number) {
      this.selectedAmount = amount;
      this.customAmount = "";
    },
    
    selectCustomAmount() {
      if (this.customAmount) {
        this.selectedAmount = parseInt(this.customAmount);
      }
    },
    
    handleDonate() {
      // Add analytics tracking if needed
      console.log('Donate clicked:', this.selectedAmount);
      
      // Close the panel after a short delay
      setTimeout(() => {
        this.isExpanded = false;
      }, 100);
    }
  }
});
</script>

<style scoped>
.donate-button-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  font-family: "Manrope", Helvetica, Arial, sans-serif;
}

.donate-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3);
  transition: all 0.3s ease;
  border: none;
  font-weight: 600;
  font-size: 14px;
}

.donate-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 35px rgba(255, 85, 0, 0.4);
}

.donate-icon {
  display: flex;
  align-items: center;
}

.heart-icon {
  width: 18px;
  height: 18px;
  animation: heartbeat 2s ease-in-out infinite;
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.donate-text {
  white-space: nowrap;
}

.donate-panel {
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 320px;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.panel-header h3 {
  color: #ffffff;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.1);
}

.close-icon {
  width: 20px;
  height: 20px;
}

.support-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.benefits-list {
  list-style: none;
  padding: 0;
  margin: 0 0 20px 0;
}

.benefits-list li {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.donation-options {
  margin-bottom: 20px;
}

.donation-amounts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-bottom: 16px;
}

.amount-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  font-weight: 500;
}

.amount-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.amount-btn.selected {
  background: rgba(255, 85, 0, 0.2);
  border-color: rgba(255, 85, 0, 0.4);
  color: #ff5500;
}

.custom-amount {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.custom-amount label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
  font-weight: 500;
}

.custom-input {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  color: #ffffff;
  font-size: 14px;
  transition: all 0.3s ease;
}

.custom-input:focus {
  outline: none;
  border-color: rgba(255, 85, 0, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.custom-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.donate-link {
  text-decoration: none;
  display: block;
  margin-bottom: 16px;
}

.donate-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  padding: 14px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.donate-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3);
}

.external-icon {
  width: 16px;
  height: 16px;
}

.donation-info {
  text-align: center;
}

.donation-info p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  margin: 4px 0;
  line-height: 1.4;
}

/* Light theme support */
.light-theme .donate-panel {
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.light-theme .panel-header h3 {
  color: #000000;
}

.light-theme .support-text {
  color: rgba(0, 0, 0, 0.8);
}

.light-theme .benefits-list li {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .amount-btn {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: rgba(0, 0, 0, 0.8);
}

.light-theme .amount-btn:hover {
  background: rgba(0, 0, 0, 0.15);
  color: #000000;
}

.light-theme .custom-input {
  background: rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #000000;
}

.light-theme .custom-input::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.light-theme .donation-info p {
  color: rgba(0, 0, 0, 0.6);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .donate-button-container {
    bottom: 20px;
    right: 20px;
  }
  
  .donate-panel {
    width: 280px;
    right: -20px;
  }
  
  .donation-amounts {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .donate-text {
    display: none;
  }
  
  .donate-button {
    padding: 12px;
    border-radius: 50%;
  }
}

@media (max-width: 480px) {
  .donate-panel {
    width: calc(100vw - 40px);
    right: -20px;
  }
}
</style> 