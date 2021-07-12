import { httpPost } from './request/index'

// 会员列表查询
export function getMemberList (data) {
  return httpPost('/memberUser/getList', data)
}

// 会员详情
export function getMemberInfo (data) {
  return httpPost('/memberUser/getDetail', data)
}

// 锁定用户
export function changeLock (data) {
  return httpPost('/memberUser/updateLock', data)
}

// 余额记录
export function getBalance (data) {
  return httpPost('/memberUser/getBalanceRecord', data)
}

// 环保值记录
export function getEnvironmental (data) {
  return httpPost('/memberUser/getEnvironmentalRecord', data)
}

// 吐币记录
export function getWithdraw (data) {
  return httpPost('/memberUser/getWithdrawRecode', data)
}

// 投递记录
export function getDelivery (data) {
  return httpPost('/memberUser/getDeliveryRecode', data)
}

// 预约记录
export function getFindOrder (data) {
  return httpPost('/memberUser/findOrderListByApplyId', data)
}

// 兑换记录
export function getExchange (data) {
  return httpPost('/memberUser/getExchangeRecord', data)
}

// 充值记录
export function getRecharge (data) {
  return httpPost('/memberUser/getUserPayTradeListRecord', data)
}

// 提现记录
export function getDeposit (data) {
  return httpPost('/memberUser/getWithdrawListRecord', data)
}

// IC卡号
export function cardList () {
  return httpPost('/hold/findCardList')
}

export function saveMember (data) {
  return httpPost('/hold/save', data)
}

export function importMemberList (data) {
  return httpPost('memberUser/findHoldList', data)
}

// 家庭列表
export function familyList (data) {
  return httpPost('/hold/findAllHoldList', data)
}

// 家庭列表编辑
export function familyEdit (data) {
  return httpPost('/hold/saveHold', data)
}

// 资金处置
export function memberHandle (data) {
  return httpPost('/memberUser/memberHandle', data)
}

// 卡费扣除
export function cardHandle (data) {
  return httpPost('/memberUser/cardHandle', data)
}

// 解绑
export function relieveCard (data) {
  return httpPost('/memberUser/relieveCard', data)
}

//  绑卡记录
export function getCardRecord (data) {
  return httpPost('/memberUser/getCardRecord', data)
}

export function cardRecord (id) {
  const data = {
    id
  }
  return httpPost('/memberUser/cardRecord', data)
}

// 运维纪录
export function operationRecord (id) {
  const data = {
    id
  }
  return httpPost('/memberUser/getOperationList', data)
}

// 运维纪录
export function addOperation (data) {
  return httpPost('/memberUser/addOperation', data)
}

// 开卡纪录
export function openCardRecord (data) {
  return httpPost('/memberUser/findCardRecordList', data)
}

// 获取IC卡状态
export function cardState (cardNum) {
  const data = {
    cardNum
  }
  return httpPost('/memberUser/getICCard', data)
}

// 修改用户信息
export function updateMember (data) {
  return httpPost('/memberUser/edit', data)
}

// 定点可回收/厨余纪录
export function getRecycleRecord (data) {
  return httpPost('memberUser/getAppointRecycleRecord', data)
}

export function pay () {
  return httpPost('/postal/aliPayCallBack', {})
}
