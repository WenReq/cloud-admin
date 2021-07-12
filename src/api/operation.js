import { httpPost } from './request/index'

/* 积分管理 */
// 积分列表
export function getData (data) {
  return httpPost('/integral/rule/getList', data)
}
// 详情
export function getInfo (data) {
  return httpPost('/integral/rule/getInfo?id=' + data.id, {})
}
// 添加\编辑
export function addAndEdit (data) {
  return httpPost('/integral/rule/addOrEditIntegralRule', data)
}
// 查询小区
export function getStreet (data) {
  return httpPost('/integral/rule/getStreet', data)
}

/* 积分排行 */
export function rankGetData (data) {
  return httpPost('/memberUser/getUserInfo', data)
}

/* 分类次数排行 */
export function deliveryRank (data) {
  return httpPost('/memberUser/getDeliveryRank', data)
}

/* 新增资产排行 */
export function newRanking (data) {
  return httpPost('/memberUser/newRanking', data)
}
