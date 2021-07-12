// ie polyfill
require('@babel/polyfill')

import Vue from 'vue'
import App from './App.vue'
import router from './router/index'
import store from './store/index'
import i18n from './locales'

import bootstrap from './core/bootstrap'
import './core/use'
import './permission'

// 预览图片
import Viewers from 'v-viewer'
import 'viewerjs/dist/viewer.css'

Vue.config.productionTip = false

Viewers.setDefaults({
  'inline': false,
  'button': true, // 右上角按钮
  'navbar': false, // 底部缩略图
  'title': false, // 当前图片标题
  'toolbar': true, // 底部工具栏
  'tooltip': true, // 显示缩放百分比
  'movable': true, // 是否可以移动
  'zoomable': true, // 是否可以缩放
  'rotatable': false, // 是否可旋转
  'scalable': false, // 是否可翻转
  'transition': true, // 使用 CSS3 过度
  'fullscreen': true, // 播放时是否全屏
  'keyboard': true // 是否支持键盘
})

Vue.use(Viewers)

new Vue({
  router,
  store,
  i18n,
  created () {
    bootstrap()
  },
  render: h => h(App)
}).$mount('#app')
