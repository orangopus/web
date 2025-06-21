<template>
  <div class="notification-container">
    <TransitionGroup name="notification" tag="div" class="notifications">
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        class="notification"
        :class="notification.type"
      >
        <div class="notification-icon">
          <span v-if="notification.type === 'success'">✅</span>
          <span v-else-if="notification.type === 'error'">❌</span>
          <span v-else-if="notification.type === 'warning'">⚠️</span>
          <span v-else>ℹ️</span>
        </div>
        <div class="notification-content">
          <h4 class="notification-title">{{ notification.title }}</h4>
          <p class="notification-message">{{ notification.message }}</p>
        </div>
        <button @click="removeNotification(notification.id)" class="notification-close">
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

export default defineComponent({
  name: "Notification",
  data() {
    return {
      notifications: [] as Notification[]
    };
  },
  methods: {
    show(notification: Omit<Notification, 'id'>) {
      const id = Date.now().toString();
      const newNotification = {
        ...notification,
        id,
        duration: notification.duration || 5000
      };
      
      this.notifications.push(newNotification);
      
      // Auto-remove after duration
      setTimeout(() => {
        this.removeNotification(id);
      }, newNotification.duration);
    },
    
    removeNotification(id: string) {
      const index = this.notifications.findIndex(n => n.id === id);
      if (index > -1) {
        this.notifications.splice(index, 1);
      }
    },
    
    success(title: string, message: string, duration?: number) {
      this.show({ type: 'success', title, message, duration });
    },
    
    error(title: string, message: string, duration?: number) {
      this.show({ type: 'error', title, message, duration });
    },
    
    warning(title: string, message: string, duration?: number) {
      this.show({ type: 'warning', title, message, duration });
    },
    
    info(title: string, message: string, duration?: number) {
      this.show({ type: 'info', title, message, duration });
    }
  }
});
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 90px;
  right: 20px;
  z-index: 1001;
  pointer-events: none;
}

.notifications {
  display: flex;
  flex-direction: column;
  gap: 15px;
  pointer-events: auto;
}

.notification {
  display: flex;
  align-items: flex-start;
  gap: 15px;
  background: rgba(255, 255, 255, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  min-width: 350px;
  max-width: 450px;
  transition: all 0.3s ease;
}

.notification.success {
  border-left: 4px solid #10b981;
}

.notification.error {
  border-left: 4px solid #ef4444;
}

.notification.warning {
  border-left: 4px solid #f59e0b;
}

.notification.info {
  border-left: 4px solid #3b82f6;
}

.notification-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.notification-content {
  flex: 1;
}

.notification-title {
  color: #1f2937;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.notification-message {
  color: #6b7280;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
}

.notification-close {
  background: none;
  border: none;
  color: #9ca3af;
  font-size: 20px;
  font-weight: 300;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.notification-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #6b7280;
}

/* Transition animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

.notification-move {
  transition: transform 0.3s ease;
}

/* Light theme styles */
.light-theme .notification {
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.light-theme .notification-title {
  color: #ffffff;
}

.light-theme .notification-message {
  color: rgba(255, 255, 255, 0.7);
}

.light-theme .notification-close {
  color: rgba(255, 255, 255, 0.5);
}

.light-theme .notification-close:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .notification-container {
    top: 80px;
    right: 10px;
    left: 10px;
  }
  
  .notification {
    min-width: auto;
    max-width: none;
  }
}
</style> 