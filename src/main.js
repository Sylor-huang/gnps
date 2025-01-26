import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@/styles/index.scss' // global css

const app = createApp(App)

//import vuex
import store from './store'
app.use(store)
import Spinning from '@/layout/components/Commons/Spinning.vue'
app.component('spinning', Spinning)

import axiosReq from '@/utils/axiosReq'
app.config.globalProperties.$axiosReq = axiosReq

import * as ElSvg from '@element-plus/icons-vue'

for(const name in ElSvg) {
  app.component(name, ElSvg[name])
}

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
const appLocal = localStorage.getItem('language');
const languageIsSet = appLocal && appLocal.indexOf('chinese') > -1

app.config.globalProperties.$language = languageIsSet ? zhCn : en
import i18n from './lang'
app.use(i18n)

import ElSvgIcon from "@/layout/components/ElSvgIcon.vue"
app.component("e-icon",ElSvgIcon)

import { ElMessage } from 'element-plus'
app.config.globalProperties.$elmsg = ElMessage

import defaultSetting from "@/settings"
app.config.globalProperties.$setting = defaultSetting

import './permission'

app.use(router).mount('#app')