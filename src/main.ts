import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Vant, { Lazyload } from 'vant'
import '@/Mock/mockServer.ts'
import 'vant/lib/index.less'
import 'amfe-flexible'
// 导入 dayjs 的核心模块
import dayjs from 'dayjs'
// 导入计算相对时间的插件
import relativeTime from 'dayjs/plugin/relativeTime'
// 导入中文语言包
import zh from 'dayjs/locale/zh-cn'
// 配置“计算相对时间”的插件
dayjs.extend(relativeTime)
// 配置中文语言包
dayjs.locale(zh)
const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Vant)
app.use(Lazyload)
app.mount('#app')
