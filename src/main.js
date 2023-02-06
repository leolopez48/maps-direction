import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

// Mapbox
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

// Environment variables
import environment from "./environment";

mapboxgl.accessToken = environment.mapBoxAccessToken;

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
