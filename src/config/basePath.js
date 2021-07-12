export default {
  getArea: '/login/user/areaList', // 获取省市区、街道
  findMarkList: '/product/findMarkList', // 设备型号
  findAllGroupMark: '/product/findAllGroupMark', // 设备组型号
  getEstate: 'product/getEstateByStreet', // 获取小区
  findUser: '/product/findUserByRole', // 运营列表
  uploadImage: '/building/adv/upload', // 上传图片
  // 设备配置
  deviceGetList: '/product/getList', // 设备管理查询
  deviceDetail: '/product/getDetail', // 设备详情
  deviceSave: '/product/save', // 设备保存
  exportProduct: '/product/exportProduct', // 导出
  // 设备运维
  getDashBoard: '/equipment/operation/getDashBoard', // 运维看板
  getEquipmentList: '/equipment/operation/getEquipmentList', // 查询设备列表
  getEquipmentInfo: '/equipment/operation/getEquipmentInfo', // 查询设备详情
  getRecords: '/equipment/operation/getRecords', // 各个记录查询
  exportEquipmentList: '/equipment/operation/exportEquipmentList', // 导出设备列表
  exportOperateRecord: '/equipment/operation/exportOperateRecord', // 运维记录导出
  // 车辆列表
  getRecycleCarList: '/carManage/getRecycleCarList', // 车辆列表查询
  addEditCar: '/carManage/addEditCar', // 编辑新增
  bindCarInfo: '/carManage/bindCarInfo', // 解绑/交押金/删除
  getCarInfo: '/carManage/getCarInfo', // 查看
  getRecycleUserList: '/carManage/getRecycleUserList', // 手机号码获取回收小哥名称
  importCarInfo: '/carManage/importCarInfo', // 批量导入
  // 满溢记录
  getSpillOverList: '/operation/spillOver/getSpillOverList', // 查询满溢记录
  exportSpillOver: '/operation/spillOver/exportSpillOver', // 导出满溢记录
  getSpillOverInfo: '/operation/spillOver/getSpillOverInfo', // 满溢详情
  // 清运记录
  getCleanPerson: '/operation/pickUp/getCleanPerson', // 获取清运人员
  getPickRecordList: '/operation/pickUp/getPickRecordList', // 查询清运记录
  exportPickRecord: '/operation/pickUp/exportPickRecord', // 清运导出
  getPickUpInfoById: '/operation/pickUp/getPickUpInfoById', // 清运详情
  // 日检记录
  getDayUsers: '/operation/userSign/getUsers', // 获取日检人员
  getUserSignList: '/operation/userSign/getUserSignList', // 查询日检记录
  exportUserSign: '/operation/userSign/exportUserSign', // 导出日检记录
  getUserSignInfo: '/operation/userSign/getUserSignInfo', // 日检详情
  // 报修记录
  getRepairUsers: '/operation/repair/getUsers', // 获取报修人员
  getRepairRecords: '/operation/repair/getRepairRecords', // 查询报修记录
  exportRepair: '/operation/repair/exportRepair', // 报修导出
  getRepairRecord: '/operation/repair/getRepairRecord', // 报修详情
  // 提现审核
  postalList: '/postal/list', // 查询
  getStatistics: '/postal/getStatistics', // 看板
  postalVerify: '/postal/verify', // 审核
  // 提现记录
  withdrawList: '/withdraw/withdrawList', // 查询
  withdrawExport: '/withdraw/export', // 导出
  // 充值记录
  findUserPayTradeList: '/memberUser/findUserPayTradeList', // 查询
  exportUserPayTrade: '/memberUser/exportUserPayTrade', // 导出
  // 余额流水
  balanceFlow: '/data/balanceFlow', // 查询
  balanceFlowExport: '/data/balanceFlowExport', // 导出
  integralType: '/data/integralType', // 查询类型
  // 环保值流水
  envFlow: '/data/envFlow', // 查询
  envFlowExport: '/data/envFlowExport', // 导出
  environmentType: '/data/environmentType', // 查询类型
  // 提现审核打款
  auditTotal: '/withdrawAudit/auditTotal', // 统计数据查询
  auditList: '/withdrawAudit/auditList', // 查询申请记录
  auditCashout: '/withdrawAudit/audit', // 审核
  payCashout: '/withdrawAudit/pay', // 打款
  // 账户余额流水
  balanceRecordList: '/userBalanceRecord/balanceRecordList', // 查询账户余额流水
  balanceRecordExport: '/userBalanceRecord/balanceRecordExport', // 导出
  // 保证金处置
  bailDisposal: '/userBail/bailDisposal', // 保证金处置
  getOrderNumber: '/userBail/getOrderNumber', // 查询扣减保证金关联结算单号
  getRecycleUser: '/userBail/getRecycleUser', // 退换保证金用户信息
  getUserBail: '/userBail/getUserBail', // 查询撤销扣减单号
  bailEdit: '/userBail/edit', // 保存
  // 保证金流水
  userBailExport: '/userBail/export', // 导出
  recordList: '/userBail/recordList', // 保证金流水
  // 交易数据统计
  memberData: '/data/memberData', // 会员交易数据
  businessData: '/data/businessData', // 猫回收业务数据
  deliveryStatistic: '/data/deliveryStatistic', // 设备交易数据统计
  productDataList: '/data/productDataList', // 设备交易列表数据查询
  // 资源回收统计
  recycleGetData: '/recycleData/getData', // 统计筛选看板
  getRecycleData: '/recycleData/getRecycleData', // 获取回收数据
  aggregateTrend: '/recycleData/aggregateTrend', // 总量趋势

  getRoleAccount: '/equipment/operation/getRoleAccount', // 查询设备对应角色账号信息
  // 社区内容管理
  findDynamicTotal: '/dynamic/findDynamicTotal', // 获取社区动态统计信息
  findList: '/dynamic/findList', // 获取社区动态列表
  getComList: '/dynamic/getComList', // 获取评论列表
  insertComment: '/dynamic/insertComment', // 评论或回复
  updateRecommend: '/dynamic/updateRecommend', // 更新推荐
  updateIsPublic: '/dynamic/updateIsPublic', // 更新状态
  deleteComment: '/dynamic/deleteComment', // 删除社区动态评论
  // 终端广告
  choseProduct: '/productAdv/choseProduct', // 获取小区列表和设备
  getAreaList: '/productAdv/getAreaList', // 获取区域列表
  getProductInfo: '/productAdv/getProductInfo', // 查看详情
  getProductList: '/productAdv/getProductList', // 查询
  resend: '/productAdv/resend', // 重发
  deleteImage: '/productAdv/deleteImage', // 删除图片
  clearImage: '/productAdv/clearImage', // 清空图片
  uploadPic: '/productAdv/uploadPic', // 上传广告图片
  upAdvInfo: '/productAdv/upAdvInfo', // 上传
  addition: '/productAdv/addition', // 追加&批量追加
  // 商城实物订单
  getDashBoardMarket: '/market/order/getDashBoard', // 商城订单看板
  getMarketOrderList: '/market/order/getMarketOrderList', // 商城订单列表
  getMarketOrderInfo: '/market/order/getMarketOrderInfo', // 查询订单详情
  delivery: '/market/order/delivery', // 发货
  cancelOrder: '/market/order/cancelOrder', // 取消订单
  updateDeliveryAddress: '/market/order/updateDeliveryAddress', // 更新收货地址
  getExpressInfo: '/market/order/getExpressInfo', // 查询快递信息
  getExpressList: '/market/order/getExpressList', // 查询快递列表
  // 家庭投递数据
  getHoldStatic: '/hold/getHoldStatic', // 家庭生活垃圾
  getEstateByPId: '/hold/getEstateByPId', // 楼栋单元
  exportHoldList: '/hold/exportHoldList', // 导出家庭列表
  // 实物商品管理
  getMerchant: '/giftinfo/getMerchant', // 获取商户
  getLabel: '/giftinfo/getLabel', // 获取商品标签
  getCategory: '/giftinfo/getCategory', // 获取类目联动
  merchantEdit: '/giftinfo/edit', // 新增修改
  delDetailsImg: '/giftinfo/delDetailsImg', // 删除详情图片
  delGiftImg: '/giftinfo/delGiftImg', // 删除商品图片
  getList: '/giftinfo/getList', // 已上架/未上架/编辑回显
  updateState: '/giftinfo/updateState', // 商品上下架
  delGift: '/giftinfo/delGift', // 删除商品
  getCityList: '/giftinfo/getCityList', // 获取城市
  // 大屏数据配置
  wallEdit: '/wallCategory/edit', // 新增/编辑
  doEmpty: '/wallCategory/doEmpty', // 清空
  WallGetList: '/wallCategory/getList', // 回显
  // 桶运记录
  getCarryingLadleUsers: '/operation/carryingLadle/getCarryingLadleUsers', // 获取清运人员列表
  getCarryingLadleList: '/operation/carryingLadle/getCarryingLadleList', // 查询桶运记录列表
  exportCarryingLadleList: '/operation/carryingLadle/exportCarryingLadleList', // 导出桶运记录

  getEzopenByProductId: '/product/getEzopenByProductId', // 获取萤石云
  emGoodsGetList: '/emGoods/getList', // 商品列表
  emGoodsDelById: '/emGoods/delById', // 商品列表del
  emPolicyGetList: '/emPolicy/getList', // 价格列表
  emPolicyGetEmGoods: '/emPolicy/getEmGoods', // 商品列表/emPolicy/getEmGoods
  emPolicyGetById: '/emPolicy/getById', // 兑换机列表
  emPolicyEdit: '/emPolicy/edit', // 兑换机新增&编辑
  getEmById: '/emPolicy/getEmById',
  conversionGet: '/wheat/getList', // 兑换机管理list wheatgetlist
  conversionEdit: '/wheat/editWheat' // 兑换机管理编辑保存 conversionedit

}
