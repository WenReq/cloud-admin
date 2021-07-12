import { httpPost } from './request/index'

// 街道列表
export function getAreaListData (data) {
  return httpPost('/estate/getList', data)
}
// 删除
export function delArea (data) {
  return httpPost('/estate/delById', data)
}
// 添加
export function addArea (data) {
  return httpPost('/estate/save', data)
}
// 编辑
export function editArea (data) {
  return httpPost('/estate/getDetail', data)
}
