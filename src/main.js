import "primevue/resources/primevue.min.css";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/lara-light-indigo/theme.css";

import { createApp } from "vue";
import { createPinia } from "pinia/dist/pinia";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";

import "./assets/main.css";

import BlockViewer from "./BlockViewer.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(PrimeVue, { ripple: true, inputStyle: "outlined" });
app.use(router);
app.use(pinia);

app.component("BlockViewer", BlockViewer);

app.mount("#app");
