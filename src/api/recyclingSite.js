import { httpPost } from './request/index'

// 回收站点列表查询
export function getSiteList (data) {
  return httpPost('/site/info/list', data)
}
// 删除
export function delSite (data) {
  return httpPost('/site/info/del', data)
}
// 添加
export function addSite (data) {
  return httpPost('/site/info/add', data)
}
// 编辑
export function editSite (data) {
  return httpPost('/site/info/edit', data)
}
// 查看
export function viewSite (data) {
  return httpPost('/site/info/get', data)
}
