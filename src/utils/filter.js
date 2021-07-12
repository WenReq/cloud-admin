import Vue from 'vue'

Vue.filter('mobileFl', function (str) {
  const start = str.slice(0, 3)
  const end = str.slice(7)
  return `${start}****${end}`
})

// 将整数部分逢三一断
Vue.filter('numberFl', function (value) {
  if (!value) {
    return value === 0 ? '0' : '--'
  }
  const intPartFormat = value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  return intPartFormat
})

// 将整数部分(三位小数)逢三一断
Vue.filter('numberFl1', function (value) {
  if (!value) {
    return value === 0 ? '0' : '--'
  }
  const intPartFormat = parseFloat(value).toLocaleString()
  return intPartFormat
})

// 预约订单状态
Vue.filter('stateFl', function (value) {
  let str = ''
  switch (value) {
    case 0:
      str = '待接单'
      break
    case 1:
      str = '待回收'
      break
    case 2:
      str = '回收完成'
      break
    case 3:
      str = '回收取消'
      break
    default:
      str = '失效'
      break
  }
  return str
})

// 回收方式
Vue.filter('typeFl', function (value) {
  let str = ''
  switch (value) {
    case 0:
      str = '回收站满溢'
      break
    case 1:
      str = '网上预约（app）'
      break
    case 2:
      str = '客服录入(电话)'
      break
  }
  return str
})

// 支付方式
Vue.filter('payFl', function (value) {
  let str = ''
  switch (value) {
    case '2':
      str = '环保值'
      break
    default:
      str = '元'
      break
  }
  return str
})

// 设备类型
Vue.filter('deviceTypeFl', function (value) {
  let str = ''
  switch (value) {
    case '1':
      str = '智能垃圾箱'
      break
    case '2':
      str = '智能回收站'
      break
    case '4':
      str = '智能垃圾房'
      break
    case '5':
      str = '智能垃圾亭'
      break
    default:
      break
  }
  return str
})

// 注册来源
Vue.filter('registerFl', function (value) {
  let str = ''
  switch (value) {
    case 0:
      str = 'APP注册'
      break
    case 1:
      str = 'IC开卡'
      break
    case 2:
      str = '设备'
      break
    case 3:
      str = '小程序'
      break
    case 4:
      str = '数据导入'
      break
    case 5:
      str = '客服录入'
      break
    case 6:
      str = '小哥录入'
      break
    default:
      break
  }
  return str
})
