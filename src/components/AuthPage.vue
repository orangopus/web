<template>
  <div class="auth-page">
    <div class="auth-background">
      <div class="auth-particles"></div>
    </div>
    
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <div class="logo-section">
            <img src="https://c.animaapp.com/bX3QfjDJ/img/simplification.svg" alt="Orangopus" class="auth-logo" />
            <h1 class="auth-title">Welcome to Orangopus</h1>
            <p class="auth-subtitle">Join our inclusive community of creators</p>
          </div>
          
          <button @click="$emit('close')" class="close-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="auth-tabs">
          <button 
            @click="isLogin = true" 
            :class="['tab-button', { active: isLogin }]"
          >
            Sign In
          </button>
          <button 
            @click="isLogin = false" 
            :class="['tab-button', { active: !isLogin }]"
          >
            Sign Up
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="Enter your email"
              :disabled="authState.loading"
            />
          </div>

          <div v-if="!isLogin" class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Enter your full name"
              :disabled="authState.loading"
            />
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              placeholder="Enter your password"
              :disabled="authState.loading"
            />
          </div>

          <div v-if="authState.error" class="error-message">
            {{ authState.error }}
          </div>

          <button 
            type="submit" 
            class="submit-button"
            :disabled="authState.loading"
          >
            <span v-if="authState.loading" class="loading-spinner"></span>
            {{ authState.loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account') }}
          </button>
        </form>

        <div class="auth-footer">
          <p v-if="isLogin">
            Don't have an account? 
            <button @click="isLogin = false" class="link-button">Sign up</button>
          </p>
          <p v-else>
            Already have an account? 
            <button @click="isLogin = true" class="link-button">Sign in</button>
          </p>
        </div>
        
        <div class="auth-features">
          <div class="feature">
            <div class="feature-icon">🤝</div>
            <span>Inclusive Community</span>
          </div>
          <div class="feature">
            <div class="feature-icon">🔓</div>
            <span>100% Free & Open</span>
          </div>
          <div class="feature">
            <div class="feature-icon">💡</div>
            <span>No Judgement Zone</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { authService, AuthState } from "@/services/authService";

interface FormData {
  email: string;
  password: string;
  name: string;
}

export default defineComponent({
  name: "AuthPage",
  props: {
    initialMode: {
      type: String,
      default: 'login',
      validator: (value: string) => ['login', 'signup'].includes(value)
    }
  },
  data() {
    return {
      isLogin: this.initialMode === 'login',
      form: {
        email: '',
        password: '',
        name: ''
      } as FormData,
      authState: {
        user: null,
        loading: false,
        error: null
      } as AuthState,
      unsubscribe: () => {}
    };
  },
  watch: {
    initialMode(newMode: string) {
      this.isLogin = newMode === 'login';
    }
  },
  mounted() {
    this.unsubscribe = authService.subscribe((state) => {
      this.authState = state;
      if (state.user) {
        this.$emit('success');
      }
    });
  },
  beforeUnmount() {
    this.unsubscribe();
  },
  methods: {
    async handleSubmit() {
      if (this.isLogin) {
        const result = await authService.signIn(this.form.email, this.form.password);
        if (result.success) {
          this.$emit('success');
        }
      } else {
        const result = await authService.signUp(this.form.email, this.form.password, this.form.name);
        if (result.success) {
          this.$emit('success');
        }
      }
    }
  }
});
</script>

<style scoped>
.auth-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  overflow-y: auto;
  padding: 20px;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.auth-particles {
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
  animation: auth-float 25s ease-in-out infinite;
}

@keyframes auth-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(0.5deg); }
  66% { transform: translateY(10px) rotate(-0.5deg); }
}

.auth-container {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.auth-card {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(20px);
  animation: cardSlideIn 0.5s ease;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.auth-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.logo-section {
  text-align: center;
  flex: 1;
}

.auth-logo {
  height: 40px;
  width: auto;
  margin-bottom: 16px;
  filter: drop-shadow(0 0 15px rgba(255, 85, 0, 0.5));
}

.auth-title {
  font-family: "Manrope", Helvetica;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #ffffff 0%, #ff5500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-subtitle {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.close-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 12px;
  border-radius: 12px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  transform: scale(1.05);
}

.close-button svg {
  width: 20px;
  height: 20px;
}

.auth-tabs {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 6px;
  margin-bottom: 32px;
}

.tab-button {
  flex: 1;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  padding: 14px 20px;
  border-radius: 8px;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-button.active {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(255, 85, 0, 0.3);
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.form-group input {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px 20px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #ff5500;
  background: rgba(255, 85, 0, 0.05);
  box-shadow: 0 0 0 4px rgba(255, 85, 0, 0.1);
}

.form-group input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-group input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.error-message {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #ff3b30;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  text-align: center;
}

.submit-button {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 18px;
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(255, 85, 0, 0.4);
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.auth-footer {
  text-align: center;
  margin-bottom: 32px;
}

.auth-footer p {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.link-button {
  background: none;
  border: none;
  color: #ff5500;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.3s ease;
}

.link-button:hover {
  color: #ff7a00;
}

.auth-features {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.feature {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}

.feature-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.feature span {
  font-family: "Manrope", Helvetica;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .auth-page {
    padding: 16px;
  }
  
  .auth-card {
    padding: 32px 24px;
  }
  
  .auth-title {
    font-size: 24px;
  }
  
  .auth-subtitle {
    font-size: 14px;
  }
  
  .auth-tabs {
    margin-bottom: 24px;
  }
  
  .tab-button {
    padding: 12px 16px;
    font-size: 14px;
  }
  
  .auth-form {
    gap: 20px;
    margin-bottom: 24px;
  }
  
  .form-group input {
    padding: 14px 16px;
    font-size: 14px;
  }
  
  .submit-button {
    padding: 16px;
    font-size: 16px;
  }
  
  .auth-features {
    flex-direction: column;
    gap: 16px;
  }
  
  .feature {
    flex-direction: row;
    gap: 12px;
  }
  
  .feature-icon {
    font-size: 20px;
    margin-bottom: 0;
  }
  
  .feature span {
    font-size: 11px;
  }
}
</style> 