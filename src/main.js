import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import store from './store/index.js'
import 'element-plus/dist/index.css'
import ElementPlus from 'element-plus';

const app=createApp(App)

app.use(router).use(store).use(ElementPlus).mount('#app')
