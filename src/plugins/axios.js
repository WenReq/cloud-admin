'use strict'

import Vue from 'vue'
import axios from 'axios'
import router from '../router'
import { ACCESS_TOKEN } from '@/store/mutation-types'

const _export = 'application/vnd.ms-excel;charset=UTF-8' // 导出
const baseURL = process.env.VUE_APP_API_BASE_URL

const config = {
  baseURL: baseURL,
  timeout: 1000 * 60 * 3 // Timeout
}

const _axios = axios.create(config)

_axios.interceptors.request.use(
  function (config) {
    const token = Vue.ls.get(ACCESS_TOKEN)
    config.headers['token'] = token

    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

_axios.interceptors.response.use(
  function (response) {
    const { code, msg } = response.data
    const _content_type = response.headers['content-type']
    // 是否为导出
    if (_content_type === _export) {
      return Promise.resolve(response)
    }
    switch (code) {
      case 0:
        return Promise.resolve(response)
      case 20000:
      case 20001:
      case 20002:
        // 20000：用户token为空 20001：用户信息为空 20002：登录失效，请重新登录
        router.replace({ path: '/login' })
        return Promise.reject(msg)
      default:
        return msg && Promise.reject(msg)
    }
  },
  function (error) {
    return Promise.reject(error.message)
  }
)

Plugin.install = function (Vue, options) {
  Vue.axios = _axios
  window.axios = _axios
  Object.defineProperties(Vue.prototype, {
    axios: {
      get () {
        return _axios
      }
    },
    $axios: {
      get () {
        return _axios
      }
    }
  })
}

Vue.use(Plugin)

export default Plugin
