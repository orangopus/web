<template>
  <div class="user-profile">
    <div class="profile-header">
      <div class="profile-avatar">
        <img 
          :src="user?.avatar_url || '/default-avatar.png'" 
          :alt="user?.name || 'User'"
          @error="handleImageError"
        />
        <button @click="triggerFileInput" class="avatar-edit">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="handleAvatarChange"
          style="display: none"
        />
      </div>
      
      <div class="profile-info">
        <h2>{{ user?.name || 'User' }}</h2>
        <p class="user-email">{{ user?.email }}</p>
        <p class="member-since">Member since {{ formatDate(user?.created_at) }}</p>
      </div>
    </div>

    <div class="profile-sections">
      <div class="section">
        <h3>Profile Information</h3>
        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Enter your full name"
              :disabled="authState.loading"
            />
          </div>

          <div class="form-group">
            <label for="bio">Bio</label>
            <textarea
              id="bio"
              v-model="form.bio"
              placeholder="Tell us about yourself..."
              rows="4"
              :disabled="authState.loading"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="github">GitHub Username</label>
            <input
              id="github"
              v-model="form.github_username"
              type="text"
              placeholder="your-github-username"
              :disabled="authState.loading"
            />
          </div>

          <button 
            type="submit" 
            class="save-button"
            :disabled="authState.loading"
          >
            <span v-if="authState.loading" class="loading-spinner"></span>
            {{ authState.loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>
      </div>

      <div class="section">
        <h3>Account Settings</h3>
        <div class="settings-list">
          <div class="setting-item">
            <div class="setting-info">
              <h4>Email Notifications</h4>
              <p>Receive updates about your projects and community activity</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.emailNotifications" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h4>Public Profile</h4>
              <p>Make your profile visible to other community members</p>
            </div>
            <label class="toggle">
              <input type="checkbox" v-model="settings.publicProfile" />
              <span class="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Danger Zone</h3>
        <div class="danger-zone">
          <div class="danger-item">
            <div class="danger-info">
              <h4>Delete Account</h4>
              <p>Permanently delete your account and all associated data</p>
            </div>
            <button @click="showDeleteConfirm = true" class="danger-button">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
      <div class="modal" @click.stop>
        <h3>Delete Account</h3>
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="showDeleteConfirm = false" class="cancel-button">
            Cancel
          </button>
          <button @click="deleteAccount" class="delete-button">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { authService, AuthState, User } from "@/services/authService";

interface ProfileForm {
  name: string;
  bio: string;
  github_username: string;
}

interface UserSettings {
  emailNotifications: boolean;
  publicProfile: boolean;
}

export default defineComponent({
  name: "UserProfile",
  data() {
    return {
      form: {
        name: '',
        bio: '',
        github_username: ''
      } as ProfileForm,
      settings: {
        emailNotifications: true,
        publicProfile: true
      } as UserSettings,
      authState: {
        user: null,
        loading: false,
        error: null
      } as AuthState,
      showDeleteConfirm: false,
      unsubscribe: () => {}
    };
  },
  computed: {
    user(): User | null {
      return this.authState.user;
    }
  },
  mounted() {
    this.unsubscribe = authService.subscribe((state) => {
      this.authState = state;
      if (state.user) {
        this.loadUserData();
      }
    });
  },
  beforeUnmount() {
    this.unsubscribe();
  },
  methods: {
    loadUserData() {
      if (this.user) {
        this.form = {
          name: this.user.name || '',
          bio: this.user.bio || '',
          github_username: this.user.github_username || ''
        };
      }
    },

    async updateProfile() {
      const result = await authService.updateProfile(this.form);
      if (result.success) {
        this.$emit('profile-updated');
      }
    },

    triggerFileInput() {
      (this.$refs.fileInput as HTMLInputElement).click();
    },

    async handleAvatarChange(event: Event) {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        // TODO: Implement file upload to Supabase storage
        console.log('Avatar file selected:', file);
      }
    },

    handleImageError(event: Event) {
      const img = event.target as HTMLImageElement;
      img.src = '/default-avatar.png';
    },

    formatDate(dateString?: string): string {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long'
      });
    },

    async deleteAccount() {
      // TODO: Implement account deletion
      console.log('Delete account');
      this.showDeleteConfirm = false;
    }
  }
});
</script>

<style scoped>
.user-profile {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 40px;
  padding: 32px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
}

.profile-avatar {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 85, 0, 0.3);
}

.profile-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-edit {
  position: absolute;
  bottom: 0;
  right: 0;
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
  transition: all 0.3s ease;
}

.avatar-edit:hover {
  transform: scale(1.1);
}

.avatar-edit svg {
  width: 18px;
  height: 18px;
}

.profile-info h2 {
  font-family: "Manrope", Helvetica;
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.user-email {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 8px 0;
}

.member-since {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

.profile-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
}

.section h3 {
  font-family: "Manrope", Helvetica;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 24px 0;
}

.profile-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.form-group input,
.form-group textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  transition: all 0.3s ease;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ff5500;
  background: rgba(255, 85, 0, 0.05);
}

.form-group input:disabled,
.form-group textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.save-button {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 14px 28px;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  align-self: flex-start;
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3);
}

.save-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h4 {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.setting-info p {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.toggle {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: 0.3s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
}

input:checked + .slider {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.danger-zone {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.danger-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 8px;
}

.danger-info h4 {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  color: #ff3b30;
  margin: 0 0 4px 0;
}

.danger-info p {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 59, 48, 0.8);
  margin: 0;
}

.danger-button {
  background: #ff3b30;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.danger-button:hover {
  background: #d70015;
  transform: translateY(-1px);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal h3 {
  font-family: "Manrope", Helvetica;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 16px 0;
}

.modal p {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 24px 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.cancel-button {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 20px;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.delete-button {
  background: #ff3b30;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background: #d70015;
}

@media (max-width: 768px) {
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
  
  .setting-item,
  .danger-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}
</style> 