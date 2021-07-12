import { httpPost } from './request/index'

// 查询小区设备
export function getEstateProduct (data) {
  return httpPost('/product/getEstateProduct', data)
}

// 根据设备型号获取回收类型
export function findDataDictByMarkId (data) {
  return httpPost('/product/findDataDictByMarkId', data)
}

// 根据分类获取默认价格
export function getCateoryPrice (data) {
  return httpPost('/product/getCateoryPrice', data)
}

// 批量修改价格
export function updateBathPrice (data) {
  return httpPost('/product/updateBathPrice', data)
}
