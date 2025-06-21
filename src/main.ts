import { createApp } from "vue";
import OrangopusWebapp from "./screens/OrangopusWebapp.vue";

const app = createApp(OrangopusWebapp);

// Add error handling for production
if (process.env.NODE_ENV === 'production') {
  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue Error:', err);
    console.error('Component:', vm);
    console.error('Info:', info);
  };
}

app.mount("#app");
