import antd from 'ant-design-vue/es/locale-provider/zh_CN'
import momentCN from 'moment/locale/zh-cn'

import member from './member'

const components = {
  antLocale: antd,
  momentName: 'zh-tw',
  momentLocale: momentCN
}

const locale = {
  ...member
}

export default {
  ...components,
  ...locale
}
