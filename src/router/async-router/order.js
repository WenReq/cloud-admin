export default [
  {
    path: '/order/takeBack/reserve',
    name: 'reserve',
    meta: {
      keepAlive: true,
      title: '预约订单记录'
    },
    component: () =>
      import(
        /* webpackChunkName: "reserve" */ '@/views/order/takeBack/reserve.vue'
      )
  },
  {
    path: '/order/takeBack/reserveDetail',
    name: 'reserveDetail',
    meta: {
      title: '预约订单记录详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "reserve" */ '@/views/order/takeBack/reserveDetail.vue'
      )
  },
  {
    path: '/order/takeBack/meet',
    name: 'meetOrder',
    meta: {
      keepAlive: true,
      title: '接单回收记录'
    },
    component: () =>
      import(
        /* webpackChunkName: "meetOrder" */ '@/views/order/takeBack/order.vue'
      )
  },
  {
    path: '/order/takeBack/meetDetail',
    name: 'meetOrderDetail',
    meta: {
      title: '详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "meetOrder" */ '@/views/order/takeBack/orderDetail.vue'
      )
  },
  {
    path: '/order/exchange/entity',
    name: 'exchangeEntity',
    meta: {
      keepAlive: true,
      title: '实体店铺兑换'
    },
    component: () =>
      import(
        /* webpackChunkName: "exchangeEntity" */ '@/views/order/exchange/entity.vue'
      )
  },
  {
    path: '/order/exchange/entityDetail',
    name: 'exchangeEntityDetail',
    meta: {
      title: '实体店铺兑换详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "exchangeEntity" */ '@/views/order/exchange/entityDetail.vue'
      )
  },
  {
    path: '/order/exchange/onlineMall',
    name: 'onlineMall',
    meta: {
      keepAlive: true,
      title: '线上商城兑换'
    },
    component: () =>
      import(
        /* webpackChunkName: "onlineMall" */ '@/views/order/exchange/onlineMall.vue'
      )
  },
  {
    path: '/order/exchange/onlineMallDetails',
    name: 'onlineMallDetails',
    meta: {
      title: '线上商城兑换详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "onlineMallDetails" */ '@/views/order/exchange/onlineMallDetails.vue'
      )
  },
  {
    path: '/order/exchange/offline',
    name: 'offline',
    meta: {
      keepAlive: true,
      title: '线下活动兑换'
    },
    component: () =>
      import(
        /* webpackChunkName: "offline" */ '@/views/order/exchange/offline.vue'
      )
  },
  {
    path: '/order/exchange/offlineDetails',
    name: 'offlineDetails',
    meta: {
      title: '线下活动兑换详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "offlineDetails" */ '@/views/order/exchange/offlineDetails.vue'
      )
  },
  {
    path: '/order/exchange/machineList',
    name: 'machineList',
    meta: {
      keepAlive: true,
      title: '兑换机兑换'
    },
    component: () =>
      import(
        /* webpackChunkName: "machineList" */ '@/views/order/exchange/machineList.vue'
      )
  },
  {
    path: '/order/exchange/machineDetails',
    name: 'machineDetails',
    meta: {
      title: '兑换机兑换详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "machineDetails" */ '@/views/order/exchange/machineDetails.vue'
      )
  },
  {
    path: '/order/takeBack/settle',
    name: 'settle',
    meta: {
      keepAlive: true,
      title: '结算订单记录'
    },
    component: () =>
      import(
        /* webpackChunkName: "meetOrder" */ '@/views/order/takeBack/settle.vue'
      )
  },
  {
    path: '/order/kitchen/index',
    name: 'kitchen',
    meta: {
      // keepAlive: true,
      title: '定点厨余记录'
    },
    component: () =>
      import(
        /* webpackChunkName: "meetOrder" */ '@/views/order/kitchen/index.vue'
      )
  },
  {
    path: '/order/recycle/index',
    name: 'recycle',
    meta: {
      keepAlive: true,
      title: '定点回收记录'
    },
    component: () =>
      import(
        /* webpackChunkName: "meetOrder" */ '@/views/order/recycle/index.vue'
      )
  },
  {
    path: '/order/recycle/recycleDetail',
    name: 'recycleDetail',
    meta: {
      title: '定点回收记录详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "meetOrder" */ '@/views/order/recycle/view.vue'
      )
  },
  {
    path: '/order/smartScales/index',
    name: 'smartScales',
    meta: {
      keepAlive: true,
      title: '智能秤回收记录'
    },
    component: () =>
      import(
        /* webpackChunkName: "smartScales" */ '@/views/order/smartScales/index.vue'
      )
  },
  {
    path: '/order/smartScales/view',
    name: 'smartScalesView',
    meta: {
      title: '智能秤回收记录详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "smartScalesView" */ '@/views/order/smartScales/view.vue'
      )
  },
  {
    path: '/order/takeBack/settleDetail',
    name: 'settleDetail',
    meta: {
      title: '结算回收记录详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "meetOrder" */ '@/views/order/takeBack/settleDetail.vue'
      )
  },
  {
    path: '/order/delivery/record',
    name: 'deliveryRecord',
    meta: {
      keepAlive: true,
      title: '投递记录'
    },
    component: () =>
      import(
        /* webpackChunkName: "deliveryRecord" */ '@/views/order/device/deliveryRecord.vue'
      )
  },
  {
    path: '/order/delivery/recordDetail',
    name: 'deliveryRecordDetail',
    meta: {
      title: '投递记录详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "deliveryRecordDetail" */ '@/views/order/device/detail.vue'
      )
  },
  {
    path: '/order/delivery/withdrawRecord',
    name: 'withdrawRecord',
    meta: {
      keepAlive: true,
      title: '取币记录'
    },
    component: () =>
      import(
        /* webpackChunkName: "withdrawRecord" */ '@/views/order/device/withdrawRecord.vue'
      )
  },
  {
    path: '/order/delivery/withdrawDetails',
    name: 'withdrawDetails',
    meta: {
      title: '取币记录详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "withdrawDetails" */ '@/views/order/device/withdrawDetails.vue'
      )
  },
  {
    path: '/order/delivery/supplementaryRecord',
    name: 'supplementaryRecord',
    meta: {
      keepAlive: true,
      title: '补币记录'
    },
    component: () =>
      import(
        /* webpackChunkName: "supplementaryRecord" */ '@/views/order/device/supplementaryRecord.vue'
      )
  },
  {
    path: '/order/delivery/supplementaryDetails',
    name: 'supplementaryDetails',
    meta: {
      title: '补币记录详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "supplementaryDetails" */ '@/views/order/device/supplementaryDetails.vue'
      )
  },
  {
    path: '/order/takeBack/recovery',
    name: 'recovery',
    meta: {
      keepAlive: true,
      title: '回收订单总表'
    },
    component: () =>
      import(
        /* webpackChunkName: "recovery" */ '@/views/order/takeBack/recycling.vue'
      )
  },
  {
    path: '/order/takeBack/recoveryDetail',
    name: 'recoveryDetail',
    meta: {
      title: '回收订单详情'
    },
    component: () =>
      import(
        /* webpackChunkName: "recoveryDetail" */ '@/views/order/takeBack/recoveryDetail.vue'
      )
  },
  {
    path: '/order/shoppingmall/phyGoodsOrder',
    name: 'phyGoodsOrder',
    meta: {
      keepAlive: true,
      title: '实物商品订单'
    },
    component: () =>
      import(
        /* webpackChunkName: "phyGoodsOrder" */ '@/views/order/shoppingmall/phyGoodsOrder.vue'
      )
  },
  {
    path: '/order/shoppingmall/phyGoodsOrderEdit',
    name: 'phyGoodsOrderEdit',
    meta: {
      title: '订单管理'
    },
    component: () =>
      import(
        /* webpackChunkName: "phyGoodsOrderEdit" */ '@/views/order/shoppingmall/phyGoodsOrderDetail.vue'
      )
  },
  {
    path: '/order/shoppingmall/phyGoodsOrderView',
    name: 'phyGoodsOrderView',
    meta: {
      title: '详情查看'
    },
    component: () =>
      import(
        /* webpackChunkName: "phyGoodsOrderView" */ '@/views/order/shoppingmall/phyGoodsOrderDetail.vue'
      )
  }
]
