import "./TT";
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import Antd from 'ant-design-vue'
import {router} from './router'
import 'ant-design-vue/dist/antd.css'
import VueLazyload from 'vue-lazyload'


const app = createApp(App)
app.use(router).use(createPinia()).use(Antd).use(VueLazyload).mount('#app')