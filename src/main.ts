import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";

const app = createApp(App);

// Add error handling for production
if (process.env.NODE_ENV === 'production') {
  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue Error:', err);
    console.error('Component:', vm);
    console.error('Info:', info);
  };
}

app.use(router);
app.mount("#app");
