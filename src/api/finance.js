import { httpPost } from './request/index'

// 充值列表
export function rechargeList (data) {
  return httpPost('/postal/getRechargeList', data)
}

// 充值
export function recharge (data) {
  return httpPost('/postal/recharge', data)
}
