import { createApp } from "vue"
import App from "./App.vue"
import router from "@/router"
import pinia from "@/stores"
import Antd from "ant-design-vue"
import "ant-design-vue/dist/reset.css"
import "@/assets/theme/index.scss"
import "virtual:uno.css"
import i18n from "@/i18n"

const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(Antd)
app.use(i18n)
app.mount("#app")
