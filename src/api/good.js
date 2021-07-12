import { httpPost } from './request/index'

// 兑换机getList
export function addMachine (data) {
  return httpPost('/emGoods/edit', data)
}
