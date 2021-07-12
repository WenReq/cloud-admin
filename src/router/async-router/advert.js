export default [
  {
    path: '/advert/floorAdvertList',
    name: 'floorAdvertList',
    meta: {
      keepAlive: true,
      title: 'Banner配置'
    },
    component: () =>
      import(/* webpackChunkName: "floorAdvertList" */ '@/views/advert/terminalAd/floorAdvertList.vue')
  },
  {
    path: '/advert/floorAdvertList/floorAdvertDetails',
    name: 'floorAdvertDetails',
    meta: {
      title: 'Banner配置详情'
    },
    component: () =>
      import(/* webpackChunkName: "floorAdvertDetails" */ '@/views/advert/terminalAd/floorAdvertDetails.vue')
  },
  {
    path: '/advert/terminalAd/adDelivery',
    name: 'adDelivery',
    meta: {
      title: '设备广告投放'
    },
    component: () =>
      import(/* webpackChunkName: "adDelivery" */ '@/views/advert/terminalAd/adDelivery.vue')
  },
  {
    path: '/advert/terminalAd/adDelivery/view',
    name: 'adDeliverydetailview',
    meta: {
      title: '查看'
    },
    component: () =>
      import(/* webpackChunkName: "adDeliverydetailview" */ '@/views/advert/terminalAd/adDeliverydetail.vue')
  },
  {
    path: '/advert/terminalAd/adDelivery/edit',
    name: 'adDeliverydetailedit',
    meta: {
      title: '编辑'
    },
    component: () =>
      import(/* webpackChunkName: "adDeliverydetailedit" */ '@/views/advert/terminalAd/adDeliverydetail.vue')
  }
]
