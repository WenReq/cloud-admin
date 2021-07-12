import { httpPost } from './request/index'

// 溧水厨余计重--列表
export function foodWasteList (data) {
  return httpPost('foodwasteWeight/getList', data)
}

// 溧水厨余计重--新增
export function foodWasteAdd (data) {
  return httpPost('foodwasteWeight/edit', data)
}

// 小区设备--列表查询
export function plotDeviceList (data) {
  return httpPost('foodwasteWeight/estateCount', data)
}

// 小区设备--列表查询
export function plotDeviceDetails (data) {
  return httpPost('foodwasteWeight/details', data)
}

// 小区设备--统计列表
export function statisticsList (data) {
  return httpPost('foodwasteWeight/statistics', data)
}

// 分类参与统计--列表
export function getRate (data) {
  return httpPost('foodwasteWeight/getRate', data)
}

// 分类参与统计--统计
export function participationCount (data) {
  return httpPost('foodwasteWeight/districData', data)
}

export function participationRate (data) {
  return httpPost('foodwasteWeight/getDetailsNum', data)
}
