import Vue from 'vue'
import VueStorage from 'vue-ls'
import basePath from '@/config/basePath'
import { httpPost, httpGet, httpExport } from '@/request'

import './directives/action'
import '@/plugins/axios'
import '@/plugins/ant-design-vue.js'
import '@/utils/filter'
import '@/assets/css/reset.css'

Vue.prototype.$basePath = basePath
Vue.prototype.$httpPost = httpPost
Vue.prototype.$httpGet = httpGet
Vue.prototype.$httpExport = httpExport

const storageOptions = {
  namespace: 'pro__',
  name: 'ls',
  storage: 'local'
}

Vue.use(VueStorage, storageOptions)
