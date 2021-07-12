const imgList = [
  {
    name: '用户列表',
    routeUrl: '/member/memberList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572422301057f7d67fc535f34942aeda89f4f1bdec51.png'
  },
  {
    name: '商户列表',
    routeUrl: '/merchant/merchantList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724223646690cdb7fb63fa24f27b675c2e77e304ca6.png'
  },
  {
    name: '人员入驻审核',
    routeUrl: '/takeBack/peopleAuditList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572422535724eba83306d93b4f9faa5a0a0b44e89485.png'
  },
  {
    name: '回收人员列表',
    routeUrl: '/takeBack/recyclerList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572422556080e5ac59f0f75a497e834587d0c344ba50.png'
  },
  {
    name: '车辆列表',
    routeUrl: '/device/carManage/carList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572422582968000e12adb4be4eae99569e51d2f5d97f.png'
  },
  {
    name: 'banner列表',
    routeUrl: '/advert/floorAdvertList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724226005935f2aad6cbe90491c95ebb451c6451abc.png'
  },
  {
    name: '投递列表',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/157242265129098e1c42017254c898e97f46a1bb68014.png'
  },
  {
    name: '设备配置',
    routeUrl: '/device/operation/deviceConfig',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/157242283221482421f1a4acc440c80c66f7a80caec61.png'
  },
  {
    name: '设备运维',
    routeUrl: '/device/operation/deviceMaintain',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572423306960a13bdf14490c4082bfaf882b6b9c6c4c.png'
  },
  {
    name: '账号配置',
    routeUrl: '/system/account',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572423340840cb96285c71f944c9a1fd17d5ae0f2512.png'
  },
  {
    name: '回收价格配置',
    routeUrl: '/rule/recyclePrice',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572423357314ecb797653a4f4bae9980d821c314007b.png'
  },
  {
    name: '回收运营规则',
    routeUrl: '/rule/recycleOperate',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572423382545f0c3d206811f4d399641a5a2bf6bb867.png'
  },
  {
    name: '保证金处置',
    routeUrl: '/finance/bondManage/bondHandle',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572423400737c9fa7941fd644da584e109d824f1c48e.png'
  },
  {
    name: '实体店铺兑换',
    routeUrl: '/order/exchange/entity',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572423495557fa1ed47bb4734ecc9a49816ef5b8e96f.png'
  },
  {
    name: '角色配置',
    routeUrl: '/system/role',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191109/15732781443789188efae0cc442738db8cb619303ca0c.png'
  },
  {
    name: '操作日志',
    routeUrl: '/system/log',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724237231838718fcc3a53b40ed9da463a2d3348f16.png'
  },
  {
    name: '满溢记录',
    routeUrl: '/device/maintain/recordOverflow',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572423998854f279732da84b49f584dc8c3c2fa81843.png'
  },
  {
    name: '清运记录',
    routeUrl: '/device/maintain/recordClearance',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/157242401835565a40773c15d4fd586904c4ac2ce5af1.png'
  },
  {
    name: '日检记录',
    routeUrl: '/device/maintain/recordDayinspect',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572424111895e8c632c62a06477c9cee1cd86d3ad840.png'
  },
  {
    name: '报修记录',
    routeUrl: '/device/maintain/recordRepair',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724241293246d547ec6a6884439809840926e852f02.png'
  },
  {
    name: '预约订单记录',
    routeUrl: '/order/takeBack/reserve',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572424172962e72744e3cdab40c699771b1d90a5fec1.png'
  },
  {
    name: '接单回收记录',
    routeUrl: '/order/takeBack/meet',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724241991295518a73c75a74f23b5cbca680226dac7.png'
  },
  {
    name: '结算订单记录',
    routeUrl: '/order/takeBack/settle',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724242177973eb77501d4c349e4921571ce17f19f76.png'
  },
  {
    name: '定点厨余记录',
    routeUrl: '/order/kitchen/index',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724242177973eb77501d4c349e4921571ce17f19f76.png'
  },
  {
    name: '定点回收记录',
    routeUrl: '/order/recycle/index',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724242177973eb77501d4c349e4921571ce17f19f76.png'
  },
  {
    name: '智能秤回收记录',
    routeUrl: '/order/smartScales/index',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724242177973eb77501d4c349e4921571ce17f19f76.png'
  },
  {
    name: '充值记录',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572424315213719ced284b1e4f028e46e5cc7cc48c25.png'
  },
  {
    name: '投递记录',
    routeUrl: '/order/delivery/record',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724243639933c29dcd4bdd441ba8b9e038c241996a2.png'
  },
  {
    name: '提现审核打款',
    routeUrl: '/finance/cashoutManage/cashoutApply',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/157242439535113e8aa9e687d4c908548f4d89175c3aa.png'
  },
  {
    name: '账户余额流水',
    routeUrl: '/finance/cashoutManage/balanceFlow',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724244311017cfc15bf77284e1e819fd4397034ee23.png'
  },
  {
    name: '保证金流水',
    routeUrl: '/finance/bondManage/bondFlow',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724244505147cba4b34b59046b2a302ece25e0b6352.png'
  },
  {
    name: '线下开卡',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/1572424472474389688f8da4142c4bc83ea3bada02310.png'
  },
  {
    name: '兑换机兑换',
    routeUrl: '/order/exchange/machineList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579315232797e9f72ee64e9e4cca937b011517fc1ddb.png'
  },
  {
    name: '活动列表',
    routeUrl: '/activity/activityList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579317108220b300713202014a8f9de5efc4197efdfb.png'
  },
  {
    name: '资源回收统计',
    routeUrl: '/finance/FinancialData/resourceRecovery',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/157931979639358a4b767384a48fc9c7ebb6dc0cd5a33.png'
  },
  {
    name: '交易数据统计',
    routeUrl: '/finance/FinancialData/transactionFinance',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579319826205732943ccaae144cfa2a32c8351a8dabe.png'
  },
  {
    name: '设备广告投放',
    routeUrl: '/advert/terminalAd/adDelivery',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/15793198452881482a3a372684c2280aec79cd61996b0.png'
  },
  {
    name: '动态列表',
    routeUrl: '/community/dynamicList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579319858647534cc5baddfc4f4b8f52d0f684287d5e.png'
  },
  {
    name: '取币记录',
    routeUrl: '/order/delivery/withdrawRecord',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/15793194459862d64974e75e0468aafaaca724719e185.png'
  },
  {
    name: '充值记录',
    routeUrl: '/finance/MetranManage/rechargeRecord',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579319602438aa015cc626f44be18ccb1922af89d9d3.png'
  },
  {
    name: '回收站点管理',
    routeUrl: '/infrastructure/recyclingSite/recyclingSiteList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579325622298bc9cede284d44a5ca7846e8a129ddd15.png'
  },
  {
    name: '提现记录',
    routeUrl: '/finance/MetranManage/cashoutRecord',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579325671563aee4cb77fc8345ef9ab3cb087acfa604.png'
  },
  {
    name: '线上商城兑换',
    routeUrl: '/order/exchange/onlineMall',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579325708235231828987c3f4a42bcc37b5c5e8c440e.png'
  },
  {
    name: '线下活动兑换',
    routeUrl: '/order/exchange/offline',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579325708235231828987c3f4a42bcc37b5c5e8c440e.png'
  },
  {
    name: '回收订单总表',
    routeUrl: '/order/takeBack/recovery',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20191030/15724241991295518a73c75a74f23b5cbca680226dac7.png'
  },
  {
    name: '补币记录',
    routeUrl: '/order/delivery/supplementaryRecord',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/1579325942324540af0134f2c47638dc5c53b9d320bef.png'
  },
  {
    name: '余额流水',
    routeUrl: '/finance/MetranManage/balanceFlow',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/157932598022847d3bd0d9e9540f09965a2d0ee5fa440.png'
  },
  {
    name: '环保值流水',
    routeUrl: '/finance/MetranManage/envalueFlow',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/15793260815286f1ac127085a4a92a5082c0cf3b6efd6.png'
  },
  {
    name: '客服电话配置',
    routeUrl: '/rule/customerPhone',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/157932625211572377afabdd8456c89742a0fb6b24a42.png'
  },
  {
    name: '提现审核',
    routeUrl: '/finance/MetranManage/cashoutApply',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200118/15793263284798e7a4d29c4004448b9e6b9b65384957b.png'
  },
  {
    name: '大屏数据配置',
    routeUrl: '/rule/BIdataConfig',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/1590462632819e0e0afd5f3674c37a3b9d4d0f032261c.png'
  },
  {
    name: '桶运记录',
    routeUrl: '/device/maintain/recordKegTransport',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/159046280791756de52dab52848419f55b929bccc929f.png'
  },
  {
    name: '家庭投递统计',
    routeUrl: '/stats/familyStats/lifeRubbish',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/1590462886758c8b17e176ee246889bb4cdeebd4de0d1.png'
  },
  {
    name: '用户导入',
    routeUrl: '/member/memberImport',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/1590463038722057692de3b4641ff9b72b1b1ebadf149.png'
  },
  {
    name: '已上架商品',
    routeUrl: '/goods/phyGoodsManage/groundGoods',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/159046320318374e59449e96548cca798a9681b0ac893.png'
  },
  {
    name: '实物商品订单',
    routeUrl: '/order/shoppingmall/phyGoodsOrder',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/1590463268304b8fb014eedd646a185cc4595001371de.png'
  },
  {
    name: '签到记录',
    routeUrl: '/takeBack/volunteer/signIn',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/1590463391427973298b09bc640158d6e47427a1cc659.png'
  },
  {
    name: '家庭列表',
    routeUrl: '/member/familyList',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/1590463598503d29c431c9f7a49c296bb0d9a7de4bc33.png'
  },
  {
    name: '添加商品',
    routeUrl: '/goods/phyGoodsManage/addGoods',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/15904637032097b3c2418989a41a09fa0570cd95c3f42.png'
  },
  {
    name: '未上架商品',
    routeUrl: '/goods/phyGoodsManage/houseGoods',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200526/1590463774100d5033fad346e4e379b7ae19aaa7cdfea.png'
  },
  {
    name: '商品库配置',
    routeUrl: '/goods/machineManage/list',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200826/159840553228960b0377f309645bd9621a7a64ecdc679.png'
  },
  {
    name: '兑换机价格配置',
    routeUrl: '/goods/machineManage/price',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200826/15984053942101e19060a50c0421789143ffdbbeb7c30.png'
  },
  {
    name: '兑换活动价格配置',
    routeUrl: '/goods/activePrice/activityPrice',
    imgSrc:
      'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200826/15984053942101e19060a50c0421789143ffdbbeb7c30.png'
  },
  {
    name: '街道列表',
    routeUrl: '/areaManage/street',
    imgSrc: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200826/1598405701452b1473e19822f45adbf2759bcc46ef7ab.png'
  },
  {
    name: '应用参数配置',
    routeUrl: '/system/applet',
    imgSrc: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200826/15984055807487016b4d7dff24a02928f6fcd8caf434d.png'
  },
  {
    name: '小区管理',
    routeUrl: '/areaManage/community',
    imgSrc: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200826/15984056585840bcb97a8ef0e41229514801e6aa8efc4.png'
  },
  {
    name: '兑换机管理',
    routeUrl: '/device/conversion/list',
    imgSrc:
    'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200831/159886459726161456a859d684f46b08cf858f433aba8.png'
  },
  {
    name: '智能秤管理',
    routeUrl: '/device/smartScales/list',
    imgSrc:
    'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200831/159886459726161456a859d684f46b08cf858f433aba8.png'
  },
  {
    name: '首页公告管理',
    routeUrl: '/homeNotice/list',
    imgSrc: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200831/15988646505984ad8afa1aa75470582f5965ed3a99439.png'
  },
  {
    name: '积分资产排行',
    routeUrl: '/operation/integral/rankList',
    imgSrc: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200911/15998085515460c7144f6bfdb49329d66db9df74eac26.png'
  },
  {
    name: '积分规则配置',
    routeUrl: '/operation/integral/configRule',
    imgSrc: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200911/1599808573991d9681ae7715742d5ba489b59ad2a9b10.png'
  },
  {
    name: '补货记录',
    routeUrl: '/device/replenishment/list',
    imgSrc: 'http://ito-boss-img.oss-cn-hangzhou.aliyuncs.com/material/20200925/1600997724643c2741d1584cd407689a700041fc1473a.png'
  }
]
export default imgList
