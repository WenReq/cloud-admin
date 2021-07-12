import antd from 'ant-design-vue/es/locale-provider/zh_TW'
import momentTW from 'moment/locale/zh-tw'

import member from './member'

const components = {
  antLocale: antd,
  momentName: 'zh-cn',
  momentLocale: momentTW
}

const locale = {
  ...member
}

export default {
  ...components,
  ...locale
}
