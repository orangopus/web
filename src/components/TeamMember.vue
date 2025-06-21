<template>
  <div class="team-member">
    <div class="member-name">{{ member.name }}</div>
    <div class="member-role" :class="getRoleClass()">{{ member.role }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";

interface TeamMember {
  name: string;
  role: string;
}

export default defineComponent({
  name: "TeamMember",
  props: {
    member: {
      type: Object as PropType<TeamMember>,
      required: true,
    },
  },
  methods: {
    getRoleClass() {
      switch (this.member.role.toLowerCase()) {
        case "founder":
          return "role-founder";
        case "team":
          return "role-team";
        case "modopus":
          return "role-modopus";
        case "pentopus":
          return "role-pentopus";
        case "octonaut":
          return "role-octonaut";
        default:
          return "";
      }
    },
  },
});
</script>

<style scoped>
.team-member {
  backdrop-filter: blur(2.22px);
  border: 0.72px solid #ffffff2e;
  border-radius: 7953.51px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7.16px;
  padding: 18.61px;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
}

.team-member:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-2px);
}

.member-name {
  color: #ffffff;
  font-family: "DM Sans", Helvetica;
  font-size: 17.2px;
  font-weight: 400;
  letter-spacing: -0.86px;
  line-height: 15.4px;
}

.member-role {
  font-family: "DM Sans", Helvetica;
  font-size: 17.2px;
  font-weight: 400;
  letter-spacing: -0.86px;
  line-height: 15.4px;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.role-founder {
  background-image: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(0, 133, 153, 1) 100%);
}

.role-team {
  background-image: linear-gradient(99deg, rgba(255, 98, 0, 1) 0%, rgba(255, 255, 255, 1) 100%);
}

.role-modopus {
  background-image: linear-gradient(90deg, rgba(0, 251, 46, 1) 0%, rgba(255, 255, 255, 1) 100%);
}

.role-pentopus {
  background-image: linear-gradient(90deg, rgba(255, 13, 0, 1) 0%, rgba(255, 255, 255, 1) 100%);
}

.role-octonaut {
  background-image: linear-gradient(90deg, rgba(255, 255, 255, 1) 0%, rgba(157, 0, 255, 1) 100%);
}
</style>
