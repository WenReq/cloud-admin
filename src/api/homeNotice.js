import { httpPost } from './request/index'

// 街道列表
export function getListData (data) {
  return httpPost('/publicity/getList', data)
}
// 删除
export function del (data) {
  return httpPost('/publicity/delById', data)
}
// 添加\编辑
export function addAndEdit (data) {
  return httpPost('/publicity/edit', data)
}
// 发布
export function push (data) {
  return httpPost('/publicity/push', data)
}
