import Vue from 'vue'
import VueI18n from 'vue-i18n'
import moment from 'moment'

import zhCN from './lang/zh-CN/index'
import zhHK from './lang/zh-HK/index'
import enUS from './lang/en-US/index'

Vue.use(VueI18n)

const defaultLang = 'zh-CN'
const messages = {
  'zh-CN': {
    ...zhCN
  }
}
const languages = {
  'zh-CN': zhCN,
  'zh-HK': zhHK,
  'en-US': enUS
}

const i18n = new VueI18n({
  silentTranslationWarn: true,
  locale: defaultLang,
  fallbackLocale: defaultLang,
  messages
})

function setI18nLanguage (lang) {
  i18n.locale = lang
  return lang
}

export function loadLanguageAsync (lang = defaultLang) {
  return new Promise(resolve => {
    Vue.ls.set('lang', lang)
    if (i18n.locale !== lang) {
      const locale = languages[lang]
      i18n.setLocaleMessage(lang, locale)
      moment.updateLocale(locale.momentName || '', locale.momentLocale || '')
      return setI18nLanguage(lang)
    }
    return resolve(lang)
  })
}

export function i18nRender (key) {
  return i18n.t(`${key}`)
}

export default i18n
