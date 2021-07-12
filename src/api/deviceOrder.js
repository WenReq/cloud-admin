import { httpPost } from './request/index'

// 投递订单记录
export function orderList (data) {
  return httpPost('/data/deliveryRecord', data)
}
// 设备管理 > 设备运营记录 > 补货记录
export function findReplenishmentList (data) {
  return httpPost('/replenishment/findReplenishmentList ', data)
}
// 设备管理 > 设备运营记录 > 补货记录 - 统计
export function getGoodsCount (data) {
  return httpPost('/replenishment/getGoodsCount ', data)
}
// 设备管理 > 设备运营记录 > 补货记录 - 详情
export function detail (data) {
  return httpPost('/replenishment/detail ', data)
}

// 设备管理 > 智能设备管理 > 兑换机管理 - 详情
export function exchangeConfig (id) {
  const data = {
    id
  }
  return httpPost('wheat/getDetail', data)
}

