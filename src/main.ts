import { createApp } from 'vue'
import App from './App.vue'

import router from './router/index'
import store from './store/index'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//createApp(App).use(router).use(Form).mount('#app')

const app = createApp(App);   //创建实例

app.use(router);
app.use(ElementPlus);
app.use(store)

app.mount('#app')


