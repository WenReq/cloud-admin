import { httpPost } from './request/index'

// 异常投递记录
export function abnormalDelivery (data) {
  return httpPost('/deliveryError/getList', data)
}

// 处理异常投递
export function disposeDelivery (data) {
  return httpPost('/deliveryError/edit', data)
}
