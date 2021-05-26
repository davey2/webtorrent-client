import { createApp } from "vue";
import WebTorrent from "webtorrent";
import App from "./App.vue";

const app = createApp(App);

app.config.globalProperties.client = new WebTorrent();

app.mount("#app");
