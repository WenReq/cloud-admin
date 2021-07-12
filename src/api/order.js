import { httpPost, httpGet } from './request/index'

// 预约订单列表
export function reserveList (data) {
  return httpPost('order/getList', data)
}

export function addOrder (data) {
  return httpPost('/order/save', data)
}

// 会员列表
export function memberList (data) {
  return httpPost('/memberUser/findMemberByPhone', data)
}

// 预约订单详情
export function reserveDetail (id) {
  const data = {
    id
  }
  return httpPost('/order/getDetail', data)
}

// 取消预约
export function cancelReserve (data) {
  return httpPost('/order/orderAppointCancel', data)
}

// 取消订单
export function cancelOrder (data) {
  return httpPost('/order/orderCancel', data)
}

// 修改上门回收时间
export function extendedTime (data) {
  return httpPost('/order/orderRecycleExtend', data)
}

// 结算订单列表
export function settleList (data) {
  return httpPost('/settle/getList', data)
}

// 结算订单详情
export function settleDetail (id) {
  const data = {
    id
  }
  return httpPost('/settle/getDetail', data)
}

// 回收种类
export function dictType (data) {
  return httpPost('/order/getDictType', data)
}

// 兑换记录
export function exchangeList (data) {
  return httpPost('/physicalStore/getExchangeList', data)
}

// 导出兑换记录列表
export function exportExchangeList (data) {
  return httpPost('/physicalStore/exportExchangeList', data)
}

// 兑换记录详情
export function exchangeDetail (id) {
  const data = {
    id
  }
  return httpGet('/physicalStore/getExchangeInfo', data)
}

// 投递记录列表
export function deliveryRecord (data) {
  return httpPost('/data/deliveryRecord', data)
}

// 处理违规
export function violation (id) {
  const data = {
    id
  }
  return httpPost('/data/violation', data)
}

// 投递记录详情
export function deliveryRecordDetail (id, type) {
  const data = {
    id,
    scenario: type
  }
  return httpPost('/data/deliveryRecordById', data)
}

// 延长结算时间
export function extendSettlement (data) {
  return httpPost('/settle/orderRecycleExtend', data)
}

// 投递品类
export function category () {
  return httpPost('/product/getDataListByType')
}

// 取币记录-查询
export function getWithdrawRecord (data) {
  return httpPost('/product/withdraw/record/list', data)
}

// 取币记录-查看
export function viewWithdrawRecord (data) {
  return httpPost('/product/withdraw/record/getInfo', data)
}

// 补币记录-查询
export function getSupplementaryRecord (data) {
  return httpPost('/fillMoney/list', data)
}

// 补币记录-查看
export function viewSupplementaryRecord (data) {
  return httpPost('/fillMoney/getMoneyRecord', data)
}

// 线上商城兑换-查询
export function getOnlineMall (data) {
  return httpPost('/onLineStore/getExchangeList', data)
}

// 线上商城兑换-查看
export function viewOnlineMall (data) {
  return httpGet('/onLineStore/getExchangeInfo', data)
}

// 兑换机兑换-查询
export function getMachineList (data) {
  return httpPost('/pickUpMechine/getExchangeList', data)
}

// 兑换机兑换-查看
export function viewMachine (data) {
  return httpGet('/pickUpMechine/getExchangeInfo', data)
}

// 定点厨余记录-查询
export function getFoodWasteList (data) {
  return httpPost('/pointRecycle/getFoodWasteList', data)
}

// 定点厨余记录-导出
export function getFoodWasteExport (data) {
  return httpPost('/pointRecycle/export', data)
}

// 定点回收记录-查询
export function getRecycleList (data) {
  return httpPost('/pointRecycle/getRecycleList', data)
}

// 定点回收记录-详情
export function getRecycleInfo (id) {
  return httpPost('/pointRecycle/getRecycleInfo?id=' + id, '')
}

// 定点回收记录-导出
export function exportRecycleList (data) {
  return httpPost('/pointRecycle/exportRecycleList', data)
}

// 智能秤查询统计
export function getSmartScalesList (data) {
  return httpPost('/product/getDeliveryScaleTotal', data)
}

// 智能秤查询list
export function getDeliveryScaleList (data) {
  return httpPost('/product/getDeliveryScaleList', data)
}

// 线下活动兑换-查询
export function getExchangeList (data) {
  return httpPost('/offLineStore/getExchangeList', data)
}

// 线下活动兑换-详情
export function getExchangeInfo (id) {
  return httpPost('/offLineStore/getExchangeInfo?id=' + id, '')
}

// 线下活动兑换-导出
export function exportExchange (data) {
  return httpPost('/offLineStore/export', data)
}
